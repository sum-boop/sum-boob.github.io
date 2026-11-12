import type { Variants } from 'framer-motion';

export const motionDurations = {
  micro: 0.18,
  reveal: 0.58,
  hero: 0.52,
  counter: 0.9,
  scan: 8.5,
} as const;

export const motionEasings = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  linear: 'linear' as const,
};

export const motionSprings = {
  magnetic: { stiffness: 220, damping: 24, mass: 0.55 },
  cursor: { stiffness: 520, damping: 44, mass: 0.18 },
  tilt: { stiffness: 240, damping: 24, mass: 0.5 },
} as const;

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.075,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 1, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.hero, ease: motionEasings.out },
  },
};
