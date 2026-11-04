export type GamePhase = 'TITLE' | 'PLAYING' | 'TIME_UP';

export interface GameUpgrades {
  crawl: boolean;       // Ladybug slowly crawls around
  speedRamp: boolean;   // Ladybug moves faster every 5 points
  hasBee: boolean;      // A bee hazard flies by (-1 point on mistake)
  soundEnabled: boolean;// Sound effects enabled
}

export interface PopEffectItem {
  id: number;
  x: number;
  y: number;
  text: string;
  type: 'ladybug' | 'bee' | 'milestone';
}

export interface Position {
  x: number; // percentage (0-100) or pixel
  y: number; // percentage (0-100) or pixel
  rotation: number; // degrees
}
