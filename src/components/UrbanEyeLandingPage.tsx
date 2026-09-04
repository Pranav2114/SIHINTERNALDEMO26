import React, { useEffect, useRef, useState } from 'react';
import {
  Eye, Cpu, Camera,
  AlertTriangle, Navigation, TrendingUp, Users, CheckCircle2,
  ChevronRight, BarChart3, Radio, Bus, Zap, Map, FileText,
  AlertCircle, Shield, Activity,
  MonitorPlay, Settings2
} from 'lucide-react';
import { SimulationScene, ViolationType } from '../types';
import { HaydenSimulationCanvas } from './HaydenSimulationCanvas';

interface UrbanEyeLandingPageProps {
  currentScene: SimulationScene;
  onSelectScene: (sceneId: ViolationType) => void;
  privacyBlur: boolean;
  onTogglePrivacyBlur: () => void;
  onOpenGis: () => void;
  onOpenAdmin: () => void;
  onOpenFeatures: () => void;
  onOpenDatasets: () => void;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.unobserve(el); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        const start = performance.now();
        const duration = 1800;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.floor(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>;
}

/* ─── INTERACTIVE CV FEED DEMO ──────────────────────────────────────────────── */
const SCENARIOS = [
  {
    id: 'pothole',
    label: 'Pothole AI',
    icon: '🕳️',
    camera: 'BUS UE-1024 · Silk Board Jn',
    detection: 'POTHOLE DETECTED',
    confidence: 94,
    severity: 'HIGH',
    road: 'Silk Board Junction, Hosur Rd',
    lat: '12.9716°N',
    lng: '77.5946°E',
    action: 'Warranty check → DLP Notice auto-drafted',
    boxColor: '#ef4444',
    boxTop: '38%', boxLeft: '38%', boxW: 130, boxH: 75,
    modelTag: 'YOLOv11 + DeepLabV3+',
    frameRate: 25,
    latency: 14,
  },
  {
    id: 'wrong_way',
    label: 'Wrong-Way',
    icon: '⚠️',
    camera: 'JUNCTION CAM-ORR-12 · Koramangala',
    detection: 'WRONG-WAY VEHICLE',
    confidence: 97,
    severity: 'CRITICAL',
    road: 'Koramangala 4th Block Entry',
    lat: '12.9614°N',
    lng: '77.5855°E',
    action: 'Alert issued → Traffic Police notified',
    boxColor: '#dc2626',
    boxTop: '25%', boxLeft: '55%', boxW: 115, boxH: 70,
    modelTag: 'YOLOv11 · Counter-flow',
    frameRate: 30,
    latency: 11,
  },
  {
    id: 'pedestrian',
    label: 'Pedestrian',
    icon: '🚶',
    camera: 'CCTV BUS-STOP-07 · Jayanagar',
    detection: 'PEDESTRIAN RISK TTC < 2s',
    confidence: 89,
    severity: 'HIGH',
    road: 'Jayanagar 4th Block Crossing',
    lat: '12.9259°N',
    lng: '77.5937°E',
    action: 'Green signal override → 4s pedestrian extension',
    boxColor: '#f59e0b',
    boxTop: '28%', boxLeft: '42%', boxW: 55, boxH: 110,
    modelTag: 'DeepSORT · TTC Model',
    frameRate: 25,
    latency: 18,
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: '🚑',
    camera: 'BUS CAM · Outer Ring Road',
    detection: 'AMBULANCE DETECTED',
    confidence: 99,
    severity: 'CRITICAL',
    road: 'ORR Near Bellandur Gate',
    lat: '12.9352°N',
    lng: '77.6143°E',
    action: 'Green corridor pre-emption → 8 signals cleared',
    boxColor: '#7c3aed',
    boxTop: '28%', boxLeft: '30%', boxW: 170, boxH: 85,
    modelTag: 'YOLOv11 · Emergency Class',
    frameRate: 30,
    latency: 9,
  },
];

function CVFeedDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([
    '[14:22:01] Model initialized · YOLOv11-L loaded',
    '[14:22:02] Camera stream connected · 1080p@25fps',
  ]);
  const [frameCount, setFrameCount] = useState(1847);

