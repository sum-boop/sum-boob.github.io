import { ArrowUpRight, Eye, Radio } from 'lucide-react';
import { useRef } from 'react';
import type { DeploymentBriefing } from '../types/portfolio';
import { assetPath } from '../utils/assets';

interface CameraFeedCardProps {
  deployment: DeploymentBriefing;
  index: number;
  onOpen: (deployment: DeploymentBriefing) => void;
}

export function CameraFeedCard({ deployment, index, onOpen }: CameraFeedCardProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const useLocalFallback = () => {
    const image = imageRef.current;
    if (!image || image.dataset.fallback === 'true') return;
    image.dataset.fallback = 'true';
    image.src = assetPath('assets/sumit-monitoring-station.jpg');
  };

  return (
    <button
      aria-label={`Open briefing: ${deployment.title}`}
      className={`feed-card ${index === 0 ? 'feed-card--featured' : ''}`}
      onClick={() => onOpen(deployment)}
      type="button"
    >
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
    </button>
  );
}
