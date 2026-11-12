import type { Variants } from 'framer-motion';
import { motionDurations, motionEasings, motionOffsets, motionStaggers } from './tokens';

export const heroStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: motionStaggers.listDelay,
      staggerChildren: motionStaggers.hero,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: motionStaggers.listDelay,
      staggerChildren: motionStaggers.list,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: motionOffsets.reveal },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.base, ease: motionEasings.out },
  },
};

export const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: motionOffsets.hero },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.slow, ease: motionEasings.emphasized },
  },
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: motionOffsets.reveal },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.base, ease: motionEasings.out },
  },
};

export const drawerVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.fast, ease: motionEasings.inOut },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: motionDurations.micro, ease: motionEasings.inOut },
  },
};

export const drawerLinkVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: motionDurations.fast,
      delay: index * 0.05,
      ease: motionEasings.out,
    },
  }),
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: motionDurations.base, ease: motionEasings.out },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    transition: { duration: motionDurations.fast, ease: motionEasings.inOut },
  },
};

export const arrowShiftVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 4, transition: { duration: motionDurations.fast, ease: motionEasings.out } },
};
