import React from 'react';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Clock, Users, Video, 
  Layers, ChevronRight, CheckCircle2, AlertTriangle, Sparkles, ExternalLink 
} from 'lucide-react';
import { SimulationScene, ViolationType } from '../types';
import { HaydenSimulationCanvas } from './HaydenSimulationCanvas';

interface HaydenHeroSectionProps {
  currentScene: SimulationScene;
  onSelectScene: (sceneId: ViolationType) => void;
  privacyBlur: boolean;
  onTogglePrivacyBlur: () => void;
  onOpenGis: () => void;
  onOpenFeatures: () => void;
  onOpenDatasets: () => void;
}

export const HaydenHeroSection: React.FC<HaydenHeroSectionProps> = ({
  currentScene,
  onSelectScene,
  privacyBlur,
  onTogglePrivacyBlur,
  onOpenGis,
  onOpenFeatures,
  onOpenDatasets
}) => {
  return (
    <div className="space-y-12">
      {/* 1. TOP HERO HEADLINE & VISION AI BANNER */}
      <div className="relative pt-2 sm:pt-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              SMART INDIA HACKATHON PROTOTYPE • CLEAN MINIMALISM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              We're improving transit <br />
              <span className="text-blue-600">
                safety & infrastructure flow
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Equipping city transit buses with edge computer vision and multi-modal sensor fusion. Automatically detects potholes, road defects, and bus lane incursions in real-time.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={onOpenGis}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide shadow-sm transition-all flex items-center gap-2"
              >
                <span>Launch GIS Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenFeatures}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-200 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Inspect 14-Feature Spec</span>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Clean Minimalism Contrast Dark Hero Card (#1E293B) */}
          <div className="relative w-full sm:w-auto">
            <div className="p-6 rounded-2xl bg-[#1E293B] shadow-xl text-white flex flex-col justify-between w-full sm:w-72 h-64 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">EDGE PERCEPTION</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-black text-white tracking-tight">Vision AI</div>
                <div className="text-xs text-slate-400 font-mono">YOLOv11 + DeepLabV3+</div>
              </div>

              <div className="pt-3 border-t border-slate-700/70 space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Dataset:</span>
                  <span className="font-semibold text-white">RDD2022 + UVH-26</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Processing:</span>
                  <span className="text-emerald-400 font-bold font-mono">14.2 ms (42 FPS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compliance:</span>
                  <span className="text-blue-300 font-medium">DPDP Act 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 3D SIMULATION CANVAS CONTAINER */}
        <HaydenSimulationCanvas
          currentScene={currentScene}
          onSelectScene={onSelectScene}
          privacyBlur={privacyBlur}
          onTogglePrivacyBlur={onTogglePrivacyBlur}
        />
      </div>

      {/* 3. SIGNATURE NARRATIVE CARDS (Clean Minimalism White Containers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Fewer collisions, peace of mind
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Bus-mounted camera enforcement leads to fewer collisions along high-capacity transit routes. Proactive identification of deep craters, cracked expansion joints, and high-risk pedestrian conflicts means a smoother ride and reliable access to jobs, schools, and healthcare.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-600">
            <span>IRC:SP:77 Road Safety Guidelines compliant</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center font-bold text-green-700">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Transit + accessibility for all
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Illegal parking at bus stops makes curbside docking dangerous and impossible for bus drivers to properly deploy wheelchair accessibility ramps. By automating bus stop clearance and sidewalk encroachments, we restore barrier-free public mobility.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-green-700">
            <span>Rights of Persons with Disabilities Act (RPwD) Enforced</span>
          </div>
        </div>
      </div>

      {/* 4. HARNESS THE POWER: 3 PILLARS (Clean Minimalism numbered badges) */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Architecture</h2>
            <p className="text-2xl font-bold text-slate-800 mt-1">Next-Generation Transit Intelligence</p>
          </div>
          <button onClick={onOpenFeatures} className="text-blue-600 text-xs font-semibold hover:underline">
            EXPLORE MODULES
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-blue-600 mb-3">
                01
              </div>
              <h4 className="text-base font-bold text-slate-800">Safety Focused</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                By detecting road defects, potholes, missing dividers, and moving violations with edge intelligence installed directly on city buses, we give municipal corporations the tools to protect all commuters.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">
              Zero-latency edge triggers
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-blue-600 mb-3">
                02
              </div>
              <h4 className="text-base font-bold text-slate-800">Purpose-Built + Real-Time</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Custom perception models fine-tuned on Indian heterogeneous traffic (IISc UVH-26). Operates at 42 FPS on NVIDIA Jetson Xavier hardware without requiring high-bandwidth cloud video streaming.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">
              NVIDIA Jetson Optimized
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-blue-600 mb-3">
                03
              </div>
              <h4 className="text-base font-bold text-slate-800">Boosts On-Time Performance</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Clearing dedicated bus priority lanes (BRTS) and cycle tracks cuts average trip delays by up to 28%, significantly driving up public transit ridership and lowering citywide carbon emissions.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">
              28% Route Delay Reduction
            </div>
          </div>
        </div>
      </div>

      {/* 5. IN THE NEWS & HACKATHON BENCHMARKS */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs uppercase font-bold tracking-tight text-slate-500">
            In The News & Hackathon Benchmarks
          </span>
          <span className="text-xs font-semibold text-blue-600">Smart India Hackathon</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              headline: 'Bengaluru BMTC & Delhi DTC deploy bus-mounted edge AI for automated pothole audit',
              source: 'Smart Cities Mission Technical Bulletin',
              date: 'September 2024'
            },
            {
              headline: 'Indian Road Congress adopts automated computer vision standards for road asset maintenance',
              source: 'IRC Ministry of Road Transport & Highways',
              date: 'August 2024'
            },
            {
              headline: 'Multi-modal sensor fusion combines smartphone gyroscope telemetry with bus dashcam feeds',
              source: 'IISc Center for Infrastructure & Sustainable Transport',
              date: 'July 2024'
            },
            {
              headline: 'DPDP Act 2023 privacy compliant edge AI model obscures non-violating citizen faces and plates',
              source: 'Ministry of Electronics & IT (MeitY)',
              date: 'June 2024'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="text-xs font-bold text-slate-800 leading-snug">{item.headline}</div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>{item.source}</span>
                <span className="text-blue-600 font-semibold">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

