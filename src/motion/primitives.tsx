import {
  animate,
  m,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type PropsWithChildren,
} from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motionDurations, motionEasings, motionSprings } from './tokens';
import {
  heroStaggerVariants,
  revealVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from './variants';
import { useIsTouch } from './useIsTouch';

export type RevealDirection = 'up' | 'left' | 'right';

interface RevealProps extends PropsWithChildren {
  className?: string;
  direction?: RevealDirection;
}

export function Reveal({ children, className, direction = 'up' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.985, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.996, 1]);
  const reduce = isTouch || prefersReducedMotion;
  const initial = reduce
    ? { x: 0, y: 0 }
    : direction === 'left'
      ? { x: -18, y: 0 }
      : direction === 'right'
        ? { x: 18, y: 0 }
        : { x: 0, y: 16 };

  return (
    <m.div
      className={className ? `motion-reveal ${className}` : 'motion-reveal'}
      initial={initial}
      ref={ref}
      {...(!reduce ? { style: { opacity, scale } } : {})}
      whileInView={{ x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduce ? 0.24 : motionDurations.base, ease: motionEasings.out }}
    >
      {children}
    </m.div>
  );
}

interface StaggerGroupProps extends PropsWithChildren {
  className?: string;
}

export function StaggerGroup({ children, className }: StaggerGroupProps) {
  return (
    <m.div
      animate="visible"
      className={className ?? ''}
      initial="hidden"
      variants={staggerContainerVariants}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: StaggerGroupProps) {
  return (
    <m.div className={className ?? ''} variants={staggerItemVariants}>
      {children}
    </m.div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <span aria-hidden="true" className={className ? `split-text ${className}` : 'split-text'}>
      {words.map((word, index) => (
        <span className="split-word-mask" key={`${word}-${index}`}>
          <m.span
            animate={{ opacity: 1, y: 0 }}
            className="split-word"
            initial={prefersReducedMotion ? false : { opacity: 1, y: 8 }}
            transition={{
              duration: motionDurations.slow,
              delay: delay + index * 0.055,
              ease: motionEasings.out,
            }}
          >
            {word}
          </m.span>
        </span>
      ))}
    </span>
  );
}

interface CounterProps {
  value: string;
  className?: string;
}

export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const match = /^(\d+)([+%]?)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const suffix = match?.[2] ?? '';
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView || prefersReducedMotion || target === null) return;

    const controls = animate(0, target, {
      duration: motionDurations.slow,
      ease: motionEasings.out,
      onUpdate: (latest) => setDisplayValue(`${Math.round(latest)}${suffix}`),
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion, suffix, target]);

  return (
    <m.span
      className={className ?? ''}
      initial={prefersReducedMotion ? false : { opacity: 1, y: 6 }}
      ref={ref}
      transition={{ duration: motionDurations.base, ease: motionEasings.out }}
      viewport={{ once: true, amount: 0.15 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {displayValue}
    </m.span>
  );
}

interface ParallaxProps extends PropsWithChildren {
  className?: string;
  depth?: number;
  scale?: number;
}

export function Parallax({ children, className, depth = 18, scale = 0.015 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-depth, depth]);
  const scaleValue = useTransform(scrollYProgress, [0, 1], [1 + scale, 1 - scale]);
  const reduce = isTouch || prefersReducedMotion;

  return (
    <m.div
      className={className ?? ''}
      ref={ref}
      {...(!reduce ? { style: { y, scale: scaleValue } } : {})}
    >
      {children}
    </m.div>
  );
}

interface MagneticProps extends PropsWithChildren {
  className?: string;
}

export function Magnetic({ children, className }: MagneticProps) {
  const isTouch = useIsTouch();
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, motionSprings.magnetic);
  const springY = useSpring(y, motionSprings.magnetic);
  const enabled = !isTouch && !prefersReducedMotion;

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.08);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.08);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      className={className ? `magnetic-wrap ${className}` : 'magnetic-wrap'}
      onPointerLeave={reset}
      onPointerMove={onPointerMove}
      {...(enabled ? { style: { x: springX, y: springY } } : {})}
    >
      {children}
    </m.div>
  );
}

interface MarqueeProps {
  items: readonly string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  const isTouch = useIsTouch();
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const cycleWidth = useRef(0);
  const offset = useRef(0);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const velocitySpeed = useTransform(scrollVelocity, [-1400, 0, 1400], [88, -38, -112]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      cycleWidth.current = track.scrollWidth / 2;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    measure();

    if (isTouch || prefersReducedMotion) return () => observer.disconnect();

    let frame = 0;
    let previousTime = 0;
    const tick = (time: number) => {
      const delta = previousTime === 0 ? 0 : time - previousTime;
      previousTime = time;
      const width = cycleWidth.current;
      if (width > 0 && delta > 0) {
        let nextOffset = offset.current + (velocitySpeed.get() * delta) / 1000;
        if (nextOffset <= -width) nextOffset += width;
        if (nextOffset > 0) nextOffset -= width;
        offset.current = nextOffset;
        x.set(nextOffset);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [isTouch, items, prefersReducedMotion, velocitySpeed, x]);

  const repeatedItems = [...items, ...items];

  return (
    <m.div className={className ?? ''} ref={trackRef} style={{ x }}>
      {repeatedItems.map((item, index) => (
        <span aria-hidden={index >= items.length} key={`${item}-${index}`}>
          {item}
          <i aria-hidden="true" />
        </span>
      ))}
    </m.div>
  );
}

export function PageTransition({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <m.div
      animate={{ opacity: 1, y: 0 }}
      className={className ? `page-transition ${className}` : 'page-transition'}
      initial={{ opacity: 1, y: 10 }}
      transition={{ duration: motionDurations.slow, ease: motionEasings.out }}
    >
      {children}
    </m.div>
  );
}
