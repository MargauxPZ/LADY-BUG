import React from 'react';

interface BeeProps {
  x: number;
  y: number;
  onTapBee: (e: React.MouseEvent | React.TouchEvent) => void;
  size?: number;
}

export const Bee: React.FC<BeeProps> = ({ x, y, onTapBee, size = 56 }) => {
  return (
    <div
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.8s ease-in-out, top 0.8s ease-in-out',
      }}
      className="absolute cursor-pointer z-15 touch-none group select-none"
      onPointerDown={(e) => {
        e.stopPropagation();
        onTapBee(e);
      }}
      aria-label="Hazard Bee (do not tap)"
      role="button"
      tabIndex={0}
    >
      {/* Generous touch target */}
      <div className="absolute -inset-2 rounded-full cursor-pointer" />

      {/* Perched Soft Shadow */}
      <div className="absolute inset-0 rounded-full bg-amber-950/20 blur-[3px] transform translate-y-3 scale-90" />

      {/* SVG Bee */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative group-hover:scale-105 active:scale-95 transition-transform duration-150 animate-gentle-pulse"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Fluttering Wings */}
        <g className="animate-bee-flutter origin-[50px_42px]">
          {/* Left Wing */}
          <ellipse
            cx="32"
            cy="28"
            rx="16"
            ry="9"
            transform="rotate(-25 32 28)"
            fill="url(#wingGrad)"
            stroke="#93c5fd"
            strokeWidth="1.2"
          />
          {/* Right Wing */}
          <ellipse
            cx="68"
            cy="28"
            rx="16"
            ry="9"
            transform="rotate(25 68 28)"
            fill="url(#wingGrad)"
            stroke="#93c5fd"
            strokeWidth="1.2"
          />
        </g>

        {/* Stinger */}
        <path d="M 50 82 L 46 72 L 54 72 Z" fill="#1f2937" />

        {/* Bee Fluffy Body (Striped) */}
        <ellipse cx="50" cy="52" rx="26" ry="24" fill="url(#beeBody)" />

        {/* Dark Stripes across body */}
        <g stroke="#1f2937" strokeWidth="6" strokeLinecap="round">
          <path d="M 28 46 Q 50 50 72 46" />
          <path d="M 27 58 Q 50 62 73 58" />
          <path d="M 33 69 Q 50 73 67 69" />
        </g>

        {/* Bee Antennae */}
        <g stroke="#1f2937" strokeWidth="2.2" strokeLinecap="round">
          <path d="M 44 26 Q 38 16 32 18" />
          <path d="M 56 26 Q 62 16 68 18" />
          <circle cx="32" cy="18" r="2.2" fill="#1f2937" />
          <circle cx="68" cy="18" r="2.2" fill="#1f2937" />
        </g>

        {/* Head */}
        <circle cx="50" cy="33" rx="14" ry="12" fill="url(#beeBody)" />

        {/* Cute Big Eyes */}
        <circle cx="43" cy="32" r="3.4" fill="#1f2937" />
        <circle cx="42" cy="31" r="1.1" fill="#ffffff" />

        <circle cx="57" cy="32" r="3.4" fill="#1f2937" />
        <circle cx="56" cy="31" r="1.1" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="38" cy="36" rx="2.2" ry="1.4" fill="#f43f5e" opacity="0.6" />
        <ellipse cx="62" cy="36" rx="2.2" ry="1.4" fill="#f43f5e" opacity="0.6" />

        {/* Smile */}
        <path d="M 47 37 Q 50 40 53 37" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
      </svg>

      {/* Tiny subtle caution indicator */}
      <div className="absolute -top-1 right-0 text-[10px] font-black bg-amber-400 text-amber-950 px-1 rounded-full shadow-xs">
        -1
      </div>
    </div>
  );
};
