import React from 'react';
import { PopEffectItem } from '../types/game';

interface PopEffectProps {
  effects: PopEffectItem[];
}

export const PopEffect: React.FC<PopEffectProps> = ({ effects }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {effects.map((item) => (
        <div
          key={item.id}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none"
        >
          {/* Sparkle burst ring */}
          <div className="animate-pop-burst absolute w-24 h-24 -top-6 -left-6 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {item.type === 'ladybug' && (
                <>
                  <circle cx="50" cy="15" r="4" fill="#fde047" />
                  <circle cx="85" cy="50" r="3" fill="#facc15" />
                  <circle cx="50" cy="85" r="4" fill="#fde047" />
                  <circle cx="15" cy="50" r="3" fill="#facc15" />
                  <circle cx="75" cy="25" r="3" fill="#ffffff" />
                  <circle cx="25" cy="75" r="3" fill="#ffffff" />
                </>
              )}
              {item.type === 'bee' && (
                <>
                  <circle cx="50" cy="18" r="4" fill="#f87171" />
                  <circle cx="82" cy="50" r="3" fill="#fb923c" />
                  <circle cx="50" cy="82" r="4" fill="#ef4444" />
                  <circle cx="18" cy="50" r="3" fill="#fb923c" />
                </>
              )}
            </svg>
          </div>

          {/* Floating score text */}
          <span
            className={`animate-float-score font-black tracking-wider text-2xl sm:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
              item.type === 'ladybug'
                ? 'text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.7)]'
                : item.type === 'bee'
                ? 'text-rose-400 drop-shadow-[0_2px_8px_rgba(239,68,68,0.7)]'
                : 'text-emerald-300'
            }`}
          >
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
};
