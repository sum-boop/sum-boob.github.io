import { m, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Eye, Radio } from 'lucide-react';
import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { motionSprings } from '../motion/config';
import { useIsTouch } from '../motion/useIsTouch';
import type { DeploymentBriefing } from '../types/portfolio';
import { assetPath } from '../utils/assets';

interface CameraFeedCardProps {
  deployment: DeploymentBriefing;
  index: number;
  onOpen: (deployment: DeploymentBriefing) => void;
}

export function CameraFeedCard({ deployment, index, onOpen }: CameraFeedCardProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const isTouch = useIsTouch();
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(-200);
  const glareY = useMotionValue(-200);
  const springRotateX = useSpring(rotateX, motionSprings.tilt);
  const springRotateY = useSpring(rotateY, motionSprings.tilt);
  const enabled = !isTouch && !prefersReducedMotion;
  const useLocalFallback = () => {
    const image = imageRef.current;
    if (!image || image.dataset.fallback === 'true') return;
    image.dataset.fallback = 'true';
    image.src = assetPath('assets/sumit-monitoring-station.jpg');
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!enabled || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(normalizedY * -7);
    rotateY.set(normalizedX * 8);
    glareX.set(event.clientX - bounds.left - 75);
    glareY.set(event.clientY - bounds.top - 75);
  };
  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(-200);
    glareY.set(-200);
  };

  return (
    <m.button
      aria-label={`Open briefing: ${deployment.title}`}
      className={`feed-card ${index === 0 ? 'feed-card--featured' : ''}`}
      onClick={() => onOpen(deployment)}
      onPointerLeave={resetTilt}
      onPointerMove={handlePointerMove}
      transition={motionSprings.tilt}
      type="button"
      {...(enabled
        ? {
            style: { rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 900 },
            whileHover: { y: -4 },
          }
        : {})}
      {...(!prefersReducedMotion ? { whileTap: { scale: 0.99 } } : {})}
    >
      <m.span aria-hidden="true" className="feed-card-glare" style={{ x: glareX, y: glareY }} />
      <span className="feed-image-wrap">
        <img
          alt={deployment.imageAlt}
          className="feed-image"
          decoding="async"
          height="600"
          loading="lazy"
          onError={useLocalFallback}
          ref={imageRef}
          src={deployment.cardImage}
          width="900"
        />
        <span className="feed-image-overlay" />
        <span className="feed-image-label">
          <Radio aria-hidden="true" size={13} /> ILLUSTRATIVE VISUAL
        </span>
        <span aria-hidden="true" className="feed-frame" />
      </span>
      <span className="feed-card-content">
        <span className="feed-card-topline">
          <span>DEPLOYMENT / 0{index + 1}</span>
          <span>{deployment.cardPeriod}</span>
        </span>
        <span className="feed-card-title-row">
          <span className="feed-card-title">{deployment.cardTitle}</span>
          <ArrowUpRight aria-hidden="true" className="feed-card-arrow" size={18} />
        </span>
        <span className="feed-card-meta">
          <span>
            SITE:{' '}
            {deployment.site === 'Flipkart Kalash Mega Hub' ? 'FLIPKART KALASH' : 'EKART LOGISTICS'}
          </span>
          <span>CAMERAS: {deployment.cardCameras}</span>
        </span>
        <span className="feed-card-description">{deployment.cardDescription}</span>
        <span className="feed-card-footer">
          {deployment.cardMetric ? (
            <span className="feed-card-metric">{deployment.cardMetric}</span>
          ) : (
            <span className="feed-card-category">{deployment.category}</span>
          )}
          <span className="feed-open">
            <Eye aria-hidden="true" size={14} /> Expand briefing
          </span>
        </span>
      </span>
    </m.button>
  );
}
