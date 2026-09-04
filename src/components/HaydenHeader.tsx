import React from 'react';
import { Shield, Cpu, Activity, Database, FileText, Sparkles, MapPin, EyeOff, Eye } from 'lucide-react';
import { UrbanEyeLogo, HackopesIcon, HackopesLogo } from './logos';

interface HaydenHeaderProps {
  activeTab: 'simulation' | 'gis' | 'admin' | 'features';
  onChangeTab: (tab: 'simulation' | 'gis' | 'admin' | 'features') => void;
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
        {/* Application Logo: Urban Eye AI */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onChangeTab('simulation')}>
          <UrbanEyeLogo size={42} />
          
          <div className="hidden sm:flex items-center gap-2 pl-2.5 border-l border-slate-200">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200/60 tracking-wide">
              SIH PROTOTYPE
            </span>
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
            onClick={() => onChangeTab('admin')}
            className={`px-3.5 py-1.5 rounded-lg transition-all relative ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin & Warranty
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-600 text-white font-bold">
              NEW
            </span>
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

        {/* Right Tools, Team HackOpes Logo & Research Datasets Link */}
        <div className="flex items-center gap-2.5">
          {/* Team HackOpes Attribution Badge */}
          <div 
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xs hover:border-cyan-500/40 transition-colors cursor-default"
            title="class Hackopes { creativeSolutions() } • Prototype Creators"
          >
            <HackopesIcon size={24} />
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 tracking-wide">
                  Hackopes
                </span>
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-300 uppercase">
                  Team
                </span>
              </div>
              <span className="text-[8px] font-mono text-slate-400 mt-0.5 hidden xl:inline">
                class Hackopes &#123; creativeSolutions() &#125;
              </span>
            </div>
          </div>

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

