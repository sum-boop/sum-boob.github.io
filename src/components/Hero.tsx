import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import { profile } from '../data/profile';
import { useClock } from '../hooks/useClock';
import {
  CameraHud,
  Counter,
  Magnetic,
  Parallax,
  SplitText,
  StaggerGroup,
  staggerItemVariants,
} from '../motion';
import { motionDurations, motionEasings, motionSprings } from '../motion/tokens';
import { BackgroundVideo } from './BackgroundVideo';

interface HeroProps {
  onHire: () => void;
}

export function Hero({ onHire }: HeroProps) {
  const clock = useClock();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const titleSkew = useTransform(scrollYProgress, [0, 0.8], [0, -0.7]);
  const heroHeadline = `${profile.name} — eyes on every hub.`;

  return (
    <section aria-labelledby="hero-title" className="hero-section" id="hero" ref={heroRef}>
      <Parallax className="hero-atmosphere" depth={15} scale={0.01}>
        <span aria-hidden="true" className="hero-orb hero-orb--cyan" />
        <span aria-hidden="true" className="hero-orb hero-orb--violet" />
        <span aria-hidden="true" className="hero-orb hero-orb--lime" />
        <span aria-hidden="true" className="hero-grid" />
      </Parallax>
      <div className="hero-layout">
        <StaggerGroup className="hero-copy">
          <m.p className="hero-kicker" variants={staggerItemVariants}>
            <span className="kicker-mark">SA /</span> CCTV OPERATIONS · PROFESSIONAL PORTFOLIO
          </m.p>
          <m.div className="hero-status-line" variants={staggerItemVariants}>
            <span aria-hidden="true" className="status-pulse" />
            <span>System online</span>
            <span className="status-divider">/</span>
            <span>{profile.location}</span>
          </m.div>
          <m.h1
            aria-label={heroHeadline}
            className="hero-title"
            id="hero-title"
            style={{ skewX: titleSkew }}
            variants={staggerItemVariants}
          >
            <SplitText text={profile.name} />
            <span className="hero-title-accent">
              <SplitText delay={motionDurations.micro} text="— eyes on every hub." />
            </span>
          </m.h1>
          <m.p className="hero-role" variants={staggerItemVariants}>
            {profile.role}
          </m.p>
          <m.p className="hero-summary" variants={staggerItemVariants}>
            {profile.heroSummary}
          </m.p>
          <m.div className="hero-actions" variants={staggerItemVariants}>
            <Magnetic>
              <m.button
                className="button button--primary magnetic-button"
                onClick={onHire}
                type="button"
                transition={motionSprings.magnetic}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <ShieldCheck aria-hidden="true" size={17} />
                Discuss an Opportunity
                <ArrowRight aria-hidden="true" size={16} />
              </m.button>
            </Magnetic>
            <m.a
              className="button button--quiet"
              href="#operations"
              transition={{ duration: motionDurations.micro, ease: motionEasings.out }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Eye aria-hidden="true" size={17} />
              View Deployments
            </m.a>
          </m.div>
          <m.div
            aria-label="Professional profile readout"
            className="hero-readout"
            role="group"
            variants={staggerItemVariants}
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
                  <Counter className="hero-metric-value" value={metric.value} />
                  <span className="hero-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
            <div aria-label="Professional focus" className="hero-meta">
              {profile.metadata.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </m.div>
        </StaggerGroup>

        <Parallax className="hero-media-layer" depth={19} scale={0.012}>
          <div
            aria-label="Illustrative surveillance visual; not footage from a client site"
            className="hero-media-content"
            role="img"
          >
            <BackgroundVideo
              className="hero-background-video"
              poster="assets/sumit-monitoring-station.jpg"
              src="assets/hero-feed.mp4"
            />
            <div aria-hidden="true" className="hero-media-vignette" />
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
          <CameraHud containerRef={heroRef} />
        </Parallax>
      </div>
      <a aria-label="Scroll to expertise" className="hero-scroll" href="#about">
        <span>Scroll to explore</span>
        <ArrowDownRight aria-hidden="true" size={15} />
      </a>
    </section>
  );
}