  const sc = SCENARIOS[activeIdx];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setFrameCount(f => f + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const now = new Date();
    const ts = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
    setLogLines(prev => [
      ...prev.slice(-4),
      `${ts} ${sc.detection} · ${sc.confidence}% conf · ${sc.road.split(',')[0]}`,
    ]);
  }, [activeIdx, sc.detection, sc.confidence, sc.road]);

  const severityColor: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-amber-100 text-amber-700 border-amber-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
      {/* Scenario Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIdx(i)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              i === activeIdx
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 px-4">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      {/* Camera Feed Canvas */}
      <div className="relative bg-slate-900 h-60 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f1f3d" />
              <stop offset="100%" stopColor="#1a3158" />
            </linearGradient>
            <linearGradient id="roadGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
          </defs>
          <rect width="600" height="100" fill="url(#skyGrad2)" />
          {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560].map((x, i) => (
            <rect key={i} x={x} y={60 + (i * 13) % 35} width={34} height={40 - (i*7)%30} fill="#0a1628" />
          ))}
          <rect x="0" y="100" width="600" height="140" fill="url(#roadGrad2)" />
          <line x1="300" y1="100" x2="50" y2="240" stroke="#6b7280" strokeWidth="2" strokeDasharray="12,10" />
          <line x1="300" y1="100" x2="550" y2="240" stroke="#6b7280" strokeWidth="2" strokeDasharray="12,10" />
          <line x1="300" y1="100" x2="300" y2="240" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="14,14" />
          <line x1="300" y1="100" x2="0" y2="240" stroke="#4b5563" strokeWidth="1" />
          <line x1="300" y1="100" x2="600" y2="240" stroke="#4b5563" strokeWidth="1" />
        </svg>

        {/* LIVE indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
          <span className={`w-2 h-2 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="font-mono text-xs text-white font-bold">LIVE · {sc.camera}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md font-mono text-[10px] text-emerald-400">
            {sc.frameRate}fps · {sc.latency}ms
          </div>
          <div className="bg-emerald-900/80 px-2 py-1 rounded-md font-mono text-[10px] text-emerald-300 border border-emerald-700">
            AI ACTIVE
          </div>
        </div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-sky-900/70 px-2.5 py-1 rounded-md font-mono text-[10px] text-sky-300">
          {sc.modelTag}
        </div>

        {/* Bounding Box */}
        <div
          className="absolute transition-all duration-500"
          style={{ top: sc.boxTop, left: sc.boxLeft, width: `${sc.boxW}px`, height: `${sc.boxH}px`, border: `2px solid ${sc.boxColor}` }}
        >
          <span className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: `2px solid ${sc.boxColor}`, borderLeft: `2px solid ${sc.boxColor}` }} />
          <span className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: `2px solid ${sc.boxColor}`, borderRight: `2px solid ${sc.boxColor}` }} />
          <span className="absolute bottom-0 left-0 w-3 h-3" style={{ borderBottom: `2px solid ${sc.boxColor}`, borderLeft: `2px solid ${sc.boxColor}` }} />
          <span className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: `2px solid ${sc.boxColor}`, borderRight: `2px solid ${sc.boxColor}` }} />
          <div className="absolute -top-6 left-0 font-mono text-[10px] font-bold px-2 py-0.5 text-white whitespace-nowrap" style={{ backgroundColor: sc.boxColor }}>
            {sc.detection} · {sc.confidence}%
          </div>
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/40 rounded-full">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sc.confidence}%`, backgroundColor: sc.boxColor }} />
          </div>
        </div>

        {/* Scan line */}
        {isPlaying && (
          <div
            className="absolute left-0 right-0 h-px opacity-20"
            style={{ top: `${30 + ((tick * 15) % 70)}%`, background: `linear-gradient(to right, transparent, ${sc.boxColor}, transparent)` }}
          />
        )}

        <div className="absolute bottom-3 left-3 font-mono text-[9px] text-slate-300 bg-black/60 px-2 py-1 rounded">{sc.lat} · {sc.lng}</div>
        <div className="absolute bottom-3 right-3 font-mono text-[9px] text-slate-400 bg-black/60 px-2 py-1 rounded">FRAME {frameCount.toLocaleString()}</div>
      </div>

      {/* Detection Info */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white border-b border-slate-100">
        <div className="px-4 py-3">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Detection</div>
          <div className="text-xs font-bold text-slate-900">{sc.detection}</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Confidence</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
              <div className="h-full rounded-full bg-sky-600 transition-all duration-500" style={{ width: `${sc.confidence}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-900">{sc.confidence}%</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Severity</div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityColor[sc.severity] || 'bg-slate-100 text-slate-600'}`}>
            {sc.severity}
          </span>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="px-4 py-3 bg-sky-50 border-b border-sky-100">
        <div className="flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-sky-600 uppercase block mb-0.5">AI Recommended Action</span>
            <span className="text-xs text-sky-900 font-medium">{sc.action}</span>
          </div>
        </div>
      </div>

      {/* Live Log */}
      <div className="px-4 py-3 bg-slate-950 max-h-24 overflow-y-auto">
        <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Live Detection Log</div>
        {logLines.map((line, i) => (
          <div key={i} className={`text-[10px] font-mono ${i === logLines.length - 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── STAT CARD ─────────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub: string; color: string }) {
  return (
    <div className="product-panel p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

/* ─── MODULE DATA ──────────────────────────────────────────────────────────── */
interface ModuleData {
  id: string;
  cat: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
  stat: string;
  statLabel: string;
  color: string;
}

const ALL_MODULES: ModuleData[] = [
  { id: 'pothole', cat: 'road', icon: <Camera className="w-4 h-4" />, title: 'Pothole Detection', desc: 'Forward dashcam AI detects potholes, road cracks and surface damage using YOLOv11 + DeepLabV3+.', badge: 'Core', badgeColor: 'bg-sky-100 text-sky-700 border-sky-200', stat: '96%', statLabel: 'mAP Accuracy', color: 'sky' },
  { id: 'gyro', cat: 'road', icon: <Radio className="w-4 h-4" />, title: 'Gyro Bump Sensing', desc: 'LSTM anomaly detection on bus axle accelerometer data. No camera needed.', badge: 'Core', badgeColor: 'bg-sky-100 text-sky-700 border-sky-200', stat: '93%', statLabel: 'Sensitivity', color: 'violet' },
  { id: 'water', cat: 'road', icon: <AlertCircle className="w-4 h-4" />, title: 'Water Leakage', desc: 'Detects waterlogging and pipe burst events from dashcam and citizen uploads.', stat: 'Real-time', statLabel: 'Alert Speed', color: 'blue' },
  { id: 'waste', cat: 'road', icon: <AlertTriangle className="w-4 h-4" />, title: 'Illegal Dumping', desc: 'Identifies waste accumulation and illegal garbage dumping near roads.', stat: '88%', statLabel: 'Detection', color: 'teal' },
  { id: 'pedestrian', cat: 'traffic', icon: <Users className="w-4 h-4" />, title: 'Pedestrian Safety', desc: 'TTC < 2s risk estimation at intersections. Auto-extends pedestrian green phase.', stat: '< 2s', statLabel: 'TTC Trigger', color: 'amber' },
  { id: 'emergency', cat: 'traffic', icon: <Navigation className="w-4 h-4" />, title: 'Emergency Preemption', desc: '108 Ambulance and 112 Police green corridor activation across signal network.', badge: 'Priority', badgeColor: 'bg-red-100 text-red-700 border-red-200', stat: '< 10s', statLabel: 'Corridor Clear', color: 'red' },
  { id: 'wrongway', cat: 'traffic', icon: <AlertTriangle className="w-4 h-4" />, title: 'Wrong-Way Detection', desc: 'Counter-flow vehicle detection with instant alert to traffic police.', stat: '97%', statLabel: 'Confidence', color: 'orange' },
  { id: 'density', cat: 'traffic', icon: <Activity className="w-4 h-4" />, title: 'Traffic Density', desc: 'D3-powered spatial heatmap of congestion across monitored corridors.', stat: '5 min', statLabel: 'Refresh', color: 'indigo' },
  { id: 'reid', cat: 'enforcement', icon: <Eye className="w-4 h-4" />, title: 'Vehicle Re-ID & ALPR', desc: 'Cross-camera license plate recognition with blockchain audit trail.', badge: 'DPDP Act', badgeColor: 'bg-purple-100 text-purple-700 border-purple-200', stat: '99.2%', statLabel: 'ALPR Accuracy', color: 'purple' },
  { id: 'dlp', cat: 'enforcement', icon: <Shield className="w-4 h-4" />, title: 'DLP Warranty Audit', desc: 'Contractor Defect Liability Period tracking per IRC:82. Auto-generates legal notices.', badge: 'Saves ₹56L', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', stat: '₹56L', statLabel: 'Savings', color: 'emerald' },
  { id: 'penalty', cat: 'enforcement', icon: <CheckCircle2 className="w-4 h-4" />, title: 'Penalty Recovery', desc: 'Automated e-Challan issuance and fine collection analytics by violation category.', stat: '₹12.4L', statLabel: 'Collected', color: 'rose' },
  { id: 'gis', cat: 'enforcement', icon: <Map className="w-4 h-4" />, title: 'GIS Command Center', desc: 'PostGIS + D3.js live map with defect pins, bus positions, and incident overlays.', badge: 'Live', badgeColor: 'bg-sky-100 text-sky-700 border-sky-200', stat: 'Live', statLabel: 'GIS Feed', color: 'sky' },
  { id: 'fleet', cat: 'traffic', icon: <Bus className="w-4 h-4" />, title: 'Fleet Intelligence', desc: 'Real-time bus telemetry: speed, GPS trace, axle load, and route deviation alerts.', stat: '247', statLabel: 'Active Buses', color: 'slate' },
  { id: 'fusion', cat: 'road', icon: <Cpu className="w-4 h-4" />, title: 'Sensor Fusion Engine', desc: 'Kalman filter fusion of camera, GPS, gyro, and crowd data. Eliminates false positives.', stat: '< 5%', statLabel: 'False Positive Rate', color: 'violet' },
];

const COLOR_MAP: Record<string, { icon: string; border: string; bg: string; stat: string }> = {
  sky:     { icon: 'text-sky-600',     border: 'border-sky-200',     bg: 'bg-sky-50',     stat: 'text-sky-700' },
  violet:  { icon: 'text-violet-600',  border: 'border-violet-200',  bg: 'bg-violet-50',  stat: 'text-violet-700' },
  blue:    { icon: 'text-blue-600',    border: 'border-blue-200',    bg: 'bg-blue-50',    stat: 'text-blue-700' },
  teal:    { icon: 'text-teal-600',    border: 'border-teal-200',    bg: 'bg-teal-50',    stat: 'text-teal-700' },
  amber:   { icon: 'text-amber-600',   border: 'border-amber-200',   bg: 'bg-amber-50',   stat: 'text-amber-700' },
  red:     { icon: 'text-red-600',     border: 'border-red-200',     bg: 'bg-red-50',     stat: 'text-red-700' },
  orange:  { icon: 'text-orange-600',  border: 'border-orange-200',  bg: 'bg-orange-50',  stat: 'text-orange-700' },
  indigo:  { icon: 'text-indigo-600',  border: 'border-indigo-200',  bg: 'bg-indigo-50',  stat: 'text-indigo-700' },
  purple:  { icon: 'text-purple-600',  border: 'border-purple-200',  bg: 'bg-purple-50',  stat: 'text-purple-700' },
  emerald: { icon: 'text-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50', stat: 'text-emerald-700' },
  rose:    { icon: 'text-rose-600',    border: 'border-rose-200',    bg: 'bg-rose-50',    stat: 'text-rose-700' },
  slate:   { icon: 'text-slate-600',   border: 'border-slate-300',   bg: 'bg-slate-100',  stat: 'text-slate-700' },
};


const ModuleCard: React.FC<{ mod: ModuleData }> = ({ mod }) => {
  const [hovered, setHovered] = useState(false);
  const c = COLOR_MAP[mod.color] || COLOR_MAP.sky;

  return (
    <div
      className={`relative rounded-xl border p-4 cursor-default group transition-all duration-200 ${
        hovered ? `${c.bg} ${c.border} shadow-md -translate-y-0.5` : `bg-white ${c.border}`
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${c.bg} ${c.border} ${c.icon} transition-all`}>
          {mod.icon}
        </div>
        {mod.badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${(mod as any).badgeColor}`}>{mod.badge}</span>
        )}
      </div>
      <h3 className="font-bold text-slate-900 text-sm mb-1">{mod.title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{mod.desc}</p>
      <div className={`flex items-end justify-between border-t ${c.border} pt-2.5`}>
        <div>
          <div className={`text-base font-black ${c.stat}`}>{mod.stat}</div>
          <div className="text-[10px] text-slate-400 font-medium">{mod.statLabel}</div>
        </div>
        <div className={`text-[10px] font-semibold ${c.icon} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
          Explore <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

const MODULE_CATEGORIES = [
  { id: 'all', label: 'All 14 Modules' },
  { id: 'road', label: '🛣️ Road & Infrastructure' },
  { id: 'traffic', label: '🚦 Traffic & Safety' },
  { id: 'enforcement', label: '🏛️ Enforcement & Audit' },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════════════════════════ */
export const UrbanEyeLandingPage: React.FC<UrbanEyeLandingPageProps> = ({
  currentScene, onSelectScene, privacyBlur, onTogglePrivacyBlur,
  onOpenGis, onOpenAdmin, onOpenFeatures, onOpenDatasets
}) => {
  const ref1 = useReveal();
  const ref2 = useReveal();
  const ref3 = useReveal();
  const ref4 = useReveal();
  const ref5 = useReveal();
  const [activeModuleCat, setActiveModuleCat] = useState('all');

  const visibleModules = activeModuleCat === 'all'
    ? ALL_MODULES
    : ALL_MODULES.filter(m => m.cat === activeModuleCat);

  return (
    <div className="bg-slate-50 text-slate-700">

      {/* HERO */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="status-indicator text-sm">
                  <span className="dot" />
                  Live System — SIH 2026
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  Smart India Hackathon
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
                AI-powered urban<br />
                <span className="text-sky-600">intelligence</span> for safer,<br />
                smarter cities.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Urban EYE AI converts public transit vehicles, traffic cameras, and connected sensors into a real-time city monitoring network — detecting road defects, incidents, and congestion before they become crises.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={onOpenGis} className="btn-primary text-sm px-6 py-3">
                  <Map className="w-4 h-4" />
                  Open Command Center
                </button>
                <button onClick={onOpenFeatures} className="btn-outline text-sm px-6 py-3">
                  View All 14 Modules
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-100">
                {[
                  { value: '247', label: 'Buses networked' },
                  { value: '14', label: 'AI modules' },
                  { value: '96%', label: 'Detection accuracy' },
                  { value: '14ms', label: 'Edge latency' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CV Feed */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MonitorPlay className="w-4 h-4 text-sky-600" />
                  <h2 className="text-sm font-bold text-slate-800">Live AI Detection Feed</h2>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Click tabs to switch scenarios
                </span>
              </div>
              <CVFeedDemo />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="py-16 bg-slate-50">
        <div ref={ref1} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 border border-sky-200 text-sky-700 mb-3">The Platform</span>
            <h2 className="text-3xl font-bold text-slate-900">What Urban EYE AI does</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Every bus becomes a sensor. Every junction becomes a data point. The city becomes self-aware.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Camera className="w-5 h-5" />, title: 'SEE', desc: 'Forward-facing dashcams + CCTV detect road defects, wrong-way vehicles, and illegal dumping using YOLOv11 + DeepLabV3+.', tags: ['YOLOv11', 'TensorRT', 'Edge AI'], color: 'bg-sky-50 border-sky-100 text-sky-600' },
              { icon: <Radio className="w-5 h-5" />, title: 'SENSE', desc: 'Gyroscope sensors on bus axles detect pothole vibration signatures using LSTM anomaly detection. No camera required.', tags: ['LSTM', '2-Wheeler', 'IMU Sensor'], color: 'bg-violet-50 border-violet-100 text-violet-600' },
              { icon: <Cpu className="w-5 h-5" />, title: 'UNDERSTAND', desc: 'Multi-modal fusion engine combines camera, GPS, gyro and crowd data to rank severity, predict recurrence, and estimate repair costs.', tags: ['Sensor Fusion', 'CPWD SoR', 'D3 Heatmap'], color: 'bg-teal-50 border-teal-100 text-teal-600' },
              { icon: <Zap className="w-5 h-5" />, title: 'ACT', desc: 'Auto-generate work orders, enforce contractor warranties (DLP), pre-empt emergency vehicles, and issue legal defect notices.', tags: ['Work Orders', 'IRC:82', 'DPDP 2023'], color: 'bg-amber-50 border-amber-100 text-amber-600' },
            ].map(c => (
              <div key={c.title} className="product-panel p-6">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${c.color}`}>{c.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map(t => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE METRICS */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div ref={ref2} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">System performance at a glance</h2>
            <p className="text-slate-500 mt-2 text-sm">Simulated metrics based on BMTC/DTC fleet deployment projections</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Bus className="w-5 h-5" />} label="Active buses" value={<AnimCounter target={247} suffix="+" />} sub="BMTC + DTC networked" color="bg-sky-50 text-sky-600" />
            <StatCard icon={<Eye className="w-5 h-5" />} label="AI detections / day" value={<AnimCounter target={14820} />} sub="Across all sensor types" color="bg-violet-50 text-violet-600" />
            <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Road defects found" value={<AnimCounter target={1240} suffix="+" />} sub="Potholes, cracks, damage" color="bg-amber-50 text-amber-600" />
            <StatCard icon={<Shield className="w-5 h-5" />} label="Warranty savings" value={<AnimCounter target={56} prefix="₹" suffix="L" />} sub="Contractor DLP enforced" color="bg-emerald-50 text-emerald-600" />
          </div>
        </div>
      </section>

      {/* LIVE VISION AI DEMO — Full width simulation */}
      <section className="py-16 bg-slate-50">
        <div ref={ref3} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 border border-sky-200 text-sky-700 mb-3">Interactive Simulation Engine</span>
            <h2 className="text-3xl font-bold text-slate-900">Live Vision AI Demo</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Explore Urban EYE AI's full simulation engine. Switch between detection scenes, camera angles, weather modes, and toggle privacy blur compliance.
            </p>
          </div>

          <div className="product-panel rounded-2xl overflow-hidden shadow-xl p-1">
            <HaydenSimulationCanvas
              currentScene={currentScene}
              onSelectScene={onSelectScene}
              privacyBlur={privacyBlur}
              onTogglePrivacyBlur={onTogglePrivacyBlur}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-slate-500">
            {[
              { icon: <MonitorPlay className="w-3.5 h-3.5" />, text: 'Switch detection scenes from the top tabs' },
              { icon: <Settings2 className="w-3.5 h-3.5" />, text: 'Change camera angle & weather mode' },
              { icon: <Eye className="w-3.5 h-3.5" />, text: 'Toggle DPDP privacy blur' },
              { icon: <Activity className="w-3.5 h-3.5" />, text: 'Real-time telemetry overlay' },
            ].map(hint => (
              <span key={hint.text} className="flex items-center gap-1.5 text-slate-400">
                <span className="text-sky-500">{hint.icon}</span>
                {hint.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE GRID — Categorized & Interactive */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div ref={ref4} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 border border-sky-200 text-sky-700 mb-3">SIH 2026 Specification</span>
              <h2 className="text-3xl font-bold text-slate-900">14 AI Modules</h2>
              <p className="text-slate-500 mt-1 text-sm">Every module is fully implemented and interactive in this prototype.</p>
            </div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {MODULE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveModuleCat(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    activeModuleCat === cat.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {visibleModules.map(m => (
              <ModuleCard key={m.id} mod={m} />
            ))}
          </div>

          <div className="text-center">
            <button onClick={onOpenFeatures} className="btn-outline text-sm">
              Explore all modules in detail
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* COMMAND CENTER CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div ref={ref5} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-sm font-semibold">Live Command Center</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">See the city's intelligence, live</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                The Command Center brings together every data stream — bus positions, road defects, traffic density,
                incident alerts — into one unified GIS dashboard. Watch the AI work in real time.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={onOpenGis} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-colors">
                  <Map className="w-4 h-4" />
                  Open Command Center
                </button>
                <button onClick={onOpenAdmin} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20">
                  <FileText className="w-4 h-4" />
                  Analytics Portal
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Bus className="w-4 h-4" />, label: 'Active Buses', value: '247', color: 'bg-sky-600' },
                { icon: <AlertTriangle className="w-4 h-4" />, label: 'Road Defects', value: '12', color: 'bg-red-600' },
                { icon: <Activity className="w-4 h-4" />, label: 'Traffic Alerts', value: '8', color: 'bg-amber-600' },
                { icon: <Users className="w-4 h-4" />, label: 'Ped. Risks', value: '3', color: 'bg-orange-600' },
                { icon: <Shield className="w-4 h-4" />, label: 'Emergency', value: '2', color: 'bg-purple-600' },
                { icon: <Map className="w-4 h-4" />, label: 'Coverage', value: '98%', color: 'bg-emerald-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer" onClick={onOpenGis}>
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                  <div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE STRIP */}
      <section className="py-10 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Standards compliance & research datasets</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {['RDD2022 Benchmark', 'IISc UVH-26', 'BMD-45 Dataset', 'CPWD SoR 2024', 'VeRi-776', 'DPDP Act 2023', 'IRC:82 Road Standards', 'MoRTH / IRC:SP:77'].map(s => (
              <span key={s} className="px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-500 font-medium bg-slate-50">{s}</span>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            Click{' '}
            <button onClick={onOpenDatasets} className="text-sky-600 underline hover:no-underline">Research Datasets</button>
            {' '}in the menu for full dataset documentation.
          </p>
        </div>
      </section>
    </div>
  );
};
