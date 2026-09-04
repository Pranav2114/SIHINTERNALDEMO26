import React from 'react';

interface UrbanEyeLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  theme?: 'dark' | 'light' | 'auto';
}

export const UrbanEyeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={(size * 220) / 360}
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="ue_eyelid_top" x1="50" y1="40" x2="330" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1B3D" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        <linearGradient id="ue_eyelid_bottom" x1="90" y1="180" x2="310" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D2D3" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>

        <radialGradient id="ue_iris_grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="25%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </radialGradient>

        <linearGradient id="ue_road_grad" x1="180" y1="130" x2="180" y2="195" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <filter id="ue_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Sclera / Background Eye Area */}
      <path
        d="M 60 115 Q 180 28 320 115 Q 180 200 60 115 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />

      {/* Digital Data Pixel Blocks (Left Corner Streaming Vision) */}
      <rect x="52" y="118" width="6" height="6" fill="#00D2D3" />
      <rect x="62" y="118" width="6" height="6" fill="#0EA5E9" />
      <rect x="70" y="122" width="7" height="7" fill="#0284C7" />
      <rect x="79" y="118" width="6" height="6" fill="#38BDF8" />
      <rect x="66" y="129" width="6" height="6" fill="#06B6D4" />
      <rect x="74" y="131" width="7" height="7" fill="#00D2D3" />
      <rect x="84" y="126" width="6" height="6" fill="#0284C7" />
      <rect x="92" y="132" width="8" height="8" fill="#38BDF8" />
      <rect x="85" y="136" width="7" height="7" fill="#00D2D3" />
      <rect x="94" y="142" width="6" height="6" fill="#0284C7" />

      {/* Top Bold Eyelid Arc */}
      <path
        d="M 60 115 C 100 50, 240 32, 320 115 C 260 55, 140 68, 60 115 Z"
        fill="url(#ue_eyelid_top)"
      />

      {/* Bottom Sleek Eyelid Arc */}
      <path
        d="M 95 145 C 150 188, 260 184, 320 115 C 270 170, 160 172, 95 145 Z"
        fill="url(#ue_eyelid_bottom)"
      />

      {/* Central Iris & HUD Rings */}
      <g transform="translate(180, 114)">
        {/* Outer HUD Tech Ring 1 */}
        <circle cx="0" cy="0" r="54" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.6" />
        
        {/* Outer HUD Tech Ring 2 with Target Arcs */}
        <circle cx="0" cy="0" r="48" stroke="#0284C7" strokeWidth="2" strokeDasharray="18 10 4 10" fill="none" opacity="0.8" />

        {/* Iris Body */}
        <circle cx="0" cy="0" r="44" fill="url(#ue_iris_grad)" />

        {/* Inner Tech Calibration Ring */}
        <circle cx="0" cy="0" r="34" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.8" />

        {/* City Skyline Silhouette inside Iris */}
        <g fill="#0B1B3D">
          <rect x="-38" y="-4" width="6" height="40" />
          <rect x="-31" y="-12" width="7" height="48" />
          <rect x="-23" y="-2" width="5" height="38" />
          <rect x="-17" y="-16" width="8" height="52" />
          <polygon points="-17,-16 -13,-24 -9,-16" fill="#0B1B3D" />
          <rect x="-8" y="-6" width="6" height="42" />
          <rect x="3" y="-8" width="6" height="44" />
          <rect x="10" y="-18" width="8" height="54" />
          <polygon points="10,-18 14,-26 18,-18" fill="#0B1B3D" />
          <rect x="19" y="-4" width="5" height="40" />
          <rect x="25" y="-14" width="7" height="50" />
          <rect x="33" y="-2" width="6" height="38" />
        </g>

        {/* Highway Road through City into Distance */}
        <path
          d="M -18 42 L -3 10 L 3 10 L 18 42 Z"
          fill="url(#ue_road_grad)"
          stroke="#38BDF8"
          strokeWidth="1"
        />

        {/* Road Lane Markings */}
        <line x1="0" y1="12" x2="0" y2="18" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="0" y1="22" x2="0" y2="29" stroke="#FFFFFF" strokeWidth="1.2" />
        <line x1="0" y1="33" x2="0" y2="42" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Pupil */}
        <circle cx="0" cy="-6" r="18" fill="#0A0F1D" />

        {/* Specular Light Reflection */}
        <ellipse cx="6" cy="-12" rx="4.5" ry="3" fill="#FFFFFF" opacity="0.95" />
      </g>
    </svg>
  );
};

export const UrbanEyeLogo: React.FC<UrbanEyeLogoProps> = ({
  className = '',
  size = 40,
  showText = true,
  layout = 'horizontal',
  theme = 'auto'
}) => {
  const isHorizontal = layout === 'horizontal';
  const isVertical = layout === 'vertical';

  if (!showText || layout === 'icon-only') {
    return <UrbanEyeIcon size={size} className={className} />;
  }

  if (isVertical) {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <UrbanEyeIcon size={size * 1.8} />
        <div className="mt-1 flex flex-col items-center">
          <div className="flex items-center tracking-tight">
            <span className={`text-xl sm:text-2xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Urban
            </span>
            <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 tracking-wider ml-1">
              EYE
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 w-full justify-center">
            <span className="h-[1.5px] w-6 bg-gradient-to-r from-transparent to-cyan-500 rounded-full" />
            <span className="text-[11px] font-black tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
              AI
            </span>
            <span className="h-[1.5px] w-6 bg-gradient-to-l from-transparent to-cyan-500 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Horizontal layout (Standard Navbar / Header)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <UrbanEyeIcon size={size} />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`text-base sm:text-lg font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Urban
          </span>
          <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 tracking-wide">
            EYE
          </span>
          <span className="text-[11px] font-black text-cyan-600 dark:text-cyan-400 tracking-widest ml-0.5">
            AI
          </span>
        </div>
        <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 tracking-wider">
          Road Safety & Infrastructure
        </span>
      </div>
    </div>
  );
};
