import React from 'react';
import { Shield, Cpu, Activity, Database, FileText, Sparkles, MapPin, EyeOff, Eye } from 'lucide-react';

interface HaydenHeaderProps {
  activeTab: 'simulation' | 'gis' | 'features';
  onChangeTab: (tab: 'simulation' | 'gis' | 'features') => void;
  onOpenDatasets: () => void;
  privacyBlur: boolean;
  onTogglePrivacyBlur: () => void;
  activeDefectsCount: number;
}

export const HaydenHeader: React.FC<HaydenHeaderProps> = ({
  activeTab,
  onChangeTab,
  onOpenDatasets,
  privacyBlur,
  onTogglePrivacyBlur,
  activeDefectsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeTab('simulation')}>
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
            M
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                MargDrishti<span className="text-blue-600">.ai</span>
              </span>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full tracking-wide">
                ACTIVE PROTOTYPE
              </span>
            </div>
            <div className="text-xs text-slate-500 hidden md:block">
              AI Road Safety & Infrastructure Platform • SIH Prototype
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Clean Minimalism pill navigation) */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => onChangeTab('simulation')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'simulation'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vision AI 3D
          </button>
          <button
            onClick={() => onChangeTab('gis')}
            className={`px-3.5 py-1.5 rounded-lg transition-all relative ${
              activeTab === 'gis'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GIS Command
            {activeDefectsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {activeDefectsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onChangeTab('features')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'features'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            14-Module Spec
          </button>
        </nav>

        {/* Right Tools & Research Datasets Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDatasets}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Datasets (RDD2022)</span>
          </button>

          <button
            onClick={onTogglePrivacyBlur}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              privacyBlur
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Toggle DPDP Act Privacy Blur"
          >
            {privacyBlur ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">DPDP Blur</span>
          </button>
        </div>
      </div>
    </header>
  );
};

