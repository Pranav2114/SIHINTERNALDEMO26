import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, Upload, Smartphone, Camera, BarChart3, Users, ShieldAlert,
  TrendingDown, Wrench, EyeOff, GitMerge, Award, Layers, Zap, CheckCircle,
  FileText, Play, RotateCcw, Crosshair, ArrowRight, ShieldCheck, Lock, ExternalLink
} from 'lucide-react';
import { RoadDefect, HitAndRunIncident, IndianVehicleCount, CitizenReport } from '../types';
import { INDIAN_VEHICLE_CLASSES, HIT_AND_RUN_DATA, CITIZEN_REPORTS } from '../data/mockData';

interface FeatureSpecificationSuiteProps {
  onSelectDefect?: (defect: RoadDefect) => void;
  onOpenDatasets: () => void;
}

export const FeatureSpecificationSuite: React.FC<FeatureSpecificationSuiteProps> = ({
  onOpenDatasets
}) => {
  const [activeModule, setActiveModule] = useState<number>(1);

  // Module 3: Gyroscope state
  const [gyroSensitivity, setGyroSensitivity] = useState(8.5);
  const [isSimulatingBump, setIsSimulatingBump] = useState(false);
  const gyroCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Module 2: Citizen Upload Portal state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<any>(null);

  // Module 6: Pedestrian Safety TTC state
  const [pedestrianSpeed, setPedestrianSpeed] = useState(1.4); // m/s
  const [vehicleDistance, setVehicleDistance] = useState(18); // meters
  const [vehicleSpeedKmh, setVehicleSpeedKmh] = useState(45); // km/h

  // Calculate TTC
  const speedMs = vehicleSpeedKmh / 3.6;
  const ttcSeconds = Math.max(0.4, vehicleDistance / Math.max(1, speedMs));
  const isTtcCritical = ttcSeconds < 2.0;

  // Module 8: Predictive Degradation state
  const [monsoonDays, setMonsoonDays] = useState(14);
  const [trafficVolume, setTrafficVolume] = useState<'moderate' | 'heavy' | 'extreme'>('heavy');
  const [roadAgeYears, setRoadAgeYears] = useState(3.5);

  // Module 10: Privacy Edge state
  const [blurIntensity, setBlurIntensity] = useState(90);
  const [epsilonValue, setEpsilonValue] = useState(0.5);

  // Live Gyroscope Oscilloscope Canvas
  useEffect(() => {
    if (activeModule !== 3) return;
    const canvas = gyroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const render = () => {
      offset += 1.5;
      const w = canvas.width = 600;
      const h = canvas.height = 180;

      ctx.fillStyle = '#070d18';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 30; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center baseline (Z-axis gravity 9.8 m/s²)
      const midY = h / 2;
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Z-axis accelerometer wave
      ctx.strokeStyle = isSimulatingBump ? '#ef4444' : '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let x = 0; x < w; x += 4) {
        const t = (x + offset) * 0.05;
        // Normal road vibration
        let bumpAmp = Math.sin(t * 1.8) * 6 + Math.cos(t * 3.4) * 4;
        // Inject sudden pothole shock if triggered
        if (isSimulatingBump && x > 260 && x < 360) {
          const bumpDist = Math.abs(x - 310);
          bumpAmp += (1 - bumpDist / 50) * -65 * (gyroSensitivity / 8.5);
        }
        const y = midY + bumpAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Threshold line
      ctx.strokeStyle = '#f43f5e88';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, midY - 35);
      ctx.lineTo(w, midY - 35);
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('ANOMALY THRESHOLD (14.2 m/s²)', 10, midY - 40);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeModule, isSimulatingBump, gyroSensitivity]);

  // Fake image upload handler
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      runAiVerification();
    }
  };

  const runAiVerification = () => {
    setIsVerifying(true);
    setVerifiedResult(null);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedResult({
        authenticityScore: 97.4,
        detectedClass: 'Pothole (D40 - RDD2022)',
        severity: 'High',
        estimatedDepth: '7.8 cm',
        crossReferencedBus: 'BMTC-500D (Confirmed 14m ago)',
        credibilityPoints: '+120 Karma Credits'
      });
    }, 1200);
  };

  // Module items list matching the PDF
  const modules = [
    { num: 1, title: 'Road Defect Detection', tag: 'YOLOv11 & DeepLabV3+' },
    { num: 2, title: 'Manual Upload Portal', tag: 'Citizen App & Siamese Net' },
    { num: 3, title: 'Two-Wheeler Gyroscope', tag: 'LSTM Vibration Anomaly' },
    { num: 4, title: 'Dashcam Integration', tag: 'Uber / Ola / Swiggy RTSP' },
    { num: 5, title: 'Traffic & Vehicle Analytics', tag: '14-Class IISc UVH-26' },
    { num: 6, title: 'Pedestrian Safety Module', tag: 'TTC < 2s Collision Alert' },
    { num: 7, title: 'Hit-and-Run Detection', tag: 'ALPR + Blockchain Hash' },
    { num: 8, title: 'Predictive Degradation', tag: 'Weather & Traffic Forecast' },
    { num: 9, title: 'Root Cause & CPWD Rates', tag: 'Cost Estimator (₹)' },
    { num: 10, title: 'Privacy Edge AI', tag: 'DPDP Act 2023 Compliance' },
    { num: 11, title: 'Cross-Camera Vehicle Re-ID', tag: 'OSNet Trajectory Fusion' },
    { num: 12, title: 'Gamified Citizen Rewards', tag: 'Civic Karma & Tax Rebate' },
    { num: 14, title: 'Multi-Modal Sensor Fusion', tag: 'Bayesian / Kalman Filter' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header Banner */}
      <div className="p-5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 border border-blue-200 text-blue-700">
              FEATURE SPECIFICATION WORKBENCH
            </span>
            <span className="text-xs text-slate-500 font-medium">Smart India Hackathon Prototype</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            14-Module Technical Implementation & Live Verification
          </h2>
        </div>

        <button
          onClick={onOpenDatasets}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-all shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Research Datasets (RDD2022, UVH-26, BMD-45)</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
        </button>
      </div>

      {/* Two Column Layout: Module Selector on Left, Interactive Playground on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Side Navigation Tabs (Clean Minimalism Dark Sidebar) */}
        <div className="md:col-span-4 border-r border-slate-200 bg-[#0F172A] p-3 space-y-1.5 max-h-[640px] overflow-y-auto">
          <div className="text-[10px] text-slate-400 px-3 py-1 font-bold uppercase tracking-wider">
            System Specification Modules:
          </div>
          {modules.map((m) => {
            const isActive = activeModule === m.num;
            return (
              <button
                key={m.num}
                onClick={() => setActiveModule(m.num)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {m.num}
                  </span>
                  <div>
                    <div className="font-semibold">{m.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">{m.tag}</div>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-blue-400 translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Module Detailed Interactive View */}
        <div className="md:col-span-8 p-6 bg-slate-50/50 flex flex-col justify-between overflow-y-auto max-h-[640px]">
          {/* 1. ROAD DEFECT DETECTION */}
          {activeModule === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 01 • RDD2022 AI</span>
                  <h3 className="text-lg font-bold text-white">8+ Road Infrastructure Defect Segmentation</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                  94.2% mAP@0.5 on Indian Roads
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Trained on RDD2022 (47,420 images) and CRACK500. Real-time inference executed on bus-mounted NVIDIA Jetson edge computers classifying severity into Low, Medium, and High.
              </p>

              {/* 8 Defect Classes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  { name: 'Pothole (D40)', count: '1,842 logged', color: '#ef4444', active: true },
                  { name: 'Alligator Cracks (D20)', count: '940 logged', color: '#f97316', active: true },
                  { name: 'Longitudinal Cracks', count: '620 logged', color: '#eab308', active: true },
                  { name: 'Missing Road Divider', count: '128 logged', color: '#8b5cf6', active: true },
                  { name: 'Faded Zebra Crossing', count: '310 logged', color: '#06b6d4', active: true },
                  { name: 'Damaged Signboard', count: '84 logged', color: '#3b82f6', active: true },
                  { name: 'Waterlogging / Puddle', count: '450 logged', color: '#0284c7', active: true },
                  { name: 'Sunken Manhole Drop', count: '290 logged', color: '#ec4899', active: true }
                ].map((defect, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: defect.color }}></span>
                      <span className="text-xs font-semibold text-white truncate">{defect.name}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-2">{defect.count}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">YOLOv11 TensorRT Optimization:</span>
                  <span className="text-emerald-400 font-bold">23.8 ms Latency (42 FPS)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">DeepLabV3+ Pixel Segmentation:</span>
                  <span className="text-cyan-400 font-bold">Pothole Surface Area & Depth Contour</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. MANUAL UPLOAD PORTAL */}
          {activeModule === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 02 • CITIZEN ENGAGEMENT</span>
                  <h3 className="text-lg font-bold text-white">Crowdsourced Defect Upload & AI Verification</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/30">
                  Siamese Network Anti-Fraud
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Allows citizens to snap geotagged defect photos. The backend runs Siamese image similarity to discard fake/duplicate reports and cross-references bus camera logs for instant validation.
              </p>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 text-center bg-slate-900/60 transition-colors">
                <input
                  type="file"
                  id="defectUpload"
                  accept="image/*"
                  onChange={handleUploadFile}
                  className="hidden"
                />
                <label htmlFor="defectUpload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-cyan-400 mb-2" />
                  <span className="text-xs font-bold text-white">Upload Pothole or Road Defect Photo</span>
                  <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, HEIC with GPS EXIF metadata</span>
                </label>
              </div>

              {/* Verified Result Simulation */}
              {isVerifying && (
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                  <span className="text-xs font-mono text-cyan-300">
                    Extracting EXIF GPS, running YOLO segmentation & cross-referencing BMTC Bus #500-D fleet feed...
                  </span>
                </div>
              )}

              {verifiedResult && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> AI Verification Successful
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{verifiedResult.authenticityScore}% Authenticity</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                    <div>Class: {verifiedResult.detectedClass}</div>
                    <div>Severity: {verifiedResult.severity}</div>
                    <div>Cross-Check: {verifiedResult.crossReferencedBus}</div>
                    <div className="text-amber-300 font-bold">{verifiedResult.credibilityPoints}</div>
                  </div>
                </div>
              )}

              {/* Sample Citizen Reports Table */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 font-bold">RECENT VERIFIED CITIZEN SUBMISSIONS:</div>
                {CITIZEN_REPORTS.slice(0, 2).map(c => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white font-mono">{c.id}</span> • {c.location}
                      <div className="text-[10px] text-slate-400">Reporter: {c.reporterName} (Credibility: {c.credibilityScore}%)</div>
                    </div>
                    <span className="text-amber-400 font-mono text-xs">+{c.karmaPointsAwarded} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. TWO-WHEELER GYROSCOPE DETECTION */}
          {activeModule === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 03 • TELEMETRY SENSING</span>
                  <h3 className="text-lg font-bold text-white">Smartphone Gyroscope & Accelerometer Anomaly Engine</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/30">
                  Isolation Forest ML
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Complementary detection for night & monsoon fog. Analyzes passenger smartphones and delivery two-wheeler motion telemetry to isolate road shock anomalies from ordinary braking.
              </p>

              {/* Live Oscilloscope Canvas */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070d18]">
                <canvas ref={gyroCanvasRef} className="w-full h-[180px] block" />
                <div className="absolute top-2 right-3 font-mono text-[11px] text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  Z-Axis (Vertical Acceleration)
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Shock Sensitivity:</span>
                    <span className="text-cyan-400">{gyroSensitivity} G-Force</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="16"
                    step="0.5"
                    value={gyroSensitivity}
                    onChange={e => setGyroSensitivity(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center">
                  <button
                    onMouseDown={() => setIsSimulatingBump(true)}
                    onMouseUp={() => setIsSimulatingBump(false)}
                    onTouchStart={() => setIsSimulatingBump(true)}
                    onTouchEnd={() => setIsSimulatingBump(false)}
                    className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                      isSimulatingBump
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-98'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:opacity-95'
                    }`}
                  >
                    {isSimulatingBump ? 'Pothole Shock Triggered (16.4 m/s²)' : 'Hold to Simulate Pothole Bump'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. DASHCAM INTEGRATION */}
          {activeModule === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 04 • FLEET FEDERATION</span>
                  <h3 className="text-lg font-bold text-white">Ride-Sharing & Delivery Fleet Dashcam Ingestion</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/30">
                  RTSP Streams + Jetson Nano
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Incentivized fleet integration partnering with Ola, Uber, and delivery partners (Swiggy, Zomato) to cover neighborhood arterial roads beyond primary transit bus corridors.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { partner: 'Uber Fleet Partner', activeNodes: 412, coverage: '92% Arterials', ping: '18ms' },
                  { partner: 'Ola Cabs Transit', activeNodes: 380, coverage: '88% Sub-arterials', ping: '22ms' },
                  { partner: 'Swiggy Delivery Mesh', activeNodes: 850, coverage: '98% Residential Lanes', ping: '31ms' },
                  { partner: 'Zomato Rider Network', activeNodes: 740, coverage: '95% Micro-corridors', ping: '29ms' }
                ].map((p, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{p.partner}</span>
                      <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
                    </div>
                    <div className="text-xs font-mono text-cyan-400">{p.activeNodes} Active Edge Cameras</div>
                    <div className="text-[11px] text-slate-400">Coverage: {p.coverage} • {p.ping}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TRAFFIC MONITORING & VEHICLE ANALYTICS */}
          {activeModule === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 05 • IISc UVH-26</span>
                  <h3 className="text-lg font-bold text-white">14-Class Indian Heterogeneous Traffic Classifier</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/30">
                  1.8M Bounding Boxes Dataset
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Custom trained on IISc Bengaluru UVH-26 dataset to handle the chaotic diversity of Indian traffic: auto-rickshaws, customized e-rickshaws, light commercial vehicles, and two-wheelers.
              </p>

              {/* Distribution Bar */}
              <div className="space-y-2">
                <div className="flex h-4 rounded-full overflow-hidden">
                  {INDIAN_VEHICLE_CLASSES.map((c, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${c.sharePercent}%`, backgroundColor: c.color }}
                      title={`${c.category}: ${c.sharePercent}%`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono pt-2">
                  {INDIAN_VEHICLE_CLASSES.slice(0, 6).map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }}></span>
                      <div className="truncate">
                        <div className="text-slate-300 truncate">{c.category}</div>
                        <div className="font-bold text-white">{c.count} ({c.sharePercent}%)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. PEDESTRIAN SAFETY MODULE */}
          {activeModule === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 06 • CONFLICT PREDICTION</span>
                  <h3 className="text-lg font-bold text-white">Pedestrian Collision Warning & TTC Calculator</h3>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-mono border ${
                  isTtcCritical ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  TTC: {ttcSeconds.toFixed(2)}s {isTtcCritical ? '[CRITICAL ALERT]' : '[SAFE]'}
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Monitors vulnerable pedestrians (school children crossing, seniors) and projects trajectory paths. If Time-to-Collision (TTC) drops under 2.0 seconds, high-priority audible alerts sound for the driver.
              </p>

              {/* Interactive TTC Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Vehicle Distance to Crosswalk:</span>
                    <span className="text-cyan-400 font-bold">{vehicleDistance} meters</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={vehicleDistance}
                    onChange={e => setVehicleDistance(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Bus Velocity:</span>
                    <span className="text-cyan-400 font-bold">{vehicleSpeedKmh} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="70"
                    value={vehicleSpeedKmh}
                    onChange={e => setVehicleSpeedKmh(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isTtcCritical
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              }`}>
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6" />
                  <div>
                    <div className="text-xs font-bold uppercase font-mono">
                      {isTtcCritical ? 'CRITICAL IMMINENT CONFLICT HAZARD' : 'CORRIDOR CLEAR'}
                    </div>
                    <div className="text-[11px] opacity-80">
                      {isTtcCritical
                        ? 'Pedestrian trajectory intersects bus velocity cone in <2s. Auto-brake pre-charge armed.'
                        : 'Clear margin maintained. Driver HUD in nominal tracking state.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. HIT-AND-RUN DETECTION */}
          {activeModule === 7 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 07 • LAW ENFORCEMENT</span>
                  <h3 className="text-lg font-bold text-white">Hit-and-Run Incident & Tamper-Proof ALPR</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-mono border border-rose-500/30">
                  BNS Sec 106(2) Compliance
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Detects sudden deceleration/rash collision impacts. Automatically extracts license plate characters, maintains trajectory continuity across nearby CCTV nodes, and hashes video evidence onto a verifiable ledger.
              </p>

              {/* Sample Hit and run Card */}
              {HIT_AND_RUN_DATA.map(h => (
                <div key={h.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-sm">{h.id} • {h.plateNumber}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {h.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                    <div>Vehicle: <span className="text-white">{h.vehicleModel}</span></div>
                    <div>Impact Velocity: <span className="text-rose-400">{h.speedAtImpactKmH} km/h</span></div>
                    <div>Location: <span className="text-white">{h.location}</span></div>
                    <div>Re-ID Match: <span className="text-emerald-400">{(h.reIdMatchScore * 100).toFixed(1)}%</span></div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate pt-1 border-t border-slate-800">
                    Blockchain Proof Hash: {h.evidenceHash}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 8. PREDICTIVE ROAD DEGRADATION */}
          {activeModule === 8 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 08 • PREDICTIVE AI</span>
                  <h3 className="text-lg font-bold text-white">Pothole Formation 2-4 Week Forecasting</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/30">
                  XGBoost + Survival Analysis
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Predicts exactly where small micro-cracks will deteriorate into catastrophic potholes 14-28 days before failure, correlating IMD rainfall data, heavy axle loads, and asphalt material age.
              </p>

              {/* Simulation Sliders */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400">Monsoon Rainfall Intensity:</span>
                  <div className="text-cyan-400 font-bold mt-1">{monsoonDays} Days Continuous Rain</div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={monsoonDays}
                    onChange={e => setMonsoonDays(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 mt-1"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Asphalt Surface Age:</span>
                  <div className="text-cyan-400 font-bold mt-1">{roadAgeYears} Years Since Last Resurface</div>
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={roadAgeYears}
                    onChange={e => setRoadAgeYears(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 mt-1"
                  />
                </div>
              </div>

              {/* Prediction Result Box */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                <div className="text-xs font-bold font-mono text-amber-300 uppercase">
                  FORECASTED CORRIDOR FAILURE WINDOW: 11 DAYS
                </div>
                <p className="text-xs text-slate-300">
                  Sub-base hydraulic erosion likelihood: 88.4%. Recommending proactive seal coating on Outer Ring Road before crater breakthrough saves ₹68,000 in heavy emergency reconstruction.
                </p>
              </div>
            </div>
          )}

          {/* 9. ROOT CAUSE & CPWD COSTING */}
          {activeModule === 9 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 09 • MUNICIPAL BUDGETING</span>
                  <h3 className="text-lg font-bold text-white">Root Cause Classification & CPWD Rate Estimator</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/30">
                  MoHUA Schedule of Rates 2024
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Automatically determines structural failure causes and calculates statutory municipal repair bill of quantities (BOQ) with IRC engineering standards.
              </p>

              <div className="space-y-2">
                {[
                  {
                    defect: 'Severe Edge Pothole (Depth: 9.8cm)',
                    cause: 'Water Seepage & Heavy Axle Shunting',
                    standard: 'IRC:116 / IRC:SP:77',
                    method: 'Cold Mix Bituminous Emulsion Patch',
                    cost: '₹4,850'
                  },
                  {
                    defect: 'Alligator Fatigue Cracking (180x140cm)',
                    cause: 'Sub-base Overload & Pavement Age',
                    standard: 'IRC:82 Maintenance Code',
                    method: 'Mastic Asphalt Seal & Geotextile Membrane',
                    cost: '₹7,200'
                  },
                  {
                    defect: 'Monsoon Waterlogging Basin (4.2m)',
                    cause: 'Clogged Stormwater Culvert & Slope Inversion',
                    standard: 'IRC:SP:42 Drainage Manual',
                    method: 'Culvert De-silt + Dense Bituminous Macadam (DBM)',
                    cost: '₹18,500'
                  }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{item.defect}</span>
                      <span className="text-amber-400 font-mono text-sm">{item.cost}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Cause: <span className="text-slate-200">{item.cause}</span> • Standard: <span className="text-cyan-400 font-mono">{item.standard}</span>
                    </div>
                    <div className="text-emerald-400 font-mono text-[11px]">{item.method}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. PRIVACY-PRESERVING EDGE AI */}
          {activeModule === 10 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 10 • STATUTORY PRIVACY</span>
                  <h3 className="text-lg font-bold text-white">Edge Anonymization & DPDP Act 2023 Compliance</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                  Differential Privacy ε={epsilonValue}
                </span>
              </div>

              <p className="text-xs text-slate-300">
                India's Digital Personal Data Protection (DPDP) Act 2023 strictly regulates public video. All commuter faces and non-offending license plates are obscured on-device inside the Jetson Xavier before any telemetry leaves the bus.
              </p>

              {/* Anonymization Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs font-mono text-slate-400 mb-2">RAW PASSENGER FACE & PEDESTRIANS</div>
                  <div className="h-24 bg-slate-800 rounded-lg flex items-center justify-center font-mono text-xs text-slate-500">
                    [NEVER EXPORTED OFF-DEVICE]
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-center">
                  <div className="text-xs font-mono text-emerald-400 mb-2">DPDP ANONYMIZED CLOUD STREAM</div>
                  <div className="h-24 bg-emerald-950/40 rounded-lg flex flex-col items-center justify-center font-mono text-xs text-emerald-300">
                    <Lock className="w-5 h-5 mb-1" />
                    <span>GAUSSIAN BLUR {blurIntensity}%</span>
                    <span className="text-[10px] text-slate-400">Homomorphic Encryption</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Blur Intensity Parameter:</span>
                  <span className="text-cyan-400">{blurIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={blurIntensity}
                  onChange={e => setBlurIntensity(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          )}

          {/* 11. CROSS-CAMERA VEHICLE RE-ID */}
          {activeModule === 11 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 11 • RE-IDENTIFICATION</span>
                  <h3 className="text-lg font-bold text-white">Appearance-Based Cross-Camera Tracking (OSNet)</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/30">
                  88.4% Rank-1 mAP
                </span>
              </div>

              <p className="text-xs text-slate-300">
                When license plates are covered with mud, missing, or obscured in heavy traffic, OSNet deep visual feature embeddings match vehicle paint color, dent profiles, and roof racks across multiple bus and CCTV feeds.
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">TRACKED TARGET: White Sedan (Unique Bumper Scuff)</span>
                  <span className="text-emerald-400">MATCH SCORE: 98.2%</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-slate-800 border border-slate-700">
                    <div className="text-[10px] text-slate-400">CAM 1: Bus 500-D</div>
                    <div className="text-cyan-400 font-bold mt-1">10:14:02 AM</div>
                  </div>
                  <div className="p-2 rounded bg-slate-800 border border-slate-700">
                    <div className="text-[10px] text-slate-400">CAM 2: Junction 14 CCTV</div>
                    <div className="text-cyan-400 font-bold mt-1">10:16:45 AM</div>
                  </div>
                  <div className="p-2 rounded bg-slate-800 border border-slate-700">
                    <div className="text-[10px] text-slate-400">CAM 3: Swiggy Dashcam #88</div>
                    <div className="text-cyan-400 font-bold mt-1">10:18:10 AM</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12. GAMIFIED CITIZEN REPORTING */}
          {activeModule === 12 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 12 • CIVIC REWARDS</span>
                  <h3 className="text-lg font-bold text-white">Gamified Civic Karma & Municipal Tax Credits</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/30">
                  Municipal Credit System
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Turns citizens into active infrastructure sensors. Verified defect reporters earn Civic Karma points exchangeable for municipal property tax rebates, Metro card recharge vouchers, and EV charging credits.
              </p>

              {/* Citizen Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold">POOJA SHARMA • LEVEL 4 INSPECTOR</span>
                  <div className="text-xl font-black text-white font-mono mt-1">1,480 Karma Credits</div>
                  <div className="text-[11px] text-slate-400">18 Verified Potholes • 0 False Reports (99.2% Trust)</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-mono font-bold text-xs">
                  ₹500 Tax Voucher Ready
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="font-bold text-white">Road Guardian</div>
                  <div className="text-[10px] text-slate-400">Badge Unlocked</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <div className="font-bold text-white">Top 5% Reporter</div>
                  <div className="text-[10px] text-slate-400">Bengaluru East</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="font-bold text-white">100% SLA Fix Rate</div>
                  <div className="text-[10px] text-slate-400">BBMP Resolved</div>
                </div>
              </div>
            </div>
          )}

          {/* 14. MULTI-MODAL SENSOR FUSION */}
          {activeModule === 14 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">MODULE 14 • DATA FUSION</span>
                  <h3 className="text-lg font-bold text-white">Bayesian & Kalman Multi-Modal Sensor Fusion</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/30">
                  98.7% Fused Accuracy
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Combines high-definition camera frames, two-wheeler accelerometer vibrations, and fleet dashcam telemetry. Eliminates false positives (shadows, oil stains) with weighted Bayesian certainty.
              </p>

              {/* Weights Table */}
              <div className="space-y-2">
                {[
                  { sensor: 'Front Bus Optical Camera (YOLOv11)', weight: '45% Weight', confidence: '94.2%', status: 'Nominal' },
                  { sensor: 'Two-Wheeler Smartphone Accelerometer', weight: '30% Weight', confidence: '96.8%', status: 'Nominal' },
                  { sensor: 'Swiggy / Uber Dashcam Secondary Stream', weight: '15% Weight', confidence: '91.0%', status: 'Nominal' },
                  { sensor: 'Historical GIS Defect Prior (ISRO Bhuvan)', weight: '10% Weight', confidence: '99.0%', status: 'Nominal' }
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{s.sensor}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-bold">{s.weight}</span>
                      <span className="text-emerald-400">{s.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-center justify-between">
                <div className="text-xs font-mono text-purple-300 font-bold uppercase">
                  COMPOSITE BAYESIAN CERTAINTY: 98.7%
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Zero Shadow False Positives
                </span>
              </div>
            </div>
          )}

          {/* Module Navigation Footer */}
          <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Module {activeModule} of 14 • Smart India Hackathon Architecture
            </span>
            <div className="flex gap-2">
              <button
                disabled={activeModule <= 1}
                onClick={() => {
                  const currIdx = modules.findIndex(m => m.num === activeModule);
                  if (currIdx > 0) setActiveModule(modules[currIdx - 1].num);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium disabled:opacity-40 shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={activeModule >= 14}
                onClick={() => {
                  const currIdx = modules.findIndex(m => m.num === activeModule);
                  if (currIdx < modules.length - 1) setActiveModule(modules[currIdx + 1].num);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold disabled:opacity-40 shadow-sm"
              >
                Next Feature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
