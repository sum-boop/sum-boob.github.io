import { useEffect, useRef, type RefObject } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';

export function useMagnetic<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !finePointer || reducedMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.08;
      const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.08;
      element.style.setProperty('--magnetic-x', `${offsetX.toFixed(1)}px`);
      element.style.setProperty('--magnetic-y', `${offsetY.toFixed(1)}px`);
    };

    const reset = () => {
      element.style.setProperty('--magnetic-x', '0px');
      element.style.setProperty('--magnetic-y', '0px');
    };

    element.addEventListener('pointermove', onPointerMove, { passive: true });
    element.addEventListener('pointerleave', reset, { passive: true });
    return () => {
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [finePointer, reducedMotion]);

  return ref;
}
