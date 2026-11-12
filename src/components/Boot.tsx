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
      aria-label="Initializing surveillance network"
      className={`boot-screen boot-screen--${phase}`}
    >
      <div aria-live="polite" className="boot-terminal" role="status">
        <p>&gt; booting surveillance_os v2.4…</p>
        <p className="boot-muted">&gt; handshake: NVR_CORE … OK</p>
        <p className="boot-muted">&gt; handshake: GATE_CONTROL … OK</p>
        <p className="boot-muted">&gt; camera index loaded … 32 nodes found</p>
        <p className="boot-success">operator: SUMIT ANAND</p>
        <p className="boot-success">clearance: GRANTED</p>
        <p>
          &gt; initializing command center
          <span aria-hidden="true" className="terminal-cursor" />
        </p>
      </div>
      <button className="boot-skip" onClick={finish} type="button">
        Skip [Enter]
      </button>
    </div>
  );
}
