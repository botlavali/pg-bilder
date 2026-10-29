/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  DollarSign,
  Copy,
  Check,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight,
  Eye
} from 'lucide-react';
import { PGProperty, PendingRentResident, BulkSmsReport } from '../../types/pg';
import { storageService } from '../../services/storageService';
import { mockSmsService, SMS_TEMPLATES } from '../../services/mockSmsService';

interface BulkReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PGProperty;
  onDispatchComplete: () => void;
}

export const BulkReminderModal: React.FC<BulkReminderModalProps> = ({
  isOpen,
  onClose,
  property,
  onDispatchComplete
}) => {
  const [residents, setResidents] = useState<PendingRentResident[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'overdue' | 'upcoming'>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(SMS_TEMPLATES[0].id);
  const [customTemplateText, setCustomTemplateText] = useState<string>(SMS_TEMPLATES[0].content);
  const [previewResidentId, setPreviewResidentId] = useState<string>('');

  // Dispatch state
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchProgress, setDispatchProgress] = useState<number>(0);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [dispatchReport, setDispatchReport] = useState<BulkSmsReport | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load residents with pending rent
  useEffect(() => {
    if (isOpen && property) {
      const list = storageService.getPendingRentResidents(property.id);
      setResidents(list);
      // Select all by default
      setSelectedIds(list.map(r => r.bookingId));
      if (list.length > 0) {
        setPreviewResidentId(list[0].bookingId);
      }
      setIsDispatching(false);
      setDispatchProgress(0);
      setDispatchLogs([]);
      setDispatchReport(null);
    }
  }, [isOpen, property]);

  if (!isOpen) return null;

  const gatewayInfo = mockSmsService.getGatewayStatus();

  // Filtered residents
  const filteredResidents = residents.filter(r => {
    if (filterMode === 'overdue') return r.dueStatus === 'overdue';
    if (filterMode === 'upcoming') return r.dueStatus === 'upcoming' || r.dueStatus === 'due_today';
    return true;
  });

  const selectedResidents = residents.filter(r => selectedIds.includes(r.bookingId));
  const totalSelectedDue = selectedResidents.reduce((sum, r) => sum + r.amountDue, 0);
  const totalOverdueCount = residents.filter(r => r.dueStatus === 'overdue').length;
  const totalOverdueAmount = residents
    .filter(r => r.dueStatus === 'overdue')
    .reduce((sum, r) => sum + r.amountDue, 0);

  const activePreviewResident =
    residents.find(r => r.bookingId === previewResidentId) || residents[0];

  const previewMessage = activePreviewResident
    ? mockSmsService.interpolateTemplate(customTemplateText, activePreviewResident, property)
    : '';

  const metrics = mockSmsService.calculateMetrics(previewMessage);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredResidents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResidents.map(r => r.bookingId));
    }
  };

  const toggleSelectResident = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleTemplateChange = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const found = SMS_TEMPLATES.find(t => t.id === tmplId);
    if (found) {
      setCustomTemplateText(found.content);
    }
  };

  const insertVariable = (variableTag: string) => {
    setCustomTemplateText(prev => `${prev} ${variableTag}`);
  };

  const handleStartBulkDispatch = async () => {
    if (selectedResidents.length === 0) return;

    setIsDispatching(true);
    setDispatchProgress(0);
    setDispatchLogs(['Initiating Fast2SMS & MSG91 DLT gateway connection...']);

    try {
      const report = await mockSmsService.sendBulkSms(
        selectedResidents,
        property,
        customTemplateText,
        (completed, total, lastResult) => {
          const pct = Math.round((completed / total) * 100);
          setDispatchProgress(pct);
          setDispatchLogs(prev => [
            `✓ [${completed}/${total}] SMS delivered to ${lastResult.residentName} (${lastResult.recipientPhone}) · SID: ${lastResult.messageSid}`,
            ...prev.slice(0, 8)
          ]);
        }
      );

      setDispatchReport(report);
      setIsDispatching(false);
      onDispatchComplete();
    } catch (e) {
      setIsDispatching(false);
      setDispatchLogs(prev => ['Error during dispatch. Please retry.', ...prev]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Bulk SMS Rent Reminder Engine
                </h3>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Fast2SMS / MSG91 Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target residents with pending rent · Auto-generates personalized SMS with UPI payment link
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {/* Summary KPI Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Pending Residents</span>
              <span className="text-xl font-black text-slate-900 tabular-nums">
                {residents.length}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {totalOverdueCount} Overdue · {residents.length - totalOverdueCount} Upcoming
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Unpaid Rent</span>
              <span className="text-xl font-black text-rose-600 tabular-nums">
                ₹{totalOverdueAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Overdue across all floors
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Selected for Dispatch</span>
              <span className="text-xl font-black text-indigo-600 tabular-nums">
                {selectedResidents.length} / {residents.length}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5 tabular-nums">
                ₹{totalSelectedDue.toLocaleString('en-IN')} to remind
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">SMS Gateway Credits</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xl font-black text-emerald-600 tabular-nums">
                  {gatewayInfo.remainingCredits.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                  {gatewayInfo.senderHeader}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Cost: ₹0.22 / credit · {gatewayInfo.deliverySuccessRate}% uptime
              </span>
            </div>
          </div>

          {/* Active Dispatch Progress Box (shown while dispatching or on report) */}
          {(isDispatching || dispatchReport) && (
            <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    dispatchReport ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white animate-spin'
                  }`}>
                    {dispatchReport ? <CheckCircle2 className="w-5 h-5" /> : <RefreshCw className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {dispatchReport ? 'Bulk SMS Reminders Delivered Successfully!' : 'Dispatching SMS to Telecommunication Gateway...'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {dispatchReport
                        ? `Batch ID: ${dispatchReport.batchId} · ${dispatchReport.successfulDeliveries} of ${dispatchReport.totalRecipients} messages acknowledged`
                        : `Processing recipient queue... ${dispatchProgress}% completed`}
                    </p>
                  </div>
                </div>

                {dispatchReport && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                    ₹{dispatchReport.totalAmountReminded.toLocaleString('en-IN')} Reminded
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    dispatchReport ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${dispatchProgress}%` }}
                />
              </div>

              {/* Live terminal dispatch logs */}
              <div className="bg-slate-900 text-slate-200 font-mono text-[11px] p-3 rounded-xl max-h-36 overflow-y-auto space-y-1">
                {dispatchLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-indigo-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main 2-Column Workflow: Left: Recipients Selection | Right: SMS Template & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Recipient Selector Table */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Step 1: Select Residents with Pending Payments
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedResidents.length} of {residents.length} selected for reminder dispatch
                  </p>
                </div>

                {/* Filter & Select All */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setFilterMode('all')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      All ({residents.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('overdue')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        filterMode === 'overdue' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Overdue ({totalOverdueCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('upcoming')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        filterMode === 'upcoming' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Upcoming ({residents.length - totalOverdueCount})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                  >
                    {selectedIds.length === filteredResidents.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Residents Table */}
              <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                {filteredResidents.map(res => {
                  const isSelected = selectedIds.includes(res.bookingId);
                  const isPreviewing = previewResidentId === res.bookingId;

                  return (
                    <div
                      key={res.bookingId}
                      className={`p-3.5 flex items-center justify-between gap-3 text-xs transition cursor-pointer ${
                        isSelected ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50'
                      } ${isPreviewing ? 'ring-1 ring-inset ring-indigo-500' : ''}`}
                      onClick={() => setPreviewResidentId(res.bookingId)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectResident(res.bookingId)}
                          onClick={e => e.stopPropagation()}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 truncate">
                              {res.residentName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {res.residentPhone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>Room {res.roomNumber} ({res.bedLabel})</span>
                            <span>·</span>
                            <span className="capitalize">{res.sharingType.replace('-', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right shrink-0">
                        <div>
                          <p className="font-bold text-slate-900 tabular-nums">
                            ₹{res.amountDue.toLocaleString('en-IN')}
                          </p>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              res.dueStatus === 'overdue'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : res.dueStatus === 'due_today'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-sky-50 text-sky-700 border border-sky-200'
                            }`}
                          >
                            {res.dueDate}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setPreviewResidentId(res.bookingId);
                          }}
                          className={`p-1.5 rounded-lg transition ${
                            isPreviewing
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                          }`}
                          title="Preview SMS text for this resident"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredResidents.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500">
                  No residents match the selected filter.
                </div>
              )}
            </div>

            {/* Right 5 Columns: SMS Template, Dynamic Tags & Preview */}
            <div className="lg:col-span-5 space-y-4">
              {/* Template Selector & Editor */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Step 2: Compose SMS Template
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    DLT Compliant
                  </span>
                </div>

                {/* Template Preset Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pre-Approved Template Format
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={e => handleTemplateChange(e.target.value)}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg focus:border-indigo-600 focus:outline-none bg-white"
                  >
                    {SMS_TEMPLATES.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.tag})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variable Tags Chips */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Insert Dynamic Tags (Click to insert):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { tag: '{name}', label: 'Resident Name' },
                      { tag: '{amount}', label: 'Due Amount' },
                      { tag: '{room}', label: 'Room' },
                      { tag: '{due_date}', label: 'Due Date' },
                      { tag: '{upi_id}', label: 'UPI VPA' },
                      { tag: '{pg_name}', label: 'PG Name' },
                      { tag: '{contact_phone}', label: 'Phone' }
                    ].map(v => (
                      <button
                        key={v.tag}
                        type="button"
                        onClick={() => insertVariable(v.tag)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-[10px] font-mono font-semibold rounded transition border border-slate-200"
                      >
                        +{v.tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <textarea
                    rows={4}
                    value={customTemplateText}
                    onChange={e => setCustomTemplateText(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none font-mono text-slate-800 leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>
                      Length: <strong className="tabular-nums text-slate-900">{metrics.characterCount}</strong> chars
                    </span>
                    <span>
                      Segments: <strong className="tabular-nums text-indigo-600">{metrics.segmentCount}</strong> SMS ({metrics.segmentCount} credit/recipient)
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulated Mobile SMS Bubble Preview */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-slate-200">
                      Live SMS Preview: {activePreviewResident?.residentName || 'Resident'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    Sender: {gatewayInfo.senderHeader}
                  </span>
                </div>

                {/* Simulated SMS Chat Bubble */}
                <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-100 space-y-2 leading-relaxed">
                  <p>{previewMessage}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[10px] text-slate-400">
                    <span>Fast2SMS Gateway · 100% Delivery</span>
                    <span>Now · Delivered</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>To: {activePreviewResident?.residentPhone}</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">
                    Rent Due: ₹{activePreviewResident?.amountDue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              All dispatched SMS reminders are recorded with time & message SID in the Communication Log.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isDispatching}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              {dispatchReport ? 'Close' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleStartBulkDispatch}
              disabled={selectedResidents.length === 0 || isDispatching}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-sm flex items-center justify-center gap-2 ${
                selectedResidents.length === 0 || isDispatching
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
              }`}
            >
              {isDispatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching {dispatchProgress}%...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Send SMS to {selectedResidents.length} Residents (₹
                    {totalSelectedDue.toLocaleString('en-IN')})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
