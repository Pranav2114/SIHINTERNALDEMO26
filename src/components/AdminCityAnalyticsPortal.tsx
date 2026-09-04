import React, { useState } from 'react';
import { 
  Phone, AlertTriangle, CheckCircle2, Clock, Users, IndianRupee, Wrench, 
  Truck, ShieldAlert, Navigation, FileText, Sparkles, TrendingUp, BarChart3, 
  Activity, MapPin, Calendar, Building2, Search, Filter, ArrowRight, 
  ExternalLink, ShieldCheck, AlertCircle, Car, Bike, Send, Copy, Check, 
  RotateCcw, Siren, Radio, Eye, Camera, Compass, Trash2, Droplets,
  HardHat, Shield, Zap
} from 'lucide-react';
import { 
  RoadDefect, HotspotSensitivityZone, CityInfrastructureRecommendation, 
  PenaltyStat, EmergencyDispatchLog, DefectType 
} from '../types';

interface AdminCityAnalyticsPortalProps {
  defects: RoadDefect[];
  hotspots: HotspotSensitivityZone[];
  infrastructureRecs: CityInfrastructureRecommendation[];
  penaltyStats: PenaltyStat[];
  emergencyDispatches: EmergencyDispatchLog[];
  onSelectDefect?: (defect: RoadDefect) => void;
  onIssueWorkOrder?: (defect: RoadDefect) => void;
}

