/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PendingRentResident,
  PGProperty,
  SmsDispatchResult,
  BulkSmsReport
} from '../types/pg';
import { storageService } from './storageService';

export interface SmsGatewayInfo {
  provider: string;
  senderHeader: string;
  dltEntityId: string;
  apiStatus: 'connected' | 'degraded' | 'offline';
  remainingCredits: number;
  deliverySuccessRate: number; // e.g. 99.8%
  avgDeliverySeconds: number;
}

// Default pre-approved DLT SMS Templates
export const SMS_TEMPLATES = [
  {
    id: 'rent_due_standard',
    name: 'Standard Rent Due Notice',
    tag: 'DLT-PG-01',
    content:
      'Dear {name}, monthly rent of Rs.{amount} for Room {room} at {pg_name} is due by {due_date}. Kindly pay via UPI to {upi_id}. Ignore if already paid. - Management'
  },
  {
    id: 'rent_overdue_urgent',
    name: 'Urgent Overdue Alert',
    tag: 'DLT-PG-02',
    content:
      'URGENT: Dear {name}, your rent Rs.{amount} for Room {room} at {pg_name} is overdue. Please settle immediately via UPI {upi_id} to avoid late fee. Call: {contact_phone}'
  },
  {
    id: 'rent_due_courtesy',
    name: 'Gentle Courtesy Reminder',
    tag: 'DLT-PG-03',
    content:
      'Hello {name}! Gentle reminder that hostel rent Rs.{amount} for Room {room} at {pg_name} is due on {due_date}. UPI ID: {upi_id}. Thank you for staying with us!'
  }
];

class MockSmsService {
  private credits: number = 4850;

  getGatewayStatus(): SmsGatewayInfo {
    return {
      provider: 'Fast2SMS & MSG91 Enterprise DLT Gateway',
      senderHeader: 'SVPGST',
      dltEntityId: 'DLT-ENT-1100298192',
      apiStatus: 'connected',
      remainingCredits: this.credits,
      deliverySuccessRate: 99.8,
      avgDeliverySeconds: 1.4
    };
  }

  interpolateTemplate(
    template: string,
    resident: PendingRentResident,
    property: PGProperty
  ): string {
    return template
      .replace(/{name}/g, resident.residentName)
      .replace(/{room}/g, `${resident.roomNumber} (${resident.bedLabel})`)
      .replace(/{amount}/g, resident.amountDue.toLocaleString('en-IN'))
      .replace(/{due_date}/g, resident.dueDate)
      .replace(/{pg_name}/g, property.name)
      .replace(/{upi_id}/g, property.upiId)
      .replace(/{contact_phone}/g, property.contactPhone || '+91 98450 12345');
  }

  calculateMetrics(text: string) {
    const chars = text.length;
    // Standard GSM 03.38 is 160 chars for 1 segment, then 153 chars per concatenated segment
    const segments = chars <= 160 ? 1 : Math.ceil(chars / 153);
    return {
      characterCount: chars,
      segmentCount: segments,
      creditsRequired: segments
    };
  }

  async sendSingleSms(
    resident: PendingRentResident,
    property: PGProperty,
    customTemplate?: string
  ): Promise<SmsDispatchResult> {
    const rawTemplate = customTemplate || SMS_TEMPLATES[0].content;
    const interpolated = this.interpolateTemplate(rawTemplate, resident, property);
    const metrics = this.calculateMetrics(interpolated);

    // Simulate carrier network delay (150-250ms)
    await new Promise(resolve => setTimeout(resolve, 180));

    const messageSid = `SM_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const carrierCodes = ['AIRTEL-DL', 'JIO-MUM', 'VI-KAR', 'BSNL-BLR'];
    const carrier = carrierCodes[Math.floor(Math.random() * carrierCodes.length)];

    // Deduct credits
    this.credits = Math.max(0, this.credits - metrics.creditsRequired);

    // Record into storageService reminders history
    storageService.sendReminder({
      pgId: property.id,
      residentName: resident.residentName,
      residentPhone: resident.residentPhone,
      residentEmail: resident.residentEmail,
      channel: 'sms',
      templateType: 'rent_due',
      title: `Rent Due Notice - Room ${resident.roomNumber} (${messageSid})`,
      message: interpolated
    });

    return {
      messageSid,
      bookingId: resident.bookingId,
      residentName: resident.residentName,
      recipientPhone: resident.residentPhone,
      roomNumber: resident.roomNumber,
      amountDue: resident.amountDue,
      message: interpolated,
      characterCount: metrics.characterCount,
      segmentCount: metrics.segmentCount,
      status: 'delivered',
      carrierCode: carrier,
      sentAt: new Date().toISOString()
    };
  }

  async sendBulkSms(
    residents: PendingRentResident[],
    property: PGProperty,
    template: string,
    onProgress?: (completed: number, total: number, lastResult: SmsDispatchResult) => void
  ): Promise<BulkSmsReport> {
    const results: SmsDispatchResult[] = [];
    let totalSegments = 0;
    let totalAmount = 0;

    for (let i = 0; i < residents.length; i++) {
      const res = residents[i];
      const dispatchResult = await this.sendSingleSms(res, property, template);
      results.push(dispatchResult);
      totalSegments += dispatchResult.segmentCount;
      totalAmount += dispatchResult.amountDue;

      if (onProgress) {
        onProgress(i + 1, residents.length, dispatchResult);
      }
    }

    const report: BulkSmsReport = {
      batchId: `BATCH-SMS-${Date.now()}`,
      pgId: property.id,
      totalRecipients: residents.length,
      successfulDeliveries: results.filter(r => r.status === 'delivered').length,
      failedDeliveries: results.filter(r => r.status === 'failed').length,
      totalAmountReminded: totalAmount,
      totalSegmentsUsed: totalSegments,
      dispatchedAt: new Date().toISOString(),
      results
    };

    return report;
  }
}

export const mockSmsService = new MockSmsService();
