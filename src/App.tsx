import React, { useState } from 'react';
import { 
  SIMULATION_SCENES, INITIAL_DEFECTS, FLEET_BUSES, 
  CITY_HOTSPOTS, INFRASTRUCTURE_RECOMMENDATIONS, PENALTY_STATS, EMERGENCY_DISPATCH_LOGS 
} from './data/mockData';
import { SimulationScene, ViolationType, RoadDefect } from './types';
import { HaydenHeader } from './components/HaydenHeader';
import { HaydenHeroSection } from './components/HaydenHeroSection';
import { CentralGisDashboard } from './components/CentralGisDashboard';
import { FeatureSpecificationSuite } from './components/FeatureSpecificationSuite';
import { AdminCityAnalyticsPortal } from './components/AdminCityAnalyticsPortal';
import { DatasetReferenceModal } from './components/DatasetReferenceModal';
import { WorkOrderReportModal } from './components/WorkOrderReportModal';
import { UrbanEyeLogo, HackopesLogo } from './components/logos';
import { Sparkles, Shield, Database, Github, Cpu, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentSceneId, setCurrentSceneId] = useState<ViolationType>('road_defect');
  const [activeTab, setActiveTab] = useState<'simulation' | 'gis' | 'admin' | 'features'>('simulation');
  const [privacyBlur, setPrivacyBlur] = useState<boolean>(true);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState<boolean>(false);
  const [selectedDefectForWorkOrder, setSelectedDefectForWorkOrder] = useState<RoadDefect | null>(null);

  const currentScene = SIMULATION_SCENES.find(s => s.id === currentSceneId) || SIMULATION_SCENES[0];

  const handleSelectScene = (sceneId: ViolationType) => {
    setCurrentSceneId(sceneId);
  };

  const handleSelectDefectFromMap = (defect: RoadDefect) => {
    // We can also switch to simulation or view details
  };

  const handleOpenWorkOrder = (defect: RoadDefect) => {
    setSelectedDefectForWorkOrder(defect);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white font-sans">
      {/* Top Header */}
      <HaydenHeader
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenDatasets={() => setIsDatasetModalOpen(true)}
        privacyBlur={privacyBlur}
        onTogglePrivacyBlur={() => setPrivacyBlur(!privacyBlur)}
        activeDefectsCount={INITIAL_DEFECTS.filter(d => d.severity === 'high').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {activeTab === 'simulation' && (
          <HaydenHeroSection
            currentScene={currentScene}
            onSelectScene={handleSelectScene}
            privacyBlur={privacyBlur}
            onTogglePrivacyBlur={() => setPrivacyBlur(!privacyBlur)}
            onOpenGis={() => setActiveTab('gis')}
            onOpenAdmin={() => setActiveTab('admin')}
            onOpenFeatures={() => setActiveTab('features')}
            onOpenDatasets={() => setIsDatasetModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            <AdminCityAnalyticsPortal
              defects={INITIAL_DEFECTS}
              hotspots={CITY_HOTSPOTS}
              infrastructureRecs={INFRASTRUCTURE_RECOMMENDATIONS}
              penaltyStats={PENALTY_STATS}
              emergencyDispatches={EMERGENCY_DISPATCH_LOGS}
              onSelectDefect={handleSelectDefectFromMap}
              onIssueWorkOrder={handleOpenWorkOrder}
            />
          </div>
        )}

        {activeTab === 'gis' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  FEATURE 13 • CENTRALIZED GIS DASHBOARD
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Fleet Spatial Telemetry & Defect Command
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregating transit bus edge cameras, CCTV junctions, and sensor anomaly feeds
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDatasetModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm transition-colors"
                >
                  Inspect Research Datasets
                </button>
              </div>
            </div>

            <CentralGisDashboard
              defects={INITIAL_DEFECTS}
              fleet={FLEET_BUSES}
              onSelectDefect={handleSelectDefectFromMap}
              onGenerateWorkOrder={handleOpenWorkOrder}
            />
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                FEATURE SPECIFICATION DOCUMENT
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                All 14 Modules Interactive Technical Suite
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Full functional implementation of the Smart India Hackathon specification requirements
              </p>
            </div>

            <FeatureSpecificationSuite
              onOpenDatasets={() => setIsDatasetModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Official Footnote / Hackathon Credits */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            {/* Left: Urban Eye AI application logo & info */}
            <div className="flex items-center gap-3">
              <UrbanEyeLogo size={36} />
              <div className="hidden sm:block pl-3 border-l border-slate-200 text-left">
                <div className="text-xs font-semibold text-slate-800">
                  Smart India Hackathon (SIH) Prototype
                </div>
                <div className="text-[11px] text-slate-500">
                  Automated Transit Vision & Municipal Road Safety Platform
                </div>
              </div>
            </div>

            {/* Right: Team HackOpes Logo & Tagline */}
            <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm">
              <HackopesLogo size={34} showTagline={true} layout="horizontal" theme="dark" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span>RDD2022 / CRACK500 Benchmark</span>
              <span>•</span>
              <span>IISc UVH-26 & BMD-45</span>
              <span>•</span>
              <span>CPWD Schedule of Rates 2024</span>
              <span>•</span>
              <span>DPDP Act 2023 Compliant</span>
            </div>

            <div className="font-mono text-slate-400 text-[10px]">
              Built with precision by Team HackOpes
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DatasetReferenceModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
      />

      <WorkOrderReportModal
        defect={selectedDefectForWorkOrder}
        onClose={() => setSelectedDefectForWorkOrder(null)}
      />
    </div>
  );
}
