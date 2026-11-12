import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TARGET_SELECTOR = "a, button, [role='button'], input, textarea, select";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !finePointer || reducedMotion) return;

    document.body.classList.add('custom-cursor-enabled');
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      });
    };
    const onPointerOver = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(TARGET_SELECTOR)) {
        cursor.classList.add('cursor-target');
      }
    };
    const onPointerOut = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(TARGET_SELECTOR)) {
        cursor.classList.remove('cursor-target');
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;
  return <div aria-hidden="true" className="cursor-reticle" ref={cursorRef} />;
}
