import React from 'react';

interface LadybugProps {
  x: number; // percentage in arena (e.g. 10 - 90)
  y: number; // percentage in arena (e.g. 10 - 90)
  rotation: number; // degrees
  isCrawling: boolean;
  isPopping: boolean;
  onCatch: (e: React.MouseEvent | React.TouchEvent) => void;
  size?: number; // base size in px (e.g. 64)
}

export const Ladybug: React.FC<LadybugProps> = ({
  x,
  y,
  rotation,
  isCrawling,
  isPopping,
  onCatch,
  size = 68,
}) => {
  return (
    <div
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${isPopping ? 1.4 : 1})`,
        transition: isCrawling
          ? 'left 0.4s linear, top 0.4s linear, transform 0.25s ease-out'
          : 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className={`absolute cursor-pointer z-20 group touch-none select-none ${
        isPopping ? 'pointer-events-none' : ''
      }`}
      onPointerDown={(e) => {
        e.stopPropagation();
        onCatch(e);
      }}
      aria-label="Catch ladybug"
      role="button"
      tabIndex={0}
    >
      {/* Generous touch target wrapper to guarantee easy tapping on mobile */}
      <div className="absolute -inset-3 rounded-full cursor-pointer" />

      {/* Perched Soft Drop Shadow */}
      <div
        className="absolute inset-0 rounded-full bg-emerald-950/25 blur-[3px] transform translate-y-2 translate-x-0.5 scale-95 transition-transform"
      />

      {/* Pure SVG Ladybug */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full relative transition-transform duration-150 ${
          isPopping ? 'animate-pop-burst' : 'group-hover:scale-105 active:scale-95'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial Gradient for 3D Domed Red Shell */}
          <radialGradient
            id="wingGlow"
            cx="35%"
            cy="35%"
            r="65%"
            fx="30%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="45%" stopColor="#e61919" />
            <stop offset="85%" stopColor="#b30006" />
            <stop offset="100%" stopColor="#800000" />
          </radialGradient>

          {/* Glossy top-left shell reflection */}
          <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Soft head gradient */}
          <radialGradient id="headGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#333333" />
            <stop offset="70%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
        </defs>

        {/* 6 Cute articulated legs */}
        <g stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Legs */}
          <path
            d="M 28 36 Q 14 30 10 24"
            className={isCrawling ? 'animate-pulse' : ''}
          />
          <path
            d="M 24 50 Q 10 50 8 52"
            className={isCrawling ? 'animate-pulse' : ''}
          />
          <path
            d="M 28 66 Q 14 74 12 84"
            className={isCrawling ? 'animate-pulse' : ''}
          />

          {/* Right Legs */}
          <path
            d="M 72 36 Q 86 30 90 24"
            className={isCrawling ? 'animate-pulse' : ''}
          />
          <path
            d="M 76 50 Q 90 50 92 52"
            className={isCrawling ? 'animate-pulse' : ''}
          />
          <path
            d="M 72 66 Q 86 74 88 84"
            className={isCrawling ? 'animate-pulse' : ''}
          />
        </g>

        {/* Antennae */}
        <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
          <path d="M 44 20 Q 38 10 32 8" />
          <path d="M 56 20 Q 62 10 68 8" />
          {/* Little antenna balls */}
          <circle cx="32" cy="8" r="3" fill="#1a1a1a" />
          <circle cx="68" cy="8" r="3" fill="#1a1a1a" />
        </g>

        {/* Head */}
        <path
          d="M 34 26 C 34 16 66 16 66 26 C 66 32 34 32 34 26 Z"
          fill="url(#headGrad)"
        />

        {/* Big Cute Friendly Eyes */}
        <circle cx="42" cy="22" r="3.8" fill="#ffffff" />
        <circle cx="42.5" cy="22.2" r="2.2" fill="#111827" />
        <circle cx="41.5" cy="21" r="1.1" fill="#ffffff" />

        <circle cx="58" cy="22" r="3.8" fill="#ffffff" />
        <circle cx="57.5" cy="22.2" r="2.2" fill="#111827" />
        <circle cx="56.5" cy="21" r="1.1" fill="#ffffff" />

        {/* Pronotum / Collar (Black band behind head) */}
        <path
          d="M 30 33 C 30 26 70 26 70 33 C 74 38 72 40 68 40 L 32 40 C 28 40 26 38 30 33 Z"
          fill="#141414"
        />
        {/* White markings on collar */}
        <circle cx="35" cy="34" r="2.5" fill="#f8fafc" opacity="0.9" />
        <circle cx="65" cy="34" r="2.5" fill="#f8fafc" opacity="0.9" />

        {/* Main Body Shell (Red) */}
        <ellipse
          cx="50"
          cy="58"
          rx="32"
          ry="33"
          fill="url(#wingGlow)"
        />

        {/* Center Wing Dividing Seam */}
        <line
          x1="50"
          y1="34"
          x2="50"
          y2="91"
          stroke="#111111"
          strokeWidth="2.2"
        />

        {/* Black Spots (7 iconic spots) */}
        {/* Top center split spot */}
        <circle cx="50" cy="41" r="4.2" fill="#111111" />

        {/* Left wing spots */}
        <circle cx="34" cy="50" r="5.2" fill="#111111" />
        <circle cx="32" cy="68" r="4.8" fill="#111111" />
        <circle cx="44" cy="78" r="4.4" fill="#111111" />

        {/* Right wing spots */}
        <circle cx="66" cy="50" r="5.2" fill="#111111" />
        <circle cx="68" cy="68" r="4.8" fill="#111111" />
        <circle cx="56" cy="78" r="4.4" fill="#111111" />

        {/* Glossy Curved Highlight Reflection on Left Elytron */}
        <path
          d="M 28 46 C 26 56 30 70 34 76 C 31 70 29 58 31 48 C 33 42 38 38 42 36 C 36 37 30 40 28 46 Z"
          fill="url(#gloss)"
        />
      </svg>
    </div>
  );
};
