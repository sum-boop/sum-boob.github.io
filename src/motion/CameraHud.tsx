import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, type RefObject } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motionDurations, motionEasings, motionSprings } from './tokens';
import { useIsTouch } from './useIsTouch';

interface CameraHudProps {
  containerRef: RefObject<HTMLElement>;
}

export function CameraHud({ containerRef }: CameraHudProps) {
  const isTouch = useIsTouch();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, motionSprings.cursor);
  const springY = useSpring(y, motionSprings.cursor);
  const interactive = finePointer && !isTouch && !prefersReducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !interactive) return;

    const mediaLayer = container.querySelector<HTMLElement>('.hero-media-layer');
    if (!mediaLayer) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const bounds = mediaLayer.getBoundingClientRect();
      const insideFeed =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (!insideFeed) {
        x.set(-100);
        y.set(-100);
        return;
      }
      x.set(event.clientX - bounds.left);
      y.set(event.clientY - bounds.top);
    };
    const onPointerLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    return () => {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [containerRef, interactive, x, y]);

  return (
    <div aria-hidden="true" className="camera-hud">
      {interactive ? (
        <m.span className="camera-hud-position" style={{ x: springX, y: springY }}>
          <span className="camera-hud-target" />
        </m.span>
      ) : null}
      <m.span
        animate={
          interactive ? { y: ['-24vh', '28vh'], opacity: [0, 0.68, 0] } : { y: 0, opacity: 0.15 }
        }
        className="hero-media-scan"
        {...(interactive
          ? {
              transition: {
                duration: motionDurations.scan,
                repeat: Infinity,
                ease: motionEasings.linear,
              },
            }
          : {})}
      />
      <m.span
        animate={interactive ? { opacity: [0.48, 0.82, 0.48] } : { opacity: 0.5 }}
        className="hero-detection-box hero-detection-box--one"
        {...(interactive
          ? { transition: { duration: 4.6, repeat: Infinity, ease: motionEasings.linear } }
          : {})}
      >
        <span>ZONE / 01</span>
      </m.span>
      <m.span
        animate={interactive ? { opacity: [0.38, 0.72, 0.38] } : { opacity: 0.42 }}
        className="hero-detection-box hero-detection-box--two"
        {...(interactive
          ? {
              transition: {
                duration: 5.4,
                repeat: Infinity,
                ease: motionEasings.linear,
                delay: -1.6,
              },
            }
          : {})}
      >
        <span>ZONE / 02</span>
      </m.span>
    </div>
  );
}
