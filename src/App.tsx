/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Volume2, VolumeX, Sliders, Play, RotateCcw, Sparkles } from 'lucide-react';
import { GamePhase, GameUpgrades, PopEffectItem, Position } from './types/game';
import { sound } from './utils/audio';
import { Ladybug } from './components/Ladybug';
import { Bee } from './components/Bee';
import { GardenBackground } from './components/GardenBackground';
import { PopEffect } from './components/PopEffect';
import { UpgradesPanel } from './components/UpgradesPanel';

const GAME_DURATION = 30; // 30 seconds as specified

export default function App() {
  // Game Phase
  const [phase, setPhase] = useState<GamePhase>('TITLE');
  
  // Game Scores & Stats
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem('catch_ladybug_best_score');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [isNewHighscore, setIsNewHighscore] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  // Upgrades Configuration (defaults with sound enabled and clean crawl)
  const [upgrades, setUpgrades] = useState<GameUpgrades>(() => {
    const saved = localStorage.getItem('catch_ladybug_upgrades');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      crawl: true,
      speedRamp: true,
      hasBee: false,
      soundEnabled: true,
    };
  });
  const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(false);

  // Ladybug Position & State
  const [bugPos, setBugPos] = useState<Position>({ x: 50, y: 50, rotation: 0 });
  const [isBugPopping, setIsBugPopping] = useState<boolean>(false);

  // Bee Position & State
  const [beePos, setBeePos] = useState<Position>({ x: 25, y: 30, rotation: 0 });
  const [isBeeVisible, setIsBeeVisible] = useState<boolean>(false);

  // Pop Effects (+1, -1 floaters)
  const [popEffects, setPopEffects] = useState<PopEffectItem[]>([]);
  const effectCounter = useRef<number>(0);

  // Milestone Notification (Speed up notification)
  const [milestoneNotice, setMilestoneNotice] = useState<string | null>(null);

  // Crawl velocity reference
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0.4, vy: 0.3 });

  // Helper: Generate safe random spot on screen
  const getRandomSafeSpot = useCallback((currentX?: number, currentY?: number): Position => {
    // Keep away from screen edges & top HUD (x: 14% - 86%, y: 20% - 82%)
    let x = 14 + Math.random() * 72;
    let y = 22 + Math.random() * 60;

    if (currentX !== undefined && currentY !== undefined) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const dist = Math.hypot(x - currentX, y - currentY);
        if (dist > 25) break; // hop is visibly far
        x = 14 + Math.random() * 72;
        y = 22 + Math.random() * 60;
      }
    }

    const angle = Math.floor(Math.random() * 360);
    return { x, y, rotation: angle };
  }, []);

  // Save upgrades when changed
  const handleUpdateUpgrades = (newUpgrades: GameUpgrades) => {
    setUpgrades(newUpgrades);
    localStorage.setItem('catch_ladybug_upgrades', JSON.stringify(newUpgrades));
  };

  // Sound toggle
  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    handleUpdateUpgrades({ ...upgrades, soundEnabled: !muted });
  };

  // Trigger Pop Effect
  const addPopEffect = (x: number, y: number, text: string, type: 'ladybug' | 'bee' | 'milestone') => {
    const id = ++effectCounter.current;
    setPopEffects((prev) => [...prev, { id, x, y, text, type }]);
    setTimeout(() => {
      setPopEffects((prev) => prev.filter((item) => item.id !== id));
    }, 750);
  };

  // Start a new game
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsNewHighscore(false);
    setMilestoneNotice(null);
    setPopEffects([]);
    
    const initialSpot = getRandomSafeSpot();
    setBugPos(initialSpot);
    velocityRef.current = {
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    };

    if (upgrades.hasBee) {
      setBeePos(getRandomSafeSpot(initialSpot.x, initialSpot.y));
      setIsBeeVisible(true);
    } else {
      setIsBeeVisible(false);
    }

    setPhase('PLAYING');
    sound.playPop();
  };

  // Catch Ladybug Handler
  const handleCatchLadybug = () => {
    if (phase !== 'PLAYING' || isBugPopping) return;

    sound.playPop();
    setIsBugPopping(true);

    const newScore = score + 1;
    setScore(newScore);

    // Check if new best score
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem('catch_ladybug_best_score', String(newScore));
      setIsNewHighscore(true);
    }

    // Floating +1 animation
    addPopEffect(bugPos.x, bugPos.y, '+1', 'ladybug');

    // Upgrade: Speed Up Every 5 Points
    if (upgrades.speedRamp && newScore > 0 && newScore % 5 === 0) {
      sound.playMilestone();
      setMilestoneNotice(`Speeding up! (${newScore} caught!) ⚡`);
      setTimeout(() => setMilestoneNotice(null), 1400);
    }

    // Move ladybug to new spot
    setTimeout(() => {
      const nextSpot = getRandomSafeSpot(bugPos.x, bugPos.y);
      setBugPos(nextSpot);
      // Randomize crawl direction
      const speedMultiplier = upgrades.speedRamp ? 1 + Math.min(newScore / 10, 1.5) : 1;
      const angleRad = (nextSpot.rotation * Math.PI) / 180;
      velocityRef.current = {
        vx: Math.cos(angleRad) * 0.5 * speedMultiplier,
        vy: Math.sin(angleRad) * 0.5 * speedMultiplier,
      };
      setIsBugPopping(false);
    }, 180);
  };

  // Tap Bee Hazard Handler
  const handleTapBee = () => {
    if (phase !== 'PLAYING') return;

    sound.playBeeBuzz();
    setScore((prev) => Math.max(0, prev - 1));
    addPopEffect(beePos.x, beePos.y, '-1 Ouch!', 'bee');

    // Relocate bee quickly
    const nextBeeSpot = getRandomSafeSpot(bugPos.x, bugPos.y);
    setBeePos(nextBeeSpot);
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        // Warning tick in last 5 seconds
        if (prev <= 6) {
          sound.playTick(prev <= 3);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Handle Game Over when time runs out
  useEffect(() => {
    if (phase === 'PLAYING' && timeLeft === 0) {
      setPhase('TIME_UP');
      const isHigh = score > 0 && score >= bestScore;
      sound.playRoundEnd(isHigh);

      if (score > 0) {
        // Confetti celebratory burst
        try {
          confetti({
            particleCount: isHigh ? 120 : 60,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#facc15', '#22c55e', '#ffffff'],
          });
        } catch {
          // ignore
        }
      }
    }
  }, [timeLeft, phase, score, bestScore]);

  // Ladybug Crawl Animation Loop
  useEffect(() => {
    if (phase !== 'PLAYING' || !upgrades.crawl) return;

    const crawlInterval = setInterval(() => {
      setBugPos((prev) => {
        let newX = prev.x + velocityRef.current.vx;
        let newY = prev.y + velocityRef.current.vy;
        let newRot = prev.rotation;

        // Bounce smoothly off boundaries
        const minX = 12;
        const maxX = 88;
        const minY = 20;
        const maxY = 82;

        let bounced = false;
        if (newX <= minX || newX >= maxX) {
          velocityRef.current.vx *= -1;
          newX = Math.max(minX, Math.min(maxX, newX));
          bounced = true;
        }
        if (newY <= minY || newY >= maxY) {
          velocityRef.current.vy *= -1;
          newY = Math.max(minY, Math.min(maxY, newY));
          bounced = true;
        }

        if (bounced || Math.random() < 0.05) {
          // Subtle steering
          const angle = Math.atan2(velocityRef.current.vy, velocityRef.current.vx);
          newRot = (angle * 180) / Math.PI + 90;
        }

        return {
          x: newX,
          y: newY,
          rotation: newRot,
        };
      });
    }, 120);

    return () => clearInterval(crawlInterval);
  }, [phase, upgrades.crawl]);

  // Bee wandering effect
  useEffect(() => {
    if (phase !== 'PLAYING' || !upgrades.hasBee) return;

    const beeInterval = setInterval(() => {
      setBeePos((prev) => {
        const next = getRandomSafeSpot(bugPos.x, bugPos.y);
        return {
          x: next.x,
          y: next.y,
          rotation: Math.atan2(next.y - prev.y, next.x - prev.x) * (180 / Math.PI),
        };
      });
    }, 2800);

    return () => clearInterval(beeInterval);
  }, [phase, upgrades.hasBee, bugPos.x, bugPos.y, getRandomSafeSpot]);

  // Autonomous Hop timer for Speed Up upgrade if user doesn't click in time
  useEffect(() => {
    if (phase !== 'PLAYING' || !upgrades.speedRamp) return;

    const hopDelay = Math.max(1600, 3600 - Math.floor(score / 5) * 500);
    const hopTimer = setTimeout(() => {
      if (!isBugPopping) {
        setBugPos((prev) => getRandomSafeSpot(prev.x, prev.y));
      }
    }, hopDelay);

    return () => clearTimeout(hopTimer);
  }, [phase, score, isBugPopping, bugPos, upgrades.speedRamp, getRandomSafeSpot]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-emerald-950 font-['Fredoka'] select-none">
      {/* Soft Green Leafy Garden Background (drawn with pure SVG & CSS) */}
      <GardenBackground />

      {/* Floating Pop Effects */}
      <PopEffect effects={popEffects} />

      {/* ================= TOP HUD HEADER ================= */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 max-w-4xl mx-auto w-full">
        {/* Left: Best Score */}
        <div className="flex items-center gap-2 bg-emerald-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-400/30 shadow-lg text-emerald-100">
          <Trophy className="w-5 h-5 text-amber-300 drop-shadow-xs" />
          <div className="text-xs sm:text-sm font-semibold tracking-wide">
            Best: <span className="text-base sm:text-lg font-black text-amber-300 tabular-nums">{bestScore}</span>
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl border shadow-lg transition-colors ${
            timeLeft <= 5 && phase === 'PLAYING'
              ? 'bg-rose-600/90 text-white border-rose-400 animate-pulse scale-105'
              : 'bg-emerald-800/85 text-emerald-100 border-emerald-400/40 backdrop-blur-md'
          }`}
        >
          <Clock className={`w-5 h-5 ${timeLeft <= 5 && phase === 'PLAYING' ? 'text-white' : 'text-emerald-300'}`} />
          <span className="text-lg sm:text-2xl font-black tabular-nums tracking-wide">
            {timeLeft}s
          </span>
        </div>

        {/* Right: Sound Toggle & Upgrades Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 sm:px-3 sm:py-2 bg-emerald-900/80 hover:bg-emerald-800/90 backdrop-blur-md text-emerald-200 hover:text-white rounded-2xl border border-emerald-400/30 shadow-md transition-transform active:scale-95"
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-stone-400" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
          </button>

          <button
            onClick={() => setIsUpgradesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/80 hover:bg-emerald-800/90 backdrop-blur-md text-emerald-200 hover:text-white rounded-2xl border border-emerald-400/30 shadow-md transition-transform active:scale-95"
            aria-label="Open upgrades and settings"
            title="Upgrades & Modes"
          >
            <Sliders className="w-5 h-5 text-amber-300" />
            <span className="hidden sm:inline text-xs font-bold">Upgrades</span>
          </button>
        </div>
      </header>

      {/* ================= ACTIVE PLAYFIELD ================= */}
      <main className="relative w-full h-[calc(100vh-80px)] z-20">
        {/* Prominent Score Billboard (Always visible during gameplay) */}
        {phase === 'PLAYING' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            <div className="bg-emerald-900/70 backdrop-blur-md px-6 py-2 rounded-3xl border border-emerald-400/40 shadow-xl flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">
                Score
              </span>
              <span className="text-3xl sm:text-4xl font-black text-yellow-300 tabular-nums drop-shadow-md">
                {score}
              </span>
            </div>

            {/* Milestone Banner (Speed up notice) */}
            {milestoneNotice && (
              <div className="mt-2 py-1 px-4 bg-amber-400 text-amber-950 font-black text-sm rounded-full shadow-lg animate-bounce">
                {milestoneNotice}
              </div>
            )}
          </div>
        )}

        {/* Ladybug Actor (Interactive click / tap target) */}
        {phase === 'PLAYING' && (
          <Ladybug
            x={bugPos.x}
            y={bugPos.y}
            rotation={bugPos.rotation}
            isCrawling={upgrades.crawl}
            isPopping={isBugPopping}
            onCatch={handleCatchLadybug}
            size={window.innerWidth < 640 ? 68 : 80}
          />
        )}

        {/* Optional Bee Hazard Actor */}
        {phase === 'PLAYING' && upgrades.hasBee && isBeeVisible && (
          <Bee
            x={beePos.x}
            y={beePos.y}
            onTapBee={handleTapBee}
            size={window.innerWidth < 640 ? 56 : 64}
          />
        )}

        {/* ================= TITLE SCREEN OVERLAY ================= */}
        {phase === 'TITLE' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-emerald-950/90 border-2 border-emerald-400/50 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-emerald-50 flex flex-col items-center">
              {/* Cute Interactive Ladybug Preview */}
              <div
                onClick={() => sound.playPop()}
                className="cursor-pointer mb-2 transform hover:scale-110 active:scale-95 transition-transform"
                title="Tap me!"
              >
                <div className="w-24 h-24 relative mx-auto">
                  <Ladybug
                    x={50}
                    y={50}
                    rotation={-15}
                    isCrawling={false}
                    isPopping={false}
                    onCatch={() => sound.playPop()}
                    size={84}
                  />
                </div>
              </div>

              {/* Title Lockup */}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                Catch the Ladybug
              </h1>

              <p className="mt-2 text-sm sm:text-base text-emerald-200/90 font-medium max-w-xs leading-relaxed">
                Tap the little red ladybug on the leaves before time runs out!
              </p>

              {/* Rules Pill */}
              <div className="mt-4 flex items-center justify-center gap-3 text-xs font-bold text-emerald-300 bg-emerald-900/60 px-4 py-2 rounded-2xl border border-emerald-600/40">
                <span>⏱️ 30 Seconds</span>
                <span>·</span>
                <span>🐞 +1 per Catch</span>
                <span>·</span>
                <span>🏆 High Score</span>
              </div>

              {/* Best Score Display */}
              <div className="mt-4 text-xs font-semibold text-emerald-300/80">
                Your Record: <span className="text-amber-300 font-black text-sm">{bestScore} ladybugs</span>
              </div>

              {/* Big Play CTA Button */}
              <button
                onClick={startGame}
                className="mt-6 w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-emerald-950 text-xl font-black rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current" />
                Start Game
              </button>

              {/* Upgrades Shortcut */}
              <button
                onClick={() => setIsUpgradesOpen(true)}
                className="mt-3 text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors py-1 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Configure Upgrades & Modes
              </button>
            </div>
          </div>
        )}

        {/* ================= TIME'S UP / GAME OVER SCREEN ================= */}
        {phase === 'TIME_UP' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative w-full max-w-md bg-stone-900/95 border-2 border-emerald-500/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-stone-100 flex flex-col items-center">
              {/* Trophy or Star badge */}
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 shadow-inner">
                <Trophy className="w-9 h-9" />
              </div>

              {/* Required Header */}
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Time's up!
              </h2>

              {/* Required Text: "You caught X ladybugs!" */}
              <p className="mt-2 text-lg sm:text-xl font-bold text-emerald-300">
                You caught <span className="text-3xl font-black text-yellow-300 tabular-nums px-1">{score}</span> {score === 1 ? 'ladybug' : 'ladybugs'}!
              </p>

              {/* New High Score Celebratory Banner */}
              {isNewHighscore && score > 0 && (
                <div className="mt-3 px-3 py-1 bg-amber-400 text-amber-950 text-xs font-black rounded-full shadow-md animate-bounce">
                  🎉 NEW BEST RECORD! 🎉
                </div>
              )}

              {/* Score comparison */}
              <div className="mt-5 w-full bg-stone-800/80 rounded-2xl p-3 border border-stone-700/60 flex items-center justify-around text-xs">
                <div>
                  <div className="text-stone-400 font-semibold">Caught</div>
                  <div className="text-xl font-black text-white tabular-nums">{score}</div>
                </div>
                <div className="w-px h-8 bg-stone-700" />
                <div>
                  <div className="text-stone-400 font-semibold">Best Record</div>
                  <div className="text-xl font-black text-amber-300 tabular-nums">{bestScore}</div>
                </div>
              </div>

              {/* Action Buttons: "Play again" */}
              <button
                onClick={startGame}
                className="mt-6 w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-lg font-black rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                Play again
              </button>

              {/* Explore Upgrades */}
              <button
                onClick={() => setIsUpgradesOpen(true)}
                className="mt-3 text-xs font-bold text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors py-1 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                Try Next Upgrade
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Upgrades & Settings Modal */}
      <UpgradesPanel
        isOpen={isUpgradesOpen}
        onClose={() => setIsUpgradesOpen(false)}
        upgrades={upgrades}
        onChangeUpgrades={handleUpdateUpgrades}
        onToggleSound={toggleSound}
      />
    </div>
  );
}
