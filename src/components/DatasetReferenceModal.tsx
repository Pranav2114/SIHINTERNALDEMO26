import React from 'react';
import { X, Database, CheckCircle, ExternalLink, BookOpen, Layers } from 'lucide-react';
import { RESEARCH_DATASETS } from '../data/mockData';

interface DatasetReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatasetReferenceModal: React.FC<DatasetReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Government & Research Datasets Catalog
              </h3>
              <p className="text-xs text-slate-500">
                Cited in the Feature Specification Document for Model Training & Validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
            All models in this prototype are architected around benchmarked Indian datasets from the Indian Institute of Science (IISc Bengaluru), ISRO Bhuvan, and the Ministry of Housing & Urban Affairs (MoHUA).
          </div>

          <div className="space-y-3">
            {RESEARCH_DATASETS.map((ds) => (
              <div
                key={ds.code}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      {ds.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{ds.name}</h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-bold">
                    {ds.benchmarkAccuracy}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">Volume: </span>
                    <span className="text-slate-800 font-medium">{ds.size}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Authority: </span>
                    <span className="text-slate-800 font-medium">{ds.provider}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ds.classes.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Smart India Hackathon Technical Compliance</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
