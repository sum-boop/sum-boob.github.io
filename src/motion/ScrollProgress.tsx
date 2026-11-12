import { m, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useState } from 'react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.22,
    restDelta: 0.001,
  });
  const [progressPercent, setProgressPercent] = useState(0);

  useMotionValueEvent(progress, 'change', (value) => {
    setProgressPercent(Math.round(value * 100));
  });

  return (
    <div
      aria-label="Scroll progress"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={progressPercent}
      className="scroll-progress"
      role="progressbar"
    >
      <m.span style={{ scaleX: progress, transformOrigin: 'left center' }} />
    </div>
  );
}
