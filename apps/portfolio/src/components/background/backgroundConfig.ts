/**
 * Default background engine configuration.
 * Pages pass shallow partials via `<BackgroundSystem config={{ ... }} />`.
 */

export type BlobColorEntry = {
  color: string;
  className: string;
};

export type DotPatternType = 'grid' | 'diagonal' | 'noise-grid';
export type DotBlendMode = 'multiply' | 'normal';
export type BlobSpeed = 'slow' | 'medium' | 'fast';

/**
 * Hero Wave — grid point surface; all rendering constants are driven from here.
 */
export type WaveConfig = {
  enabled: boolean;

  /** Scales summed sine components → Z displacement */
  amplitude: number;

  frequencyX: number;
  frequencyY: number;

  /** Multiplies `uTime` in shader (continuous flow) */
  speed: number;

  /** Extra height / displacement gain (applied with amplitude) */
  height: number;

  /** sin((x + y) * diagonalFrequency + phase) */
  diagonalFrequency: number;

  colorA: string;
  colorB: string;
  opacity: number;

  mouseLerp: number;
  scrollLerp: number;

  scrollInfluence: number;
  mouseInfluence: number;

  /** Scales Y frequency inside scroll-driven sine */
  scrollSpatialScale: number;

  /** Points per axis (grid resolution) */
  gridSegments: number;
  /** Base gl_PointSize in pixels (before height-based boost) */
  pointSize: number;
  /** Scales how much Z displacement enlarges each point */
  pointDisplacementBoost: number;

  /** Dark wash behind blobs (visible between points) */
  backdropTop: string;
  backdropMid: string;
  backdropBottom: string;

  /** Multiplier on dot layer opacity while wave is active */
  dotOpacityScaleWhenWave: number;

  /** Fragment: peak highlight strength */
  peakEmphasis: number;
  /** Fragment: valley darkening (0–1, higher = darker valleys) */
  valleyDepth: number;
  /** Fragment: neon tint vs background blend */
  surfaceVibrance: number;
};

export type DottedSurfaceSettings = {
  separation: number;
  amountX: number;
  amountY: number;
  speed: number;
  height: number;
  colorLight: string;
  colorDark: string;
};

export type BackgroundConfig = {
  enableDottedSurface: boolean;
  enableParallax: boolean;
  enableGlow: boolean;
  enableNoise: boolean;
  enableBlurBlobs: boolean;
  enableSectionDepth: boolean;

  dotColor: string;
  dotSize: number;
  dotSpacing: number;
  dotOpacity: number;
  dotParallaxStrength: number;
  dotDirectionX: number;
  dotDirectionY: number;
  dotPatternType: DotPatternType;
  dotBlendMode: DotBlendMode;

  backgroundTopColor: string;
  backgroundMidColor: string;
  backgroundBottomColor: string;

  glowStrength: number;
  glowColors: [string, string];
  glowFollowSpeed: number;

  blobIntensity: number;
  blobSpeed: BlobSpeed;
  blobColors: [BlobColorEntry, BlobColorEntry, BlobColorEntry];

  noiseOpacity: number;

  depthStrength: number;

  wave: WaveConfig;

  dottedSurface: DottedSurfaceSettings;
};

export const DEFAULT_WAVE_CONFIG: WaveConfig = {
  enabled: true,

  amplitude: 0.11,
  frequencyX: 12.0,
  frequencyY: 14.5,
  speed: 1.15,
  height: 1.0,

  diagonalFrequency: 0.6,

  colorA: 'rgb(120, 200, 255)',
  colorB: 'rgb(180, 120, 255)',

  opacity: 0.92,

  mouseLerp: 0.045,
  scrollLerp: 0.085,

  scrollInfluence: 0.55,
  mouseInfluence: 0.22,

  scrollSpatialScale: 0.5,

  gridSegments: 140,
  pointSize: 2.35,
  pointDisplacementBoost: 14.0,

  backdropTop: '#000000',
  backdropMid: '#050508',
  backdropBottom: '#0c0c12',

  dotOpacityScaleWhenWave: 0.07,

  peakEmphasis: 1.55,
  valleyDepth: 0.62,
  surfaceVibrance: 0.88,
};

