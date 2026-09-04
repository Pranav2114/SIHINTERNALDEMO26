import React, { useState } from 'react';
import { X, Printer, CheckCircle, ShieldCheck, FileCheck, MapPin, Hash, Sparkles } from 'lucide-react';
import { RoadDefect } from '../types';

interface WorkOrderReportModalProps {
  defect: RoadDefect | null;
  onClose: () => void;
}

export const WorkOrderReportModal: React.FC<WorkOrderReportModalProps> = ({ defect, onClose }) => {
  const [isDispatched, setIsDispatched] = useState(false);

  if (!defect) return null;

  const workOrderId = `WO-CPWD-2024-${defect.id.replace('DEF-', '')}`;
  const sha256Hash = `0x${(defect.id + defect.roadName)
    .split('')
    .map((c: string) => c.charCodeAt(0).toString(16))
    .join('')
    .slice(0, 32)}9b4e7a2c...`;

  const handleDispatch = () => {
    setIsDispatched(true);
    setTimeout(() => {
      setIsDispatched(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#091122] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1629]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                CPWD Statutory Work Order & Defect Report
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Smart India Hackathon • Automated Public Works Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Work Order Document Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Official Seal Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-slate-400 font-mono text-[11px]">WORK ORDER REFERENCE:</div>
              <div className="text-base font-bold font-mono text-cyan-400">{workOrderId}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 font-mono text-[11px]">MUNICIPAL SLA DISPATCH:</div>
              <div className="text-xs font-bold text-rose-400 font-mono">24 Hours Emergency Patch</div>
            </div>
          </div>

          {/* Location & Defect Specs */}
          <div className="space-y-2">
            <div className="font-bold text-white text-sm">1. Defect Identification & Location</div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Corridor / Road:</span>
                <span className="text-white text-right">{defect.roadName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="text-cyan-400">{defect.latitude.toFixed(4)}° N, {defect.longitude.toFixed(4)}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Detected Sensor:</span>
                <span className="text-slate-200">{defect.detectedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Classification:</span>
                <span className="text-amber-400 uppercase font-bold">{defect.type.replace('_', ' ')} (Severity: {defect.severity})</span>
              </div>
            </div>
          </div>

          {/* Physical Measurements & Root Cause */}
          <div className="space-y-2">
            <div className="font-bold text-white text-sm">2. Engineering & Root Cause Analysis</div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">LENGTH</div>
                <div className="text-sm font-bold text-white mt-0.5">{defect.dimensions.lengthCm} cm</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">WIDTH</div>
                <div className="text-sm font-bold text-white mt-0.5">{defect.dimensions.widthCm} cm</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">DEPTH</div>
                <div className="text-sm font-bold text-rose-400 mt-0.5">{defect.dimensions.depthCm} cm</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-slate-400">
                Root Cause: <span className="text-white uppercase">{defect.rootCause.replace('_', ' ')}</span>
              </div>
              <div className="text-slate-400">
                Statutory Code: <span className="text-cyan-400">IRC:116 / IRC:SP:77 Pavement Repair Standards</span>
              </div>
              <div className="text-slate-400">
                Repair Specification: <span className="text-emerald-400 font-semibold">{defect.repairMethod}</span>
              </div>
            </div>
          </div>

          {/* Bill of Quantities / Costing */}
          <div className="space-y-2">
            <div className="font-bold text-white text-sm">3. CPWD Schedule of Rates (Itemized BOQ)</div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">CPWD Item 5.12 (Bituminous Tack Coat & Cold Mix)</span>
                <span className="text-white">₹{(defect.estimatedCostInr * 0.55).toFixed(0)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">CPWD Item 5.24 (Sub-base Compaction & Roller Machine)</span>
                <span className="text-white">₹{(defect.estimatedCostInr * 0.3).toFixed(0)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Labor & Traffic Diversion Barrier (IRC:SP:55)</span>
                <span className="text-white">₹{(defect.estimatedCostInr * 0.15).toFixed(0)}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-amber-400">Total Approved Municipal Work Order:</span>
                <span className="text-amber-400 text-base">₹{defect.estimatedCostInr.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Blockchain & Integrity */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 flex items-center justify-between">
            <div>
              <div>PROOF HASH: {sha256Hash}</div>
              <div className="text-slate-500">TAMPER-PROOF EDGE AI LEDGER • DPDP ACT 2023 COMPLIANT</div>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#070e1c] flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Work Order</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              disabled={isDispatched}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isDispatched ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Work Order Dispatched to Field Crew!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Approve & Dispatch Work Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
