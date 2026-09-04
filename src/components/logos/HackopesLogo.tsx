import React from 'react';

interface HackopesLogoProps {
  className?: string;
  size?: number;
  showTagline?: boolean;
  showText?: boolean;
  layout?: 'horizontal' | 'vertical' | 'badge-only';
  theme?: 'dark' | 'light' | 'auto';
}

export const HackopesIcon: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="ho_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="ho_circ_grad" x1="50" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B253A" />
          <stop offset="60%" stopColor="#071927" />
          <stop offset="100%" stopColor="#040F18" />
        </linearGradient>

        <linearGradient id="ho_leaf_grad" x1="150" y1="60" x2="210" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="ho_border_grad" x1="150" y1="20" x2="280" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        <linearGradient id="ho_trace_grad" x1="50" y1="50" x2="150" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Outer Glow & Background Circle */}
      <circle cx="160" cy="150" r="110" fill="url(#ho_circ_grad)" stroke="#0E334E" strokeWidth="2" />

      {/* Right Hemisphere Neon Border */}
      <path
        d="M 160 40 A 110 110 0 0 1 160 260"
        stroke="url(#ho_border_grad)"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#ho_glow)"
      />

      {/* =================================================== */}
      {/* LEFT HALF: CIRCUITRY NETWORK & IC CHIP             */}
      {/* =================================================== */}
      <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Outer Extended Node Terminal Pins (Left Edge) */}
        <line x1="85" y1="70" x2="105" y2="70" />
        <line x1="68" y1="95" x2="95" y2="95" />
        <line x1="60" y1="120" x2="90" y2="120" />
        <line x1="55" y1="150" x2="85" y2="150" />
        <line x1="62" y1="180" x2="95" y2="180" />
        <line x1="72" y1="205" x2="105" y2="205" />
        <line x1="90" y1="230" x2="115" y2="230" />

        {/* Outer Terminal Pin Heads */}
        <circle cx="85" cy="70" r="3.5" fill="#38BDF8" />
        <circle cx="68" cy="95" r="3.5" fill="#38BDF8" />
        <circle cx="60" cy="120" r="3.5" fill="#38BDF8" />
        <circle cx="55" cy="150" r="3.5" fill="#38BDF8" />
        <circle cx="62" cy="180" r="3.5" fill="#38BDF8" />
        <circle cx="72" cy="205" r="3.5" fill="#38BDF8" />
        <circle cx="90" cy="230" r="3.5" fill="#38BDF8" />

        {/* Internal PCB Traces */}
        <path d="M 105 70 L 125 70 L 140 85 L 140 110" />
        <path d="M 95 95 L 115 95 L 130 110 L 145 110" />
        <path d="M 90 120 L 110 120 L 125 135 L 125 150" />
        <path d="M 85 150 L 110 150 L 125 165 L 140 165" />
        <path d="M 95 180 L 115 180 L 135 160 L 145 160" />
        <path d="M 105 205 L 125 205 L 140 190 L 140 175" />
        <path d="M 115 230 L 135 230 L 150 215 L 150 185" />

        {/* Internal Solder Nodes */}
        <circle cx="125" cy="70" r="2.5" fill="#38BDF8" />
        <circle cx="115" cy="95" r="2.5" fill="#38BDF8" />
        <circle cx="110" cy="120" r="2.5" fill="#38BDF8" />
        <circle cx="125" cy="165" r="2.5" fill="#38BDF8" />
        <circle cx="135" cy="160" r="2.5" fill="#38BDF8" />
        <circle cx="140" cy="190" r="2.5" fill="#38BDF8" />
      </g>

      {/* Central Glowing Orange Microchip with Circuit Bracket */}
      <g transform="translate(130, 134)">
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          rx="4"
          fill="#D97706"
          stroke="#FBBF24"
          strokeWidth="1.5"
          filter="url(#ho_glow)"
        />
        <text
          x="12"
          y="16"
          fill="#FEF3C7"
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
        >
          &#123;&#125;
        </text>
        {/* Chip connection pin leads */}
        <line x1="-4" y1="6" x2="0" y2="6" stroke="#FBBF24" strokeWidth="1.5" />
        <line x1="-4" y1="18" x2="0" y2="18" stroke="#FBBF24" strokeWidth="1.5" />
        <line x1="24" y1="12" x2="28" y2="12" stroke="#FBBF24" strokeWidth="1.5" />
      </g>

      {/* =================================================== */}
      {/* RIGHT HALF: SPROUTING LEAF & TECH INNOVATION       */}
      {/* =================================================== */}
      {/* Plant Main Stem */}
      <path
        d="M 160 250 L 160 65"
        stroke="#10B981"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Top Center Leaf */}
      <path
        d="M 160 70 C 145 100, 145 130, 160 145 C 175 130, 175 100, 160 70 Z"
        fill="url(#ho_leaf_grad)"
        stroke="#6EE7B7"
        strokeWidth="1.5"
      />
      <line x1="160" y1="85" x2="160" y2="135" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />

      {/* Middle Right Leaf */}
      <path
        d="M 160 170 C 180 150, 215 155, 225 180 C 205 195, 175 190, 160 170 Z"
        fill="url(#ho_leaf_grad)"
        stroke="#6EE7B7"
        strokeWidth="1.5"
      />
      <line x1="168" y1="172" x2="210" y2="180" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Bottom Right Leaf */}
      <path
        d="M 160 215 C 175 200, 205 205, 215 225 C 195 238, 175 230, 160 215 Z"
        fill="url(#ho_leaf_grad)"
        stroke="#6EE7B7"
        strokeWidth="1.5"
      />
      <line x1="168" y1="216" x2="202" y2="223" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Floating Idea Lightbulb */}
      <g transform="translate(195, 80)">
        <path
          d="M 10 2 A 8 8 0 0 0 2 10 C 2 13 4 15 5 17 L 15 17 C 16 15 18 13 18 10 A 8 8 0 0 0 10 2 Z"
          fill="#FDE047"
          opacity="0.9"
          filter="url(#ho_glow)"
        />
        <rect x="7" y="18" width="6" height="3" fill="#D4D4D8" rx="1" />
      </g>

      {/* Code Curly Brackets Icon { } */}
      <text
        x="195"
        y="125"
        fill="#A7F3D0"
        fontSize="16"
        fontWeight="bold"
        fontFamily="monospace"
      >
        &#123;&#125;
      </text>

      {/* Mechanical Gear Cogwheel */}
      <g transform="translate(225, 190)" fill="#34D399" opacity="0.85">
        <circle cx="10" cy="10" r="5" fill="none" stroke="#34D399" strokeWidth="2.5" />
        <circle cx="10" cy="10" r="2" fill="#064E3B" />
        <rect x="9" y="1" width="2" height="4" rx="0.5" />
        <rect x="9" y="15" width="2" height="4" rx="0.5" />
        <rect x="1" y="9" width="4" height="2" rx="0.5" />
        <rect x="15" y="9" width="4" height="2" rx="0.5" />
      </g>

      {/* Glowing Lime Mouse Cursor Arrow */}
      <g transform="translate(210, 130) rotate(-15)">
        <polygon
          points="0,0 0,18 5,14 9,21 12,20 8,13 14,13"
          fill="#A3E635"
          stroke="#1E293B"
          strokeWidth="1.5"
          filter="url(#ho_glow)"
        />
      </g>
    </svg>
  );
};

export const HackopesLogo: React.FC<HackopesLogoProps> = ({
  className = '',
  size = 40,
  showTagline = true,
  showText = true,
  layout = 'horizontal',
  theme = 'auto'
}) => {
  if (!showText || layout === 'badge-only') {
    return <HackopesIcon size={size} className={className} />;
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <HackopesIcon size={size * 1.5} />
        <div className="mt-1 flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 tracking-wide">
            Hackopes
          </span>
          {showTagline && (
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 tracking-tight">
              class Hackopes &#123; creativeSolutions() &#125; •
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout (Header or Footer)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <HackopesIcon size={size} />
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 tracking-wide">
            Hackopes
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
            Team
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono text-slate-400 mt-1 tracking-tight truncate max-w-[210px] sm:max-w-none">
            class Hackopes &#123; creativeSolutions() &#125; •
          </span>
        )}
      </div>
    </div>
  );
};