export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  enableDottedSurface: true,
  enableParallax: true,
  enableGlow: true,
  enableNoise: true,
  enableBlurBlobs: true,
  enableSectionDepth: true,

  dotColor: 'rgba(15, 23, 42, 0.35)',
  dotSize: 1.6,
  dotSpacing: 20,
  dotOpacity: 0.28,
  dotParallaxStrength: 44,
  dotDirectionX: 0,
  dotDirectionY: 1,
  dotPatternType: 'grid',
  dotBlendMode: 'multiply',

  backgroundTopColor: '#000000',
  backgroundMidColor: '#06060a',
  backgroundBottomColor: '#0e0e14',

  glowStrength: 0.2,
  glowColors: ['rgba(56, 189, 248, 0.35)', 'rgba(99, 102, 241, 0.22)'],
  glowFollowSpeed: 0.06,

  blobIntensity: 1,
  blobSpeed: 'slow',
  blobColors: [
    {
      color: 'rgb(56, 189, 248)',
      className:
        'absolute left-1/2 top-[8%] h-[min(95vw,36rem)] w-[min(95vw,36rem)] -translate-x-1/2 rounded-full blur-[120px] md:blur-[140px]',
    },
    {
      color: 'rgb(99, 102, 241)',
      className:
        'absolute -bottom-[20%] -right-[15%] h-[min(85vw,30rem)] w-[min(85vw,30rem)] rounded-full blur-[130px] md:blur-[150px]',
    },
    {
      color: 'rgb(148, 163, 184)',
      className:
        'absolute bottom-[20%] left-[-12%] h-[min(70vw,24rem)] w-[min(70vw,24rem)] rounded-full blur-[110px] md:blur-[130px]',
    },
  ],

  noiseOpacity: 0.06,
  depthStrength: 1.15,

  wave: { ...DEFAULT_WAVE_CONFIG },

  dottedSurface: {
    separation: 64,
    amountX: 52,
    amountY: 36,
    speed: 0.065,
    height: 52,
    colorLight: '#0f172a',
    colorDark: '#f8fafc',
  },
};

export const BACKGROUND_PRESETS: Record<string, Partial<BackgroundConfig>> = {
  home: {
    enableDottedSurface: true,
    dotOpacity: 0.38,
    blobIntensity: 1.1,
    depthStrength: 1.25,
    glowStrength: 0.26,
    backgroundMidColor: '#08080c',

    wave: {
      ...DEFAULT_WAVE_CONFIG,
      amplitude: 0.125,
      speed: 1.22,
      frequencyX: 13,
      frequencyY: 15,
      opacity: 0.95,
      peakEmphasis: 1.65,
      surfaceVibrance: 0.92,
    },
  },

  projects: {
    enableDottedSurface: true,
    dotOpacity: 0.22,
    blobIntensity: 0.75,
    depthStrength: 0.7,
    enableSectionDepth: false,
    glowStrength: 0.14,
    backgroundMidColor: '#07070b',

    wave: {
      ...DEFAULT_WAVE_CONFIG,
      amplitude: 0.075,
      speed: 0.95,
      frequencyX: 10,
      frequencyY: 12,
      opacity: 0.82,
      mouseInfluence: 0.14,
      scrollInfluence: 0.38,
      dotOpacityScaleWhenWave: 0.05,
    },
  },

  about: {
    enableDottedSurface: true,
    dotOpacity: 0.25,
    blobIntensity: 0.65,
    depthStrength: 0.6,
    glowStrength: 0.12,
    backgroundBottomColor: '#101018',

    wave: {
      ...DEFAULT_WAVE_CONFIG,
      amplitude: 0.095,
      speed: 1.05,
      opacity: 0.88,
      colorA: 'rgb(110, 210, 245)',
      colorB: 'rgb(160, 130, 255)',
    },
  },
};

export function mergeBackgroundConfig(
  partial: Partial<BackgroundConfig> = {}
): BackgroundConfig {
  const wave: WaveConfig = partial.wave
    ? { ...DEFAULT_BACKGROUND_CONFIG.wave, ...partial.wave }
    : { ...DEFAULT_BACKGROUND_CONFIG.wave };

  const dottedSurface: DottedSurfaceSettings = partial.dottedSurface
    ? { ...DEFAULT_BACKGROUND_CONFIG.dottedSurface, ...partial.dottedSurface }
    : { ...DEFAULT_BACKGROUND_CONFIG.dottedSurface };

  return {
    ...DEFAULT_BACKGROUND_CONFIG,
    ...partial,
    wave,
    dottedSurface,
  };
}
