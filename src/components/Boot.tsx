import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motionDurations, motionEasings } from '../motion/tokens';

export function Boot() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => !reducedMotion);
  const finish = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (reducedMotion || !visible) return;

    const autoDismiss = window.setTimeout(finish, 780);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(autoDismiss);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [finish, reducedMotion, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          aria-label="Loading Sumit Anand's portfolio"
          className="boot-screen"
          exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          initial={{ opacity: 1 }}
          transition={{ duration: motionDurations.micro, ease: motionEasings.out }}
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
          <m.button className="boot-skip" onClick={finish} type="button" whileTap={{ scale: 0.97 }}>
            Skip [Enter]
          </m.button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