export const AdminCityAnalyticsPortal: React.FC<AdminCityAnalyticsPortalProps> = ({
  defects,
  hotspots,
  infrastructureRecs,
  penaltyStats,
  emergencyDispatches,
  onSelectDefect,
  onIssueWorkOrder
}) => {
  // Navigation tabs within Admin Portal
  const [activeAdminTab, setActiveAdminTab] = useState<
    'hotspots_sensitivity' | 'road_damage_warranty' | 'penalties' | 'installations' | 'ai_advisor'
  >('road_damage_warranty');

  // Selected defect for warranty & resource planning inspector
  const [selectedDefectId, setSelectedDefectId] = useState<string>(defects[0]?.id || 'DEF-8021');
  const selectedDefect = defects.find((d) => d.id === selectedDefectId) || defects[0];

  // Interactive What-if Worker & Cost Calculator State
  const [workerCount, setWorkerCount] = useState<number>(
    selectedDefect?.resourceEstimation?.workersNeeded || 5
  );

  // Filter for defect types in road damage tab
  const [defectTypeFilter, setDefectTypeFilter] = useState<string>('all');
  const [warrantyFilter, setWarrantyFilter] = useState<'all' | 'under_warranty' | 'municipal'>('all');

  // Contractor Call Modal state
  const [contractorCallModal, setContractorCallModal] = useState<{
    isOpen: boolean;
    defect: RoadDefect | null;
  }>({ isOpen: false, defect: null });

  // DLP Notice Modal State
  const [dlpNoticeModal, setDlpNoticeModal] = useState<{
    isOpen: boolean;
    defect: RoadDefect | null;
    copied: boolean;
  }>({ isOpen: false, defect: null, copied: false });

  // AI Assistant chat / report generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiReportGenerated, setAiReportGenerated] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Calculate dynamic labor & days based on worker adjustment
  const calculateDynamicPlanning = (defect: RoadDefect, workers: number) => {
    const baseDays = defect.resourceEstimation.estimatedDays;
    const baseWorkers = defect.resourceEstimation.workersNeeded;
    // Total worker-days
    const totalWorkerDays = baseDays * baseWorkers;
    const dynamicDays = Math.max(0.5, Number((totalWorkerDays / Math.max(1, workers)).toFixed(1)));
    const dailyRate = defect.resourceEstimation.laborRatePerDayInr;
    const dynamicLaborCost = Math.round(workers * dynamicDays * dailyRate);
    const materialCost = defect.resourceEstimation.materialCostInr;
    const equipmentCost = defect.resourceEstimation.equipmentCostInr;
    const dynamicTotalCost = dynamicLaborCost + materialCost + equipmentCost;

    return {
      dynamicDays,
      dynamicLaborCost,
      dynamicTotalCost,
      materialCost,
      equipmentCost
    };
  };

  const dynamicPlanning = selectedDefect 
    ? calculateDynamicPlanning(selectedDefect, workerCount)
    : { dynamicDays: 2, dynamicLaborCost: 7500, dynamicTotalCost: 15000, materialCost: 5000, equipmentCost: 2500 };

  // Calculate high-level city analytics summary
  const totalPenaltiesIssued = penaltyStats.reduce((acc, p) => acc + p.fineAmountTotalInr, 0);
  const totalPenaltiesCollected = penaltyStats.reduce((acc, p) => acc + p.fineAmountCollectedInr, 0);
  const totalPenaltiesPending = penaltyStats.reduce((acc, p) => acc + p.pendingAmountInr, 0);
  const overallCollectionRate = Math.round((totalPenaltiesCollected / totalPenaltiesIssued) * 100);

  const totalDefectsCount = defects.length;
  const underWarrantyCount = defects.filter((d) => d.contractorWarranty?.isUnderWarranty).length;
  const municipalBudgetCount = totalDefectsCount - underWarrantyCount;
  const warrantySavingsInr = defects
    .filter((d) => d.contractorWarranty?.isUnderWarranty)
    .reduce((acc, d) => acc + (d.resourceEstimation?.totalCostInr || d.estimatedCostInr), 0);

  // Filtered defects list
  const filteredDefects = defects.filter((d) => {
    if (defectTypeFilter !== 'all' && d.type !== defectTypeFilter) return false;
    if (warrantyFilter === 'under_warranty' && !d.contractorWarranty?.isUnderWarranty) return false;
    if (warrantyFilter === 'municipal' && d.contractorWarranty?.isUnderWarranty) return false;
    return true;
  });

  // Handle AI Report Generation
  const handleGenerateAiReport = (promptText?: string) => {
    const query = promptText || aiPrompt || 'Generate complete municipal status report';
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (query.toLowerCase().includes('warranty') || query.toLowerCase().includes('contractor') || query.toLowerCase().includes('damage')) {
        setAiReportGenerated(`### 🏛️ MUNICIPAL EXECUTIVE REPORT: ROAD DAMAGE & CONTRACTOR WARRANTY AUDIT
**Generated by MargDrishti AI Infrastructure Intelligence Unit**
**Reference Gazette Standards:** IRC:82 / CPWD SoR 2024 / MoRTH Sec 10

#### 1. Executive Summary & City Fund Protection
- **Total Carriageway Defects Audited:** ${totalDefectsCount} Active Stretches
- **Under Defect Liability Period (DLP) Warranty:** ${underWarrantyCount} Stretches (${Math.round((underWarrantyCount/totalDefectsCount)*100)}%)
- **City Treasury Capital Saved via Warranty Enforcement:** ₹${warrantySavingsInr.toLocaleString('en-IN')} (Contractors legally obligated to rectify at ₹0 city expense)
- **Municipal Responsibility (Post-Warranty/Civic Works):** ${municipalBudgetCount} Stretches

#### 2. Priority Active Defect: ${selectedDefect.title}
- **Location:** ${selectedDefect.roadName}
- **Defect Category:** ${selectedDefect.type.toUpperCase()} | Sub-Feature: ${selectedDefect.potholeDetectionMode || 'Edge Cam Sensor'}
- **Warranty Status:** ${selectedDefect.contractorWarranty?.isUnderWarranty ? '✅ UNDER ACTIVE CONTRACTOR WARRANTY' : '⚠️ MUNICIPAL BUDGET OBLIGATION'}
- **Contractor In-Charge:** ${selectedDefect.contractorWarranty?.contractorName}
- **Contract Number:** ${selectedDefect.contractorWarranty?.contractId} | **DLP Days Remaining:** ${selectedDefect.contractorWarranty?.daysRemaining} days
- **Legal Enforcement Action:** ${selectedDefect.contractorWarranty?.isUnderWarranty ? 'Contractor notice issued under IRC:82 Clause 10.4. Immediate 7-day cure period mandated.' : 'Direct municipal asphalt batching deployment approved.'}

#### 3. Resource & Labor Calculation (Trained Model Prediction)
- **Recommended Workforce:** ${workerCount} Trained Road Workers
- **Estimated Completion Duration:** ${dynamicPlanning.dynamicDays} Working Days
- **Scheduled Material Mix:** ${selectedDefect.resourceEstimation?.materialsList?.join(', ')}
- **Heavy Machinery:** ${selectedDefect.resourceEstimation?.equipmentList?.join(', ')}
- **Financial Allocation:** ₹${dynamicPlanning.dynamicTotalCost.toLocaleString('en-IN')} (Labor: ₹${dynamicPlanning.dynamicLaborCost.toLocaleString('en-IN')} | Materials: ₹${dynamicPlanning.materialCost.toLocaleString('en-IN')} | Equipment: ₹${dynamicPlanning.equipmentCost.toLocaleString('en-IN')})

#### 4. Traffic Mitigation & Arterial Detour Plan
- **Primary Detour Corridor:** ${selectedDefect.resourceEstimation?.suggestedDetour}
- **Projected Delay Dissipation:** ${selectedDefect.resourceEstimation?.detourCongestionReduction}
- **Advisory:** Coordinate with City Traffic Police Command for signal timing adjustments during active work hours.`);
      } else if (query.toLowerCase().includes('hotspot') || query.toLowerCase().includes('sensitivity')) {
        setAiReportGenerated(`### 🎯 HIGH-SENSITIVITY CRASH & RECURRENCE HOTSPOTS AUDIT
**Algorithm:** Recurrence Density Index & Spatio-Temporal Cluster Weighting

#### 1. First Priority Hotspot: Central Silk Board Junction (Hosur Road / ORR)
- **Recurrence Count:** 68 Logged Events in 90 Days | **Priority Rank:** 1st Priority
- **Primary Problem:** Pothole reformation due to underground seepage, unorganized inter-state bus idling, and heavy solid waste dumping.
- **Immediate Remedy:** 
  1. High-Mast ALPR Pole installation to eliminate double-parking bottlenecks.
  2. Dedicated concrete bus staging bay with high-strength mastic asphalt.
  3. Stormwater culvert widening to prevent monsoon base washing.

#### 2. Second Priority Hotspot: Kadubeesanahalli Junction (Outer Ring Road)
- **Recurrence Count:** 54 Logged Events | **Priority Rank:** 2nd Priority
- **Primary Problem:** Rapid edge pothole formation & dangerous wrong-side two-wheeler crossovers.
- **Immediate Remedy:** Concrete median anti-glare barrier + DLP Contractor resurfacing by L&T.

#### 3. Recommended Municipal Budget Sanction:
Total Capital Sanction required across top 5 hotspots: **₹5,62,000 INR**`);
      } else {
        setAiReportGenerated(`### 📊 CITY INFRASTRUCTURE & ENFORCEMENT SUMMARY
- **Total Active Penalties Issued:** ₹${totalPenaltiesIssued.toLocaleString('en-IN')} across ${penaltyStats.reduce((a,b)=>a+b.offenseCount,0)} violations.
- **Collected in Treasury:** ₹${totalPenaltiesCollected.toLocaleString('en-IN')} (${overallCollectionRate}% collection rate).
- **Key Infrastructure Upgrades Recommended:** 6 high-impact smart poles, pedestrian zebra crosswalks, and emergency preemption receivers.
- **Recommendation:** Approve Smart Traffic Pole with "Turn Ahead" Warning at Marathahalli flyover descent to cut curve collisions by 44%.`);
      }
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP ADMIN BANNER & METRIC COCKPIT */}
      <div className="product-panel p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold font-mono mb-2">
              <Building2 className="w-3.5 h-3.5" />
              MUNICIPAL CORPORATION & TRAFFIC POLICE COMMAND
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              City Cases, Warranty Audit & Resource Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl font-mono">
              Centralized administrative analytics: audit road damage contractor warranties (DLP), dynamically calculate repair workers & costs, analyze high-recurrence sensitivity hotspots, track penalty recoveries, and review city infrastructure installation needs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGenerateAiReport('Generate Road Damage Report with Warranty and Contractor info')}
              className="btn-primary px-4 py-2.5 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Municipal Advisor</span>
            </button>
          </div>
        </div>

        {/* 4 High-Level Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {/* Warranty Savings */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                Contractor Warranty Savings
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{warrantySavingsInr.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-mono">
                {underWarrantyCount} roads under DLP (₹0 city cost)
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Penalties Collected */}
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider font-mono">
                Penalties Collected
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{totalPenaltiesCollected.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-sky-600 mt-0.5 font-mono">
                {overallCollectionRate}% collected (₹{totalPenaltiesPending.toLocaleString('en-IN')} pending)
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 border border-sky-200 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          {/* High-Sensitivity Hotspots */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider font-mono">
                Top Recurrence Hotspot
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                Silk Board (#1)
              </div>
              <p className="text-[11px] text-amber-600 mt-0.5 font-mono">
                68 repeated defects & bottlenecks
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Emergency Priority Clearances */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider font-mono">
                Emergency Corridors
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {emergencyDispatches.length} Dispatches
              </div>
              <p className="text-[11px] text-purple-600 mt-0.5 font-mono">
                108 Ambulance + 112 Police active
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
              <Siren className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={() => setActiveAdminTab('road_damage_warranty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'road_damage_warranty'
                ? 'bg-sky-100 text-sky-700 border border-sky-300 shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Road Defects, Warranty & Resource Engine</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('hotspots_sensitivity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'hotspots_sensitivity'
                ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Sensitivity & Recurrence Hotspots (1st Priority)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('penalties')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'penalties'
                ? 'bg-red-100 text-red-700 border border-red-300 shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Penalty Classification & Recovery</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('installations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'installations'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>City Installation Recommendations</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('ai_advisor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'ai_advisor'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Municipal Advisor Reports</span>
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT: ROAD DEFECTS, WARRANTY AUDIT & RESOURCE PLANNING */}
      {activeAdminTab === 'road_damage_warranty' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Filterable Case Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="product-panel p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>City Defect Cases ({filteredDefects.length})</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Select to plan resources
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 text-xs">
                <select
                  value={defectTypeFilter}
                  onChange={(e) => setDefectTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="all">All Defect Types</option>
                  <option value="pothole">Potholes (Manual/Dashcam/Gyro)</option>
                  <option value="damaged_road">Damaged Road / Rutting</option>
                  <option value="water_leakage">Water Leakage / Pipe Burst</option>
                  <option value="waste_garbage">Waste & Garbage Dumping</option>
                </select>

                <select
                  value={warrantyFilter}
                  onChange={(e) => setWarrantyFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="all">All Warranties</option>
                  <option value="under_warranty">Under Warranty (DLP)</option>
                  <option value="municipal">Municipal Expense</option>
                </select>
              </div>

              {/* Defect Cards List */}
              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredDefects.map((defect) => {
                  const isSelected = defect.id === selectedDefect.id;
                  const isUnderWarranty = defect.contractorWarranty?.isUnderWarranty;

                  return (
                    <div
                      key={defect.id}
                      onClick={() => {
                        setSelectedDefectId(defect.id);
                        setWorkerCount(defect.resourceEstimation?.workersNeeded || 5);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-300 bg-sky-50 shadow-sm shadow-sky-100'
                          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {defect.id}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isUnderWarranty
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {isUnderWarranty ? 'UNDER WARRANTY (DLP)' : 'MUNICIPAL REPAIR'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">
                            {defect.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-mono">
                            {defect.roadName}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-sky-700">
                            ₹{(defect.resourceEstimation?.totalCostInr || defect.estimatedCostInr).toLocaleString('en-IN')}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {defect.resourceEstimation?.workersNeeded || 4} Workers • {defect.resourceEstimation?.estimatedDays || 2}d
                          </div>
                        </div>
                      </div>

                      {/* Sub-feature detection source tag */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1">
                          {defect.potholeDetectionMode === 'gyroscope_sensor' ? (
                            <span className="text-purple-700 font-semibold flex items-center gap-1">
                              <Radio className="w-3 h-3" /> Gyro Sensor Bump
                            </span>
                          ) : defect.potholeDetectionMode === 'manual_upload' ? (
                            <span className="text-amber-700 font-semibold flex items-center gap-1">
                              <Camera className="w-3 h-3" /> Citizen Manual Upload
                            </span>
                          ) : (
                            <span className="text-sky-700 font-semibold flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Forward Dashcam AI
                            </span>
                          )}
                        </div>

                        <span className="font-mono text-slate-500">
                          {defect.recurrenceCount} Recurrences
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Inspector, Warranty Action & Worker/Cost Calculator */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. CONTRACTOR WARRANTY CARD */}
            <div className={`p-5 rounded-2xl border ${
              selectedDefect.contractorWarranty?.isUnderWarranty
                ? 'bg-emerald-50 border-emerald-300'
                : 'product-panel'
            }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedDefect.contractorWarranty?.isUnderWarranty
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {selectedDefect.contractorWarranty?.isUnderWarranty ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <HardHat className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                      selectedDefect.contractorWarranty?.isUnderWarranty ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      Defect Liability Period (DLP) Audit
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedDefect.contractorWarranty?.isUnderWarranty
                        ? 'ROAD UNDER CONTRACTOR WARRANTY (Zero City Cost)'
                        : 'MUNICIPAL CARRIAGEWAY MAINTENANCE RESPONSIBILITY'}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                    selectedDefect.contractorWarranty?.isUnderWarranty
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {selectedDefect.contractorWarranty?.isUnderWarranty
                      ? `${selectedDefect.contractorWarranty.daysRemaining} Days Warranty Remaining`
                      : 'Warranty Expired'}
                  </span>
                </div>
              </div>

              {/* Contractor Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase font-mono">Contractor In-Charge</span>
                  <span className="text-slate-900 font-bold mt-0.5 block">
                    {selectedDefect.contractorWarranty?.contractorName}
                  </span>
                  <span className="text-slate-500 text-[11px] block mt-0.5 font-mono">
                    Contract ID: <span className="font-mono text-slate-600">{selectedDefect.contractorWarranty?.contractId}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase font-mono">Warranty Period & Clause</span>
                  <span className="text-slate-900 font-medium mt-0.5 block">
                    Expires: <span className="font-bold">{selectedDefect.contractorWarranty?.warrantyExpiryDate}</span>
                  </span>
                  <span className="text-slate-500 text-[11px] block mt-0.5 line-clamp-1 font-mono">
                    {selectedDefect.contractorWarranty?.defectLiabilityClause}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Contractor Warranty */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-200">
                {selectedDefect.contractorWarranty?.isUnderWarranty ? (
                  <>
                    <button
                      onClick={() => setContractorCallModal({ isOpen: true, defect: selectedDefect })}
                      className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Contractor ({selectedDefect.contractorWarranty.contractorPhone})</span>
                    </button>

                    <button
                      onClick={() => setDlpNoticeModal({ isOpen: true, defect: selectedDefect, copied: false })}
                      className="btn-primary px-4 py-2 text-xs flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Issue Official DLP Defect Notice (IRC:82)</span>
                    </button>

                    <div className="text-[11px] text-emerald-800 font-medium ml-auto flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Saves ₹{dynamicPlanning.dynamicTotalCost.toLocaleString('en-IN')} municipal funds</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-slate-600 font-medium">
                      Municipal PWD direct maintenance squad assigned. Sanctioned under ward civic maintenance budget.
                    </div>
                    {onIssueWorkOrder && (
                      <button
                        onClick={() => onIssueWorkOrder(selectedDefect)}
                        className="ml-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Dispatch Municipal Work Order</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 2. DYNAMIC WORKER & COST CALCULATION ENGINE */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Model Training Prediction Engine
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Repair Resource & Days Estimation
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono">
                  CPWD SoR 2024 Rates
                </div>
              </div>

              {/* Interactive Worker Count Slider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Assigned Road Crew Workers</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Adjust crew size to recalculate working days, labor cost, and road closure window
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-blue-600">
                      {workerCount} Workers
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (@ ₹750/day/worker)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWorkerCount((prev) => Math.max(2, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm shadow-sm"
                  >
                    -
                  </button>

                  <input
                    type="range"
                    min={2}
                    max={14}
                    step={1}
                    value={workerCount}
                    onChange={(e) => setWorkerCount(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />

                  <button
                    onClick={() => setWorkerCount((prev) => Math.min(14, prev + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic Calculation Output Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Estimated Days</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {dynamicPlanning.dynamicDays} Days
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {Math.round(dynamicPlanning.dynamicDays * 8)} work hours
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Labor Cost</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    ₹{dynamicPlanning.dynamicLaborCost.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Crew wages
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Materials + Tools</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    ₹{(dynamicPlanning.materialCost + dynamicPlanning.equipmentCost).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Asphalt, rollers
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">Total Cost</span>
                  <div className="text-lg font-black text-blue-700 mt-0.5">
                    ₹{dynamicPlanning.dynamicTotalCost.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">
                    {selectedDefect.contractorWarranty?.isUnderWarranty ? 'Contractor pays' : 'Municipal PWD'}
                  </span>
                </div>
              </div>

              {/* Material & Equipment Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    <span>Materials Required</span>
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {selectedDefect.resourceEstimation?.materialsList?.map((mat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Equipment & Heavy Machinery</span>
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {selectedDefect.resourceEstimation?.equipmentList?.map((eq, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. SUGGESTED DETOUR CORRIDOR WHILE REPAIR IS ONGOING */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Traffic Detour Advisory During Road Work
                  </h4>
                </div>
                <p className="text-xs text-amber-950 font-medium">
                  {selectedDefect.resourceEstimation?.suggestedDetour}
                </p>
                <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-2">
                  <span>Impact: {selectedDefect.resourceEstimation?.detourCongestionReduction}</span>
                  <span>•</span>
                  <span>Signal timings pre-configured in ITMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: HOTSPOTS SENSITIVITY & RECURRENCE (1st PRIORITY) */}
      {activeAdminTab === 'hotspots_sensitivity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                  Spatio-Temporal Recurrence Sensitivity Matrix
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  High-Recurrence Incident Hotspots (Prioritized 1st Priority)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Corridors where road damage, rash driving, or bottlenecks repeat most frequently are ranked with 1st Priority status for targeted intervention.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                <span>5 Critical Sensitivity Zones Active</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 mt-4">
              {hotspots.map((spot) => (
                <div key={spot.id} className="py-5 first:pt-2 last:pb-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        spot.priorityRank === 1 
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                          : spot.priorityRank === 2
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-800 text-white'
                      }`}>
                        #{spot.priorityRank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{spot.zoneName}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            Ward {spot.wardNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {spot.primaryIssue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-black text-rose-600 block">
                          {spot.recurrenceCount} Recurrences
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {spot.reportedIncidentsLast90Days} reports in 90 days
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        spot.isUnderWarranty ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {spot.isUnderWarranty ? 'DLP Covered' : 'Municipal'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Root Cause Engineering Analysis</span>
                      <p className="text-slate-700 mt-0.5 font-medium">{spot.rootCauseNote}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Recommended Solution & Installation</span>
                      <p className="text-blue-900 mt-0.5 font-medium">{spot.recommendedIntervention}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: PENALTY CLASSIFICATION & RECOVERY */}
      {activeAdminTab === 'penalties' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Automated e-Challan & Penalty Accounting
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Traffic Violation Penalties & Treasury Recovery
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Categorization of fines issued through automated edge vision and ALPR cameras across the city.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Overall Collection Rate</span>
                  <span className="text-lg font-black text-emerald-700">{overallCollectionRate}%</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Violation Category</th>
                    <th className="py-3 px-3">Legal Section (MVA / BNS)</th>
                    <th className="py-3 px-3 text-right">Citations</th>
                    <th className="py-3 px-3 text-right">Total Issued (₹)</th>
                    <th className="py-3 px-3 text-right">Collected (₹)</th>
                    <th className="py-3 px-3 text-right">Pending (₹)</th>
                    <th className="py-3 px-3 text-right">Recovery %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {penaltyStats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {stat.category}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                        {stat.lawSection}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                        {stat.offenseCount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-slate-900">
                        ₹{stat.fineAmountTotalInr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                        ₹{stat.fineAmountCollectedInr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-rose-600">
                        ₹{stat.pendingAmountInr.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {stat.collectionRatePercent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: WHAT NEEDS TO BE INSTALLED IN THE CITY */}
      {activeAdminTab === 'installations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  City Infrastructure Upgrades Recommended by AI
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  What Needs to be Installed in the City for Better Management
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Automated engineering proposals for traffic poles, pedestrian zebra crosswalks, pelican signals, and speed calming tables based on recurring conflict data.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                {infrastructureRecs.length} Infrastructure Proposals
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {infrastructureRecs.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.priority === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Ward: {rec.wardName}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {rec.signboardOrPoleDetail}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Location: {rec.location}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-slate-900">
                        ₹{rec.estimatedCostInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-400 font-bold text-[10px] uppercase">Justification:</span>
                      <p className="text-slate-700">{rec.justification}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-bold text-[10px] uppercase">Expected Safety Impact:</span>
                      <p className="text-blue-900 font-medium">{rec.expectedImpact}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      rec.status === 'approved_by_admin' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'tender_floated'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      Status: {rec.status.replace(/_/g, ' ').toUpperCase()}
                    </span>

                    <button
                      onClick={() => alert(`Proposal ${rec.id} (${rec.signboardOrPoleDetail}) approved for Ward ${rec.wardName} Municipal Budget 2026.`)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors"
                    >
                      Approve for Tender
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: AI MUNICIPAL ADVISOR & REPORT GENERATOR */}
      {activeAdminTab === 'ai_advisor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">
                AI Municipal Assistant & City Infrastructure Advisor
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Ask MargDrishti AI to audit specific road stretches for warranty compliance, compute worker and equipment requirements, recommend detour paths, or synthesize city-wide safety reports.
            </p>

            {/* Quick Prompt Buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleGenerateAiReport('Generate Road Damage Report with Warranty and Contractor status')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                📋 Road Damage & Warranty Report
              </button>
              <button
                onClick={() => handleGenerateAiReport('Analyze top crash recurrence hotspots and recommend traffic poles')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                🎯 Hotspot & Pole Installation Plan
              </button>
              <button
                onClick={() => handleGenerateAiReport('Calculate workers, days, and cost for 500m arterial resurfacing')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                👷 Worker & Cost Estimation Matrix
              </button>
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Ask e.g. 'Check warranty for Outer Ring Road pothole and suggest detour'..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiReport()}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleGenerateAiReport()}
                disabled={isAiLoading}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {isAiLoading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Generate</span>
              </button>
            </div>

            {/* Rendered AI Markdown Report */}
            {aiReportGenerated && (
              <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Official AI Intelligence Dispatch</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiReportGenerated);
                      alert('Report copied to clipboard!');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </button>
                </div>

                <div className="text-xs text-slate-800 whitespace-pre-line font-mono leading-relaxed bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto">
                  {aiReportGenerated}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTRACTOR CALL MODAL */}
      {contractorCallModal.isOpen && contractorCallModal.defect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Call Contractor under Warranty
                </h3>
                <p className="text-xs text-slate-500">
                  Defect Liability Period (DLP) Legal Enforcement
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Contractor:</span>
                <p className="text-slate-900 font-bold">{contractorCallModal.defect.contractorWarranty.contractorName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Phone Number:</span>
                <p className="text-blue-600 font-bold text-sm">{contractorCallModal.defect.contractorWarranty.contractorPhone}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Contract ID:</span>
                <p className="text-slate-700 font-mono">{contractorCallModal.defect.contractorWarranty.contractId}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Warranty Expiry:</span>
                <p className="text-emerald-700 font-semibold">{contractorCallModal.defect.contractorWarranty.warrantyExpiryDate} ({contractorCallModal.defect.contractorWarranty.daysRemaining} days left)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setContractorCallModal({ isOpen: false, defect: null })}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <a
                href={`tel:${contractorCallModal.defect.contractorWarranty.contractorPhone}`}
                onClick={() => {
                  alert(`Connecting to ${contractorCallModal.defect?.contractorWarranty.contractorName} at ${contractorCallModal.defect?.contractorWarranty.contractorPhone}...`);
                  setContractorCallModal({ isOpen: false, defect: null });
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Dial Now</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DLP DEFECT NOTICE MODAL */}
      {dlpNoticeModal.isOpen && dlpNoticeModal.defect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Official Defect Liability Period (DLP) Notice
                </h3>
              </div>
              <button
                onClick={() => setDlpNoticeModal({ isOpen: false, defect: null, copied: false })}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
{`OFFICIAL NOTICE UNDER DEFECT LIABILITY PERIOD (IRC:82)
From: Municipal Engineering & Road Safety Division
To: ${dlpNoticeModal.defect.contractorWarranty.contractorName}
Contract ID: ${dlpNoticeModal.defect.contractorWarranty.contractId}

Sub: Mandatory Surface Rectification Notice for Defect ${dlpNoticeModal.defect.id}

Notice is hereby served that during continuous transit bus AI telemetry inspection on ${dlpNoticeModal.defect.timestamp}, a critical road defect was verified:
- Location: ${dlpNoticeModal.defect.roadName}
- Defect Type: ${dlpNoticeModal.defect.type.toUpperCase()}
- Dimensions: ${dlpNoticeModal.defect.dimensions.lengthCm}cm x ${dlpNoticeModal.defect.dimensions.widthCm}cm (Depth: ${dlpNoticeModal.defect.dimensions.depthCm}cm)
- Root Cause: ${dlpNoticeModal.defect.rootCause}

As per Clause 10.4 of your contract, this road stretch remains under active warranty until ${dlpNoticeModal.defect.contractorWarranty.warrantyExpiryDate} (${dlpNoticeModal.defect.contractorWarranty.daysRemaining} days remaining).

You are required to mobilize repair crews within 48 hours and complete resurfacing at your own cost. Failure to execute will trigger warranty encashment from the performance security deposit (₹${(dlpNoticeModal.defect.contractorWarranty.guaranteeAmountInr/100000).toFixed(1)} Lakhs).

Issued with digital verification hash.`}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Statutory notice under Ministry of Road Transport & Highways guidelines.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`DLP Notice for ${dlpNoticeModal.defect?.contractorWarranty.contractorName} - Contract ${dlpNoticeModal.defect?.contractorWarranty.contractId}`);
                    setDlpNoticeModal(prev => ({ ...prev, copied: true }));
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {dlpNoticeModal.copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{dlpNoticeModal.copied ? 'Copied' : 'Copy Notice'}</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Official DLP Legal Notice dispatched via email & registered post to ${dlpNoticeModal.defect?.contractorWarranty.contractorName}.`);
                    setDlpNoticeModal({ isOpen: false, defect: null, copied: false });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Notice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
