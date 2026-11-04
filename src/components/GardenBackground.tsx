import React from 'react';

export const GardenBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Base Soft Green Lush Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-800" />

      {/* Dappled Sunlit Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(240,253,244,0.35)_0%,rgba(22,101,52,0.4)_70%,rgba(6,78,59,0.7)_100%)]" />

      {/* SVG Layered Leaves & Foliage */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Leaf gradient 1 */}
          <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#22c55e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.5" />
          </linearGradient>

          {/* Leaf gradient 2 */}
          <linearGradient id="leafGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#166534" stopOpacity="0.6" />
          </linearGradient>

          {/* Dew drop highlight */}
          <radialGradient id="dewDrop" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#a7f3d0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Top Left Big Soft Tropical Leaf */}
        <g transform="translate(-80, -60) rotate(15) scale(1.6)">
          <path
            d="M 50 120 C 120 40 260 60 300 200 C 320 280 240 380 140 380 C 40 380 20 260 50 120 Z"
            fill="url(#leafGrad1)"
          />
          {/* Main Leaf Stem */}
          <path
            d="M 60 140 Q 180 240 280 260"
            stroke="#a7f3d0"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Veins */}
          <path
            d="M 120 180 Q 170 160 210 145 M 150 210 Q 200 210 240 205 M 180 240 Q 210 270 230 295"
            stroke="#a7f3d0"
            strokeWidth="1.8"
            opacity="0.25"
          />
        </g>

        {/* Bottom Right Lush Leaf */}
        <g transform="translate(700, 350) rotate(-20) scale(1.8)">
          <path
            d="M 200 50 C 350 100 420 280 340 380 C 260 480 120 440 60 320 C 0 200 80 80 200 50 Z"
            fill="url(#leafGrad2)"
          />
          <path
            d="M 190 70 Q 230 260 160 360"
            stroke="#86efac"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>

        {/* Bottom Left Leaf */}
        <g transform="translate(-50, 420) rotate(-10) scale(1.4)">
          <path
            d="M 100 100 C 220 60 320 180 300 280 C 280 380 160 380 90 320 C 20 260 40 180 100 100 Z"
            fill="url(#leafGrad1)"
          />
        </g>

        {/* Top Right Curved Frond */}
        <g transform="translate(680, -80) rotate(35) scale(1.5)">
          <path
            d="M 150 80 C 280 120 360 260 300 360 C 240 440 120 380 80 280 C 40 180 80 120 150 80 Z"
            fill="url(#leafGrad2)"
          />
        </g>

        {/* Cute Dew Drops with shine */}
        <ellipse cx="25%" cy="30%" rx="14" ry="11" fill="url(#dewDrop)" />
        <circle cx="24.2%" cy="29%" r="3" fill="#ffffff" opacity="0.9" />

        <ellipse cx="78%" cy="65%" rx="18" ry="14" fill="url(#dewDrop)" />
        <circle cx="77.2%" cy="63.5%" r="4" fill="#ffffff" opacity="0.9" />

        <ellipse cx="62%" cy="20%" rx="10" ry="8" fill="url(#dewDrop)" />
        <circle cx="61.5%" cy="19.2%" r="2" fill="#ffffff" opacity="0.8" />
      </svg>

      {/* Gentle Floating Clover / Leaf Accents */}
      <div className="absolute top-[18%] left-[12%] animate-float-leaf opacity-35">
        <svg width="44" height="44" viewBox="0 0 100 100" fill="#a7f3d0">
          {/* Stylized 4-leaf clover accent */}
          <path d="M50,50 C40,30 20,30 20,50 C20,70 40,70 50,50 Z" />
          <path d="M50,50 C30,40 30,20 50,20 C70,20 70,40 50,50 Z" />
          <path d="M50,50 C60,30 80,30 80,50 C80,70 60,70 50,50 Z" />
          <path d="M50,50 C30,60 30,80 50,80 C70,80 70,60 50,50 Z" />
        </svg>
      </div>

      <div className="absolute bottom-[22%] right-[15%] animate-float-leaf [animation-delay:2.5s] opacity-30">
        <svg width="36" height="36" viewBox="0 0 100 100" fill="#86efac">
          <path d="M50,50 C40,30 20,30 20,50 C20,70 40,70 50,50 Z" />
          <path d="M50,50 C30,40 30,20 50,20 C70,20 70,40 50,50 Z" />
          <path d="M50,50 C60,30 80,30 80,50 C80,70 60,70 50,50 Z" />
          <path d="M50,50 C30,60 30,80 50,80 C70,80 70,60 50,50 Z" />
        </svg>
      </div>

      {/* Soft warm sun glow at top center */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 bg-amber-200/20 blur-3xl rounded-full" />
    </div>
  );
};
