import React, { useState, useEffect } from 'react';
import { Database, Eye, EyeOff, AlertTriangle, ChevronRight, Map } from 'lucide-react';
import { UrbanEyeLogo, HackopesIcon } from './logos';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', tab: 'simulation' as const },
    { label: 'Command Center', tab: 'gis' as const, badge: activeDefectsCount > 0 ? String(activeDefectsCount) : undefined },
    { label: 'Analytics', tab: 'admin' as const },
    { label: 'Modules', tab: 'features' as const },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── LEFT: Logo ── */}
          <button
            onClick={() => onChangeTab('simulation')}
            className="flex items-center gap-3 select-none group flex-shrink-0"
          >
            <UrbanEyeLogo size={34} />
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                Urban EYE AI
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Road Safety & Infrastructure
              </div>
            </div>
          </button>

          {/* ── CENTER: Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, tab, badge }) => (
              <button
                key={tab}
                onClick={() => onChangeTab(tab)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab
                    ? 'text-sky-700 bg-sky-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
                {badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                    {badge}
                  </span>
                )}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* ── RIGHT: Controls ── */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* HackOpes Attribution */}
            <div
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 cursor-default"
              title="Team HackOpes · SIH 2026"
            >
              <HackopesIcon size={18} />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-slate-700">Hackopes</span>
                <span className="text-[9px] text-slate-400 mt-0.5">SIH 2026</span>
              </div>
            </div>

            {/* Datasets Button */}
            <button
              onClick={onOpenDatasets}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              Datasets
            </button>

            {/* DPDP Privacy Toggle */}
            <button
              onClick={onTogglePrivacyBlur}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                privacyBlur
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle DPDP Act 2023 Privacy Anonymization"
            >
              {privacyBlur
                ? <EyeOff className="w-3.5 h-3.5" />
                : <Eye className="w-3.5 h-3.5" />
              }
              <span className="hidden sm:inline">DPDP</span>
            </button>

            {/* Command Center CTA */}
            <button
              onClick={() => onChangeTab('gis')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Command Center</span>
              <span className="sm:hidden">Map</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex flex-col gap-1 p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              <span className={`block w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1">
            {navItems.map(({ label, tab, badge }) => (
              <button
                key={tab}
                onClick={() => { onChangeTab(tab); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'text-sky-700 bg-sky-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
                {badge && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                    {badge}
                  </span>
                )}
              </button>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={onOpenDatasets}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 text-xs font-medium text-slate-600 border border-slate-200"
              >
                <Database className="w-3.5 h-3.5" />
                Datasets
              </button>
              <button
                onClick={onTogglePrivacyBlur}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  privacyBlur
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {privacyBlur ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                DPDP
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
