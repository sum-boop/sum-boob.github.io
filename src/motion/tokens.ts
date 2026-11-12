export const motionDurations = {
  micro: 0.15,
  fast: 0.24,
  base: 0.5,
  slow: 0.8,
} as const;

export const motionEasings = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  emphasized: [0.16, 1, 0.3, 1] as [number, number, number, number],
  linear: 'linear' as const,
};

export const motionOffsets = {
  reveal: 24,
  hero: 32,
  hoverLift: -4,
  pressScale: 0.97,
} as const;

export const motionStaggers = {
  list: 0.08,
  words: 0.06,
  hero: 0.1,
  drawer: 0.05,
  listDelay: 0.05,
} as const;

export const motionSprings = {
  snappy: { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 },
  soft: { type: 'spring', stiffness: 220, damping: 26 },
} as const;
