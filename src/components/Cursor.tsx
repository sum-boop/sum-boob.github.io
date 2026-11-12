import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motionSprings } from '../motion/tokens';
import { useIsTouch } from '../motion/useIsTouch';

const TARGET_SELECTOR = "a, button, [role='button'], input, textarea, select";

export function Cursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();
  const [cursorTarget, setCursorTarget] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, motionSprings.snappy);
  const springY = useSpring(y, motionSprings.snappy);

  useEffect(() => {
    if (!finePointer || isTouch || reducedMotion) return;

    document.body.classList.add('custom-cursor-enabled');
    const onPointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const onPointerOver = (event: PointerEvent) => {
      setCursorTarget(
        event.target instanceof Element && Boolean(event.target.closest(TARGET_SELECTOR)),
      );
    };
    const onPointerOut = (event: PointerEvent) => {
      const relatedTarget = event.relatedTarget;
      setCursorTarget(
        relatedTarget instanceof Element && Boolean(relatedTarget.closest(TARGET_SELECTOR)),
      );
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [finePointer, isTouch, reducedMotion, x, y]);

  if (!finePointer || isTouch || reducedMotion) return null;
  return (
    <m.div
      aria-hidden="true"
      animate={{ scale: cursorTarget ? 1.5 : 1 }}
      className={`cursor-reticle${cursorTarget ? ' cursor-target' : ''}`}
      initial={false}
      style={{ x: springX, y: springY }}
      transition={motionSprings.snappy}
    />
  );
}
