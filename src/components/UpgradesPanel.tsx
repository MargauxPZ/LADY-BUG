import React from 'react';
import { GameUpgrades } from '../types/game';
import { Sparkles, X, Volume2, VolumeX, Zap, Bug, AlertTriangle } from 'lucide-react';

interface UpgradesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  upgrades: GameUpgrades;
  onChangeUpgrades: (newUpgrades: GameUpgrades) => void;
  onToggleSound: () => void;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  isOpen,
  onClose,
  upgrades,
  onChangeUpgrades,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  const toggleUpgrade = (key: keyof GameUpgrades) => {
    if (key === 'soundEnabled') {
      onToggleSound();
      return;
    }
    onChangeUpgrades({
      ...upgrades,
      [key]: !upgrades[key],
    });
  };

  const setPreset = (preset: 'classic' | 'all') => {
    if (preset === 'classic') {
      onChangeUpgrades({
        crawl: false,
        speedRamp: false,
        hasBee: false,
        soundEnabled: upgrades.soundEnabled,
      });
    } else {
      onChangeUpgrades({
        crawl: true,
        speedRamp: true,
        hasBee: true,
        soundEnabled: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-white">
                Game Upgrades
              </h2>
              <p className="text-xs text-stone-400">
                Try each feature one at a time!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
            aria-label="Close upgrades panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => setPreset('classic')}
            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
              !upgrades.crawl && !upgrades.speedRamp && !upgrades.hasBee
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            🌱 Classic Mode
          </button>
          <button
            onClick={() => setPreset('all')}
            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
              upgrades.crawl && upgrades.speedRamp && upgrades.hasBee
                ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
            }`}
          >
            🌟 All Upgrades Active
          </button>
        </div>

        {/* Toggle List */}
        <div className="mt-4 space-y-3">
          {/* Upgrade 1: Soft Sounds */}
          <div
            onClick={() => toggleUpgrade('soundEnabled')}
            className="flex items-center justify-between p-3.5 bg-stone-800/80 hover:bg-stone-800 rounded-2xl cursor-pointer border border-stone-700/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl mt-0.5">
                {upgrades.soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100">
                  Soft Sound Effects
                </div>
                <div className="text-xs text-stone-400 leading-snug">
                  Cute pop on catch & celebratory milestone chimes
                </div>
              </div>
            </div>
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                upgrades.soundEnabled ? 'bg-sky-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  upgrades.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Upgrade 2: Slow Crawl */}
          <div
            onClick={() => toggleUpgrade('crawl')}
            className="flex items-center justify-between p-3.5 bg-stone-800/80 hover:bg-stone-800 rounded-2xl cursor-pointer border border-stone-700/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl mt-0.5">
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100">
                  Slow Crawling Ladybug
                </div>
                <div className="text-xs text-stone-400 leading-snug">
                  Ladybug slowly crawls across leaves instead of sitting still
                </div>
              </div>
            </div>
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                upgrades.crawl ? 'bg-emerald-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  upgrades.crawl ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Upgrade 3: Speed Ramp */}
          <div
            onClick={() => toggleUpgrade('speedRamp')}
            className="flex items-center justify-between p-3.5 bg-stone-800/80 hover:bg-stone-800 rounded-2xl cursor-pointer border border-stone-700/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100">
                  Speed Up Every 5 Points
                </div>
                <div className="text-xs text-stone-400 leading-snug">
                  Moves faster & hops around quicker as your score increases
                </div>
              </div>
            </div>
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                upgrades.speedRamp ? 'bg-purple-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  upgrades.speedRamp ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Upgrade 4: Hazard Bee */}
          <div
            onClick={() => toggleUpgrade('hasBee')}
            className="flex items-center justify-between p-3.5 bg-stone-800/80 hover:bg-stone-800 rounded-2xl cursor-pointer border border-stone-700/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-100">
                  Sneaky Bumblebee Hazard
                </div>
                <div className="text-xs text-stone-400 leading-snug">
                  A buzzing bee appears. Be careful! Tapping it costs 1 point
                </div>
              </div>
            </div>
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                upgrades.hasBee ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  upgrades.hasBee ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black tracking-wide text-sm transition-transform active:scale-98 shadow-lg shadow-emerald-500/20"
        >
          Save & Return to Garden
        </button>
      </div>
    </div>
  );
};
