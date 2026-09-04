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
      {/* Top Stat Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="product-panel p-4">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 tracking-wide">Network Scanned Today</div>
          <div className="text-2xl font-bold text-sky-600">
            1,420<span className="text-sm font-normal text-slate-400 ml-1">km lanes</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">BMTC + DTC Connected Fleets</div>
        </div>

        <div className="product-panel p-4">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 tracking-wide">Active Critical Defects</div>
          <div className="text-2xl font-bold text-red-600">
            {defects.filter(d => d.severity === 'high').length}
            <span className="text-sm font-normal text-slate-400 ml-1">high severity</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Emergency patch required &lt;24h</div>
        </div>

        <div className="product-panel p-4">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 tracking-wide">Peak Traffic Density</div>
          <div className="text-2xl font-bold text-amber-600 flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-red-500" />
            <span>88% Peak</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Silk Board &amp; ORR Hotspots</div>
        </div>

        <div className="product-panel p-4">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 tracking-wide">Est. CPWD Repair Budget</div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{defects.reduce((acc, d) => acc + d.estimatedCostInr, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">MoHUA Schedule of Rates 2024</div>
        </div>
      </div>

      {/* Main Map & Incident Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive GIS Map */}
        <div className="lg:col-span-8 product-panel p-4 flex flex-col">
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 z-10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-bold text-slate-900">
                Bengaluru Transit Corridor
              </span>
              <span className="text-xs font-medium text-sky-700 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200">
                PostGIS + D3 Heatmap
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium border border-slate-200">
                <button
                  onClick={() => setActiveLayer('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${activeLayer === 'all' ? 'bg-white text-sky-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  All Layers
                </button>
                <button
                  onClick={() => setActiveLayer('heatmaps')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${activeLayer === 'heatmaps' ? 'bg-white text-red-600 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Flame className="w-3 h-3" />
                  <span>Heatmap</span>
                </button>
                <button
                  onClick={() => setActiveLayer('defects')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${activeLayer === 'defects' ? 'bg-white text-red-600 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Defects
                </button>
                <button
                  onClick={() => setActiveLayer('fleet')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${activeLayer === 'fleet' ? 'bg-white text-sky-700 font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Buses ({fleet.length})
                </button>
              </div>
            </div>
          </div>

          {/* D3 Heatmap Controls */}
          {isHeatmapVisible && (
            <div className="my-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  Heatmap:
                </span>
                <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
                  <button onClick={() => setHeatmapMode('traffic')} className={`px-2.5 py-1 rounded font-medium transition-all ${heatmapMode === 'traffic' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}>Traffic Density</button>
                  <button onClick={() => setHeatmapMode('incidents')} className={`px-2.5 py-1 rounded font-medium transition-all ${heatmapMode === 'incidents' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-slate-800'}`}>Incidents</button>
                  <button onClick={() => setHeatmapMode('combined')} className={`px-2.5 py-1 rounded font-medium transition-all ${heatmapMode === 'combined' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}>Combined</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Radius:</span>
                  <select value={heatmapBandwidth} onChange={(e) => setHeatmapBandwidth(Number(e.target.value))} className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-700 text-[11px]">
                    <option value={24}>Tight</option>
                    <option value={32}>Standard</option>
                    <option value={44}>Wide</option>
                  </select>
                </div>
                <button onClick={() => setIsHeatmapLive(!isHeatmapLive)} className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold flex items-center gap-1 transition-all ${isHeatmapLive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isHeatmapLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isHeatmapLive ? 'LIVE' : 'PAUSED'}
                </button>
              </div>
            </div>
          )}

          {/* Interactive Visual Map Canvas / Vector Map */}
          <div className="relative w-full h-[480px] bg-slate-100 rounded-xl my-3 overflow-hidden border border-slate-200 flex items-center justify-center">
            {/* Ambient Map Grid & Roads */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />

              {/* Major Arterial Corridors */}
              <path d="M 60 120 Q 240 180, 420 140 T 780 200" fill="none" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" />
              <path d="M 60 120 Q 240 180, 420 140 T 780 200" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" />

              {/* Secondary Cross Road */}
              <path d="M 220 40 Q 300 240, 360 440" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
              <path d="M 220 40 Q 300 240, 360 440" fill="none" stroke="#ffffff" strokeWidth="1.5" />

              {/* Diagonal Highway */}
              <path d="M 120 420 Q 420 300, 720 120" fill="none" stroke="#94a3b8" strokeWidth="16" />
              <path d="M 120 420 Q 420 300, 720 120" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 6" />
            </svg>

            {/* Geographical Landmarks in Bengaluru */}
            <div className="absolute top-3 left-3 text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-1 rounded pointer-events-none z-10 border border-slate-200">Indiranagar 100ft Rd</div>
            <div className="absolute bottom-10 left-1/3 text-[10px] font-semibold text-red-600 bg-white/90 px-2 py-1 rounded pointer-events-none z-10 border border-red-200">Silk Board (High Risk)</div>
            <div className="absolute top-3 right-3 text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-1 rounded pointer-events-none z-10 border border-slate-200">Bellandur / ORR</div>

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
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`relative p-2 rounded-full shadow-md flex items-center justify-center border-2 ${
                        defect.severity === 'high'
                          ? 'bg-red-100 border-red-500 text-red-600'
                          : defect.severity === 'medium'
                          ? 'bg-amber-100 border-amber-500 text-amber-600'
                          : 'bg-emerald-100 border-emerald-500 text-emerald-600'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-40 whitespace-nowrap bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl pointer-events-none">
                      <div className="font-bold">{defect.title}</div>
                      <div className="text-[10px] text-slate-300">{defect.severity.toUpperCase()} · ₹{defect.estimatedCostInr.toLocaleString('en-IN')}</div>
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
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-sky-600 text-white font-mono text-[10px] font-bold shadow-md cursor-pointer hover:scale-105 transition-all border border-sky-700"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>{bus.routeNumber}</span>
                  </div>
                );
              })}
          </div>

          {/* Map Footer Legend with D3 Density Scale */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High Severity</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium Severity</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Active Bus</span>
              {isHeatmapVisible && (
                <div className="flex items-center gap-2">
                  <span>Density:</span>
                  <div className="flex items-center gap-1">
                    <span>Low</span>
                    <div className="w-16 h-2 rounded-full bg-gradient-to-r from-green-400 via-amber-400 to-red-600 border border-slate-200" />
                    <span className="text-red-600 font-semibold">High</span>
                  </div>
                </div>
              )}
            </div>
            <span className="text-slate-400 text-[11px]">D3 ContourDensity · 1Hz stream</span>
          </div>
        </div>

        {/* Right Column: Defect Inspector & Work Order Trigger */}
        <div className="lg:col-span-4 space-y-4">
          {/* Hotspot Inspector */}
          {selectedHotspot && (
            <div className="product-panel p-5 space-y-3 border-l-4 border-l-amber-500">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    Traffic Hotspot
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{selectedHotspot.name}</h4>
                  <p className="text-xs text-slate-500">{selectedHotspot.corridorType}</p>
                </div>
                <button onClick={() => setSelectedHotspot(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Density</div>
                  <div className="text-lg font-bold text-red-600">{Math.round(selectedHotspot.trafficDensity * 100)}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Speed</div>
                  <div className="text-lg font-bold text-slate-900">{selectedHotspot.avgSpeedKmH} km/h</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">LOS</div>
                  <div className="text-lg font-bold text-amber-600">{selectedHotspot.levelOfService}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Incidents (90d):</span>
                  <span className="font-semibold text-slate-900">{selectedHotspot.incidentCount} cases</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Peak Delay:</span>
                  <span className="font-semibold text-red-600">+22 mins</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Recommended:</span>
                  <span className="font-semibold text-sky-700 text-right">Preemption & Resurfacing</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Defect Detail Card */}
          {focusedDefect ? (
            <div className="product-panel p-5 space-y-4 border-l-4 border-l-red-500">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-sky-600 uppercase tracking-wide">
                    {focusedDefect.id} · {focusedDefect.type.replace('_', ' ')}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{focusedDefect.title}</h4>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  focusedDefect.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-200'
                  : focusedDefect.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>{focusedDefect.severity}</span>
              </div>

              <p className="text-xs text-slate-500 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                {focusedDefect.roadName}
              </p>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Length</div>
                  <div className="text-sm font-bold text-slate-900">{focusedDefect.dimensions.lengthCm} cm</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Width</div>
                  <div className="text-sm font-bold text-slate-900">{focusedDefect.dimensions.widthCm} cm</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Depth</div>
                  <div className="text-sm font-bold text-red-600">{focusedDefect.dimensions.depthCm} cm</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Root Cause</span>
                  <span className="font-semibold text-slate-900 capitalize">{focusedDefect.rootCause.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Repair Method</span>
                  <span className="font-semibold text-sky-700 text-right max-w-[160px] text-xs">{focusedDefect.repairMethod}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Dataset</span>
                  <span className="text-slate-600 text-xs">{focusedDefect.datasetRef}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">CPWD Est. Cost</span>
                  <span className="text-lg font-bold text-slate-900">₹{focusedDefect.estimatedCostInr.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => onGenerateWorkOrder(focusedDefect)}
                className="w-full py-2.5 rounded-lg btn-primary text-sm flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Dispatch CPWD Work Order
              </button>
            </div>
          ) : (
            <div className="product-panel p-8 text-center text-slate-400 text-sm">
              Click any defect pin or heatmap hotspot on the map to inspect details
            </div>
          )}

          {/* Quick List / Ticker */}
          <div className="product-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Defect Queue ({filteredDefects.length})</span>
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedSeverity}
                  onChange={e => setSelectedSeverity(e.target.value as any)}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 bg-white"
                >
                  <option value="all">All Severity</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {filteredDefects.map(d => (
                <div
                  key={d.id}
                  onClick={() => { setFocusedDefect(d); setSelectedHotspot(null); onSelectDefect(d); }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    focusedDefect?.id === d.id
                      ? 'bg-sky-50 border-sky-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{d.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                      d.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>{d.severity}</span>
                  </div>
                  <div className="text-slate-800 font-medium truncate mt-1">{d.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{d.roadName.slice(0, 40)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

