import React, { useState } from 'react';
import { 
  SIMULATION_SCENES, INITIAL_DEFECTS, FLEET_BUSES, 
  CITY_HOTSPOTS, INFRASTRUCTURE_RECOMMENDATIONS, PENALTY_STATS, EMERGENCY_DISPATCH_LOGS 
} from './data/mockData';
import { SimulationScene, ViolationType, RoadDefect } from './types';
import { HaydenHeader } from './components/HaydenHeader';
import { UrbanEyeLandingPage } from './components/UrbanEyeLandingPage';
import { CentralGisDashboard } from './components/CentralGisDashboard';
import { FeatureSpecificationSuite } from './components/FeatureSpecificationSuite';
import { AdminCityAnalyticsPortal } from './components/AdminCityAnalyticsPortal';
import { DatasetReferenceModal } from './components/DatasetReferenceModal';
import { WorkOrderReportModal } from './components/WorkOrderReportModal';
import { UrbanEyeLogo, HackopesLogo } from './components/logos';
import { Activity, Database, Shield } from 'lucide-react';

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

  const handleSelectDefectFromMap = (defect: RoadDefect) => {};

  const handleOpenWorkOrder = (defect: RoadDefect) => {
    setSelectedDefectForWorkOrder(defect);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>

      {/* ── NAVIGATION ── */}
      <HaydenHeader
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenDatasets={() => setIsDatasetModalOpen(true)}
        privacyBlur={privacyBlur}
        onTogglePrivacyBlur={() => setPrivacyBlur(!privacyBlur)}
        activeDefectsCount={INITIAL_DEFECTS.filter(d => d.severity === 'high').length}
      />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 pt-16">

        {/* INTELLIGENCE TAB */}
        {activeTab === 'simulation' && (
          <UrbanEyeLandingPage
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

        {/* ANALYTICS TAB */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
                    Analytics Portal
                  </span>
                  <div className="status-indicator text-xs">
                    <span className="dot" />
                    Live Data
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  City Warranty Audit & Resource Planning
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Contractor DLP management · Hotspot analysis · Penalty recovery · Infrastructure planning
                </p>
              </div>
              <button
                onClick={() => setIsDatasetModalOpen(true)}
                className="btn-outline text-sm"
              >
                <Database className="w-4 h-4" />
                Research Datasets
              </button>
            </div>
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

        {/* COMMAND CENTER TAB */}
        {activeTab === 'gis' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
                    Live Command Center
                  </span>
                  <div className="status-indicator text-xs">
                    <span className="dot" />
                    Streaming
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Urban Intelligence Command Center
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Fleet spatial telemetry · Traffic density analysis · Road defect mapping · Emergency dispatch
                </p>
              </div>
              <button
                onClick={() => setIsDatasetModalOpen(true)}
                className="btn-outline text-sm"
              >
                <Database className="w-4 h-4" />
                Inspect Datasets
              </button>
            </div>
            <CentralGisDashboard
              defects={INITIAL_DEFECTS}
              fleet={FLEET_BUSES}
              onSelectDefect={handleSelectDefectFromMap}
              onGenerateWorkOrder={handleOpenWorkOrder}
            />
          </div>
        )}

        {/* MODULES TAB */}
        {activeTab === 'features' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
                  Technical Specification
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  SIH 2026
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                All 14 AI Modules — Technical Specification
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Full implementation of Smart India Hackathon 2026 specification requirements
              </p>
            </div>
            <FeatureSpecificationSuite
              onOpenDatasets={() => setIsDatasetModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <UrbanEyeLogo size={36} />
              <div>
                <div className="text-sm font-bold text-slate-900 tracking-wide">Urban EYE AI</div>
                <div className="text-xs text-slate-500 mt-0.5">AI That Sees. Cities That Respond.</div>
                <div className="text-xs text-slate-400 mt-0.5">Smart India Hackathon 2026 · SIH Prototype</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
              <HackopesLogo size={32} showTagline={true} layout="horizontal" theme="light" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-slate-400">
              <span>RDD2022 / CRACK500 Benchmark</span>
              <span>•</span>
              <span>IISc UVH-26 & BMD-45</span>
              <span>•</span>
              <span>CPWD SoR 2024</span>
              <span>•</span>
              <span>DPDP Act 2023 Compliant</span>
              <span>•</span>
              <span>IRC:SP:77</span>
            </div>
            <div className="text-slate-400 text-xs flex-shrink-0">
              Built by Team HackOpes
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-100 bg-amber-50">
            <Activity className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Prototype Notice:</strong> All AI detections, sensor readings, fleet data, and analytics shown are simulated demo data for SIH 2026 prototype demonstration only. Not live government or municipal data.
            </p>
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
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
