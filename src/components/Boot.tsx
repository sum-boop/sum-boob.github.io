import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function Boot() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'active' | 'leaving' | 'done'>(() =>
    reducedMotion ? 'done' : 'active',
  );
  const exitTimer = useRef<number | null>(null);
  const finish = useCallback(() => {
    setPhase('leaving');
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => setPhase('done'), 180);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const autoDismiss = window.setTimeout(finish, 780);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(autoDismiss);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [finish, reducedMotion]);

  if (phase === 'done') return null;

  return (
    <div
      aria-label="Loading Sumit Anand's portfolio"
      className={`boot-screen boot-screen--${phase}`}
    >
      <div aria-live="polite" className="boot-terminal" role="status">
        <p>&gt; loading professional profile…</p>
        <p className="boot-muted">&gt; role: CCTV operator</p>
        <p className="boot-muted">&gt; base: Haryana, India</p>
        <p className="boot-success">SUMIT ANAND</p>
        <p>
          &gt; profile ready
          <span aria-hidden="true" className="terminal-cursor" />
        </p>
      </div>
      <button className="boot-skip" onClick={finish} type="button">
        Skip [Enter]
      </button>
    </div>
  );
}
