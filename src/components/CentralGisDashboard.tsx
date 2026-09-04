import React, { useState } from 'react';
import { 
  MapPin, AlertTriangle, Bus, Shield, Eye, Layers, Filter, CheckCircle2, 
  Clock, ArrowUpRight, Search, FileSpreadsheet, Activity, ChevronRight,
  Flame, Sliders, Radio, Sparkles, RefreshCw
} from 'lucide-react';
import { RoadDefect, FleetBus, DefectType } from '../types';
import { D3GisHeatmapLayer, HeatmapDataPoint } from './D3GisHeatmapLayer';

interface CentralGisDashboardProps {
  defects: RoadDefect[];
  fleet: FleetBus[];
  onSelectDefect: (defect: RoadDefect) => void;
  onGenerateWorkOrder: (defect: RoadDefect) => void;
}

export const CentralGisDashboard: React.FC<CentralGisDashboardProps> = ({
  defects,
  fleet,
  onSelectDefect,
  onGenerateWorkOrder,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'defects' | 'fleet' | 'heatmaps'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedDefect, setFocusedDefect] = useState<RoadDefect | null>(defects[0] || null);

  // D3 Heatmap Layer Specific State
  const [heatmapMode, setHeatmapMode] = useState<'traffic' | 'incidents' | 'combined'>('traffic');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.8);
  const [heatmapBandwidth, setHeatmapBandwidth] = useState<number>(32);
  const [isHeatmapLive, setIsHeatmapLive] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<HeatmapDataPoint | null>(null);

  const filteredDefects = defects.filter(d => {
    const matchSeverity = selectedSeverity === 'all' || d.severity === selectedSeverity;
    const matchSearch = d.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        d.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSeverity && matchSearch;
  });

  const isHeatmapVisible = activeLayer === 'all' || activeLayer === 'heatmaps';

  return (
    <div className="space-y-6">
      {/* Top Stat Summary Banner (Clean Minimalism Metric Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Network Scanned Today</div>
          <div className="text-2xl font-bold text-slate-800">
            1,420<span className="text-sm font-normal text-slate-500 ml-1">km lanes</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">BMTC + DTC Connected Fleets</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Active Critical Defects</div>
          <div className="text-2xl font-bold text-rose-600">
            {defects.filter(d => d.severity === 'high').length}
            <span className="text-sm font-normal text-slate-500 ml-1">high severity</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Emergency patch required &lt;24h</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">D3 Real-Time Density</div>
          <div className="text-2xl font-bold text-amber-600 flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>88% Peak</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Silk Board & ORR Hotspots</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Est. CPWD Repair Budget</div>
          <div className="text-2xl font-bold text-slate-800">
            ₹{defects.reduce((acc, d) => acc + d.estimatedCostInr, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">MoHUA Schedule of Rates 2024</div>
        </div>
      </div>

      {/* Main Map & Incident Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive GIS Map */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col relative overflow-hidden">
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 z-10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Bengaluru Transit Corridor GIS
              </span>
              <span className="text-xs font-medium text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                PostGIS + D3 Dynamic Heatmap
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => setActiveLayer('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${activeLayer === 'all' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All Layers
                </button>
                <button
                  onClick={() => setActiveLayer('heatmaps')}
                  className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${activeLayer === 'heatmaps' ? 'bg-rose-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Flame className="w-3 h-3" />
                  <span>D3 Heatmap</span>
                </button>
                <button
                  onClick={() => setActiveLayer('defects')}
                  className={`px-2.5 py-1 rounded transition-colors ${activeLayer === 'defects' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Defects
                </button>
                <button
                  onClick={() => setActiveLayer('fleet')}
                  className={`px-2.5 py-1 rounded transition-colors ${activeLayer === 'fleet' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Buses ({fleet.length})
                </button>
              </div>
            </div>
          </div>

          {/* D3 Heatmap Configuration Sub-Bar (When Heatmap is Visible) */}
          {isHeatmapVisible && (
            <div className="my-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Metric Type Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Heatmap Mode:
                </span>
                <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs text-[11px]">
                  <button
                    onClick={() => setHeatmapMode('traffic')}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${
                      heatmapMode === 'traffic'
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Peak Traffic Density
                  </button>
                  <button
                    onClick={() => setHeatmapMode('incidents')}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${
                      heatmapMode === 'incidents'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Incident Frequency Hotspots
                  </button>
                  <button
                    onClick={() => setHeatmapMode('combined')}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${
                      heatmapMode === 'combined'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Combined Multi-Risk
                  </button>
                </div>
              </div>

              {/* Bandwidth & Opacity Sliders & Live Stream Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="text-slate-400">Radius:</span>
                  <select
                    value={heatmapBandwidth}
                    onChange={(e) => setHeatmapBandwidth(Number(e.target.value))}
                    className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                  >
                    <option value={24}>Tight (24px)</option>
                    <option value={32}>Standard (32px)</option>
                    <option value={44}>Wide (44px)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="text-slate-400">Opacity:</span>
                  <input
                    type="range"
                    min={0.3}
                    max={1}
                    step={0.1}
                    value={heatmapOpacity}
                    onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                    className="w-16 accent-rose-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-slate-500">{Math.round(heatmapOpacity * 100)}%</span>
                </div>

                <button
                  onClick={() => setIsHeatmapLive(!isHeatmapLive)}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
                    isHeatmapLive
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-slate-200 border-slate-300 text-slate-600'
                  }`}
                  title="Toggle 1Hz Real-Time Stream updates"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isHeatmapLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span>{isHeatmapLive ? 'LIVE 1Hz' : 'PAUSED'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Visual Map Canvas / Vector Map */}
          <div className="relative w-full h-[480px] bg-[#0F172A] rounded-xl my-3 overflow-hidden border border-slate-200 flex items-center justify-center">
            {/* Ambient Map Grid & Roads */}
            <svg className="absolute inset-0 w-full h-full opacity-70 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />

              {/* Major Arterial Corridors (Outer Ring Road, Hosur Road, Old Airport Rd) */}
              <path
                d="M 60 120 Q 240 180, 420 140 T 780 200"
                fill="none"
                stroke="#334155"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 60 120 Q 240 180, 420 140 T 780 200"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeDasharray="6 4"
              />

              {/* Secondary Cross Road */}
              <path
                d="M 220 40 Q 300 240, 360 440"
                fill="none"
                stroke="#334155"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 220 40 Q 300 240, 360 440"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />

              {/* Diagonal Highway */}
              <path
                d="M 120 420 Q 420 300, 720 120"
                fill="none"
                stroke="#1e293b"
                strokeWidth="16"
              />
              <path
                d="M 120 420 Q 420 300, 720 120"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeDasharray="8 6"
              />
            </svg>

            {/* Geographical Landmarks in Bengaluru */}
            <div className="absolute top-12 left-12 text-[11px] font-mono text-slate-500 pointer-events-none z-10">
              Indiranagar 100ft Corridor
            </div>
            <div className="absolute bottom-16 left-1/3 text-[11px] font-mono text-slate-500 pointer-events-none z-10">
              Silk Board Junction (Bottleneck Zone)
            </div>
            <div className="absolute top-16 right-16 text-[11px] font-mono text-slate-500 pointer-events-none z-10">
              Bellandur Tech Corridor / ORR
            </div>

            {/* D3 CONTOUR DENSITY HEATMAP LAYER */}
            {isHeatmapVisible && (
              <D3GisHeatmapLayer
                mode={heatmapMode}
                bandwidth={heatmapBandwidth}
                opacity={heatmapOpacity}
                isLiveStream={isHeatmapLive}
                onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
              />
            )}

            {/* Interactive Defect Pins */}
            {(activeLayer === 'all' || activeLayer === 'defects') &&
              filteredDefects.map((defect, idx) => {
                const pinPositions = [
                  { left: '42%', top: '38%' },
                  { left: '68%', top: '35%' },
                  { left: '26%', top: '28%' },
                  { left: '54%', top: '65%' },
                  { left: '76%', top: '50%' },
                  { left: '34%', top: '72%' }
                ];
                const pos = pinPositions[idx % pinPositions.length];
                const isSelected = focusedDefect?.id === defect.id;

                return (
                  <button
                    key={defect.id}
                    onClick={() => {
                      setFocusedDefect(defect);
                      setSelectedHotspot(null);
                      onSelectDefect(defect);
                    }}
                    style={{ left: pos.left, top: pos.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-25 group transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`relative p-2 rounded-full shadow-lg flex items-center justify-center border ${
                        defect.severity === 'high'
                          ? 'bg-rose-500/30 border-rose-500 text-rose-300'
                          : defect.severity === 'medium'
                          ? 'bg-amber-500/30 border-amber-500 text-amber-300'
                          : 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-40 whitespace-nowrap bg-slate-900 text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-700 shadow-xl pointer-events-none">
                      <div className="font-bold text-white">{defect.title}</div>
                      <div className="text-[10px] text-slate-400">
                        {defect.severity.toUpperCase()} • ₹{defect.estimatedCostInr}
                      </div>
                    </div>
                  </button>
                );
              })}

            {/* Interactive Fleet Bus Markers */}
            {(activeLayer === 'all' || activeLayer === 'fleet') &&
              fleet.map((bus, idx) => {
                const busPositions = [
                  { left: '46%', top: '42%' },
                  { left: '62%', top: '30%' },
                  { left: '30%', top: '35%' },
                  { left: '80%', top: '44%' }
                ];
                const bPos = busPositions[idx % busPositions.length];
                return (
                  <div
                    key={bus.id}
                    style={{ left: bPos.left, top: bPos.top }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-25 flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-500 text-black font-mono text-[11px] font-bold shadow-md cursor-pointer hover:scale-105 transition-all"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>{bus.routeNumber}</span>
                  </div>
                );
              })}
          </div>

          {/* Map Footer Legend with D3 Density Scale */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Severity Defect
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Bus Edge Stream
              </span>

              {/* D3 Heatmap Color Scale Bar */}
              {isHeatmapVisible && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <span className="text-[11px] text-slate-400 font-medium">D3 Density:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Low</span>
                    <div className="w-20 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-600 shadow-2xs border border-slate-300/60" />
                    <span className="text-[10px] text-rose-600 font-bold">Critical</span>
                  </div>
                </div>
              )}
            </div>

            <span className="text-slate-400 text-[11px]">
              Kernel: D3 ContourDensity • 1Hz Real-Time Ingestion
            </span>
          </div>
        </div>

        {/* Right Column: Defect Inspector & Work Order Trigger */}
        <div className="lg:col-span-4 space-y-4">
          {/* If a D3 Hotspot was clicked, show its rich analytics */}
          {selectedHotspot && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 shadow-lg p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    D3 HEATMAP HOTSPOT INSPECTOR
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    {selectedHotspot.name}
                  </h4>
                  <p className="text-xs text-slate-400">{selectedHotspot.corridorType}</p>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center font-mono">
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">DENSITY</div>
                  <div className="text-base font-black text-rose-400">
                    {Math.round(selectedHotspot.trafficDensity * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">AVG SPEED</div>
                  <div className="text-base font-bold text-slate-200">{selectedHotspot.avgSpeedKmH} km/h</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">LOS</div>
                  <div className="text-base font-black text-amber-400">{selectedHotspot.levelOfService}</div>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-1 text-slate-300">
                <div className="flex justify-between border-b border-slate-700/60 pb-1">
                  <span className="text-slate-400">Incident Frequency:</span>
                  <span className="font-bold text-amber-300">{selectedHotspot.incidentCount} cases / 90 days</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-1">
                  <span className="text-slate-400">Congestion Delay:</span>
                  <span className="font-semibold text-rose-300">+22 mins peak delay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className="text-blue-300 font-medium">Dynamic Preemption & Resurfacing</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Defect Detail Card */}
          {focusedDefect ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                    {focusedDefect.id} • {focusedDefect.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                    {focusedDefect.title}
                  </h4>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded uppercase ${
                    focusedDefect.severity === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : focusedDefect.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {focusedDefect.severity} Severity
                </span>
              </div>

              <p className="text-xs text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{focusedDefect.roadName}</span>
              </p>

              {/* Defect Physical Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">LENGTH</div>
                  <div className="text-sm font-bold text-slate-800">{focusedDefect.dimensions.lengthCm} cm</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">WIDTH</div>
                  <div className="text-sm font-bold text-slate-800">{focusedDefect.dimensions.widthCm} cm</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">DEPTH</div>
                  <div className="text-sm font-bold text-rose-600">{focusedDefect.dimensions.depthCm} cm</div>
                </div>
              </div>

              {/* Root Cause & CPWD Rate Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Root Cause:</span>
                  <span className="font-semibold text-slate-800 uppercase font-mono">
                    {focusedDefect.rootCause.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Recommended Repair:</span>
                  <span className="font-semibold text-blue-600 text-right max-w-[200px]">
                    {focusedDefect.repairMethod}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Dataset Validation:</span>
                  <span className="font-mono text-slate-700">{focusedDefect.datasetRef}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">CPWD Estimated Cost:</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    ₹{focusedDefect.estimatedCostInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => onGenerateWorkOrder(focusedDefect)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 shadow-sm transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Dispatch CPWD Work Order
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center text-slate-500 text-sm">
              Click any defect pin or heatmap hotspot on the map to inspect telemetry
            </div>
          )}

          {/* Quick List / Ticker */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-tight text-slate-700">
                Defect Queue ({filteredDefects.length})
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <select
                  value={selectedSeverity}
                  onChange={e => setSelectedSeverity(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700"
                >
                  <option value="all">All Severity</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredDefects.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    setFocusedDefect(d);
                    setSelectedHotspot(null);
                    onSelectDefect(d);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    focusedDefect?.id === d.id
                      ? 'bg-blue-50/60 border-blue-500 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-mono">{d.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                        d.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.severity}
                    </span>
                  </div>
                  <div className="text-slate-800 font-medium truncate mt-1">{d.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{d.roadName.slice(0, 36)}...</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

