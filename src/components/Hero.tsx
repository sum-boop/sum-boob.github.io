import { ArrowDownRight, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import { profile } from '../data/profile';
import { useClock } from '../hooks/useClock';
import { useMagnetic } from '../hooks/useMagnetic';
import { BackgroundVideo } from './BackgroundVideo';

interface HeroProps {
  onHire: () => void;
}

export function Hero({ onHire }: HeroProps) {
  const clock = useClock();
  const requestButtonRef = useMagnetic<HTMLButtonElement>();

  return (
    <section aria-labelledby="hero-title" className="hero-section" id="hero">
      <div aria-hidden="true" className="hero-atmosphere">
        <span className="hero-orb hero-orb--cyan" />
        <span className="hero-orb hero-orb--violet" />
        <span className="hero-orb hero-orb--lime" />
        <span className="hero-grid" />
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="kicker-mark">SA /</span> CCTV OPERATIONS · PROFESSIONAL PORTFOLIO
          </p>
          <div className="hero-status-line">
            <span aria-hidden="true" className="status-pulse" />
            <span>System online</span>
            <span className="status-divider">/</span>
            <span>{profile.location}</span>
          </div>
          <h1 className="hero-title" data-reveal id="hero-title">
            {profile.name} <span>— eyes on every hub.</span>
          </h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-summary">{profile.heroSummary}</p>
          <div className="hero-actions">
            <button
              className="button button--primary magnetic-button"
              onClick={onHire}
              ref={requestButtonRef}
              type="button"
            >
              <ShieldCheck aria-hidden="true" size={17} />
              Discuss an Opportunity
              <ArrowRight aria-hidden="true" size={16} />
            </button>
            <a className="button button--quiet" href="#operations">
              <Eye aria-hidden="true" size={17} />
              View Deployments
            </a>
          </div>
          <div
            aria-label="Professional profile readout"
            className="hero-readout"
            data-reveal
            role="group"
          >
            <div className="hero-readout-head">
              <span className="hero-readout-signal">
                <span aria-hidden="true" className="hero-readout-led" />
                OPERATOR PROFILE
              </span>
              <span className="hero-readout-index">READOUT / 01</span>
            </div>
            <div aria-label="Career highlights" className="hero-metrics">
              {profile.heroMetrics.map((metric) => (
                <div className="hero-metric" key={metric.label}>
                  <span className="hero-metric-value">{metric.value}</span>
                  <span className="hero-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
            <div aria-label="Professional focus" className="hero-meta">
              {profile.metadata.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div
          aria-label="Illustrative surveillance visual; not footage from a client site"
          className="hero-media-layer"
          role="img"
        >
          <BackgroundVideo
            className="hero-background-video"
            poster="assets/sumit-monitoring-station.jpg"
            src="assets/hero-feed.mp4"
          />
          <div aria-hidden="true" className="hero-media-vignette" />
          <div aria-hidden="true" className="hero-media-scan" />
          <div aria-hidden="true" className="hero-media-raster" />
          <div aria-hidden="true" className="hero-media-frame" />
          <div aria-hidden="true" className="hero-media-readout">
            <span className="hero-media-readout-label">
              <span className="hero-media-led" /> REFERENCE VISUAL / 01
            </span>
            <span className="hero-media-readout-note">ILLUSTRATIVE FEED</span>
            <time>{clock}</time>
          </div>
        </div>
      </div>
      <a aria-label="Scroll to expertise" className="hero-scroll" href="#about">
        <span>Scroll to explore</span>
        <ArrowDownRight aria-hidden="true" size={15} />
      </a>
    </section>
  );
}
