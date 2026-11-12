import { Activity, Fingerprint, MapPin, ShieldCheck } from 'lucide-react';
import { profile } from '../data/profile';
import { careerSites } from '../data/experience';
import { SectionHeading } from './SectionHeading';
import { Counter } from '../motion';
import { assetPath } from '../utils/assets';

export function About() {
  return (
    <section aria-labelledby="about-title" className="content-section about-section" id="about">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Security profile"
          id="about-title"
          number="01"
          title="Calm eyes. Clear records."
          tone="cyan"
        />
        <div className="about-layout">
          <div className="identity-panel" data-reveal>
            <img
              alt="Illustrative reference image of a CCTV monitoring station; not a personal photograph"
              className="identity-image"
              decoding="async"
              height="900"
              loading="lazy"
              src={assetPath('assets/sumit-monitoring-station.jpg')}
              width="700"
            />
            <div className="identity-overlay" />
            <div className="identity-label">
              <Fingerprint aria-hidden="true" size={15} /> IDENTITY / OPERATOR
            </div>
            <div className="identity-monogram" aria-hidden="true">
              SA
            </div>
            <div className="identity-details">
              <span className="mono-label">{profile.role}</span>
              <strong>{profile.name}</strong>
              <span>
                <MapPin aria-hidden="true" size={13} /> {profile.location}
              </span>
            </div>
            <div className="identity-status">
              <span aria-hidden="true" className="status-pulse" /> PROFILE / SUMIT ANAND
            </div>
          </div>
          <div className="about-copy" data-reveal>
            <p className="eyebrow-line">// OPERATING PROFILE</p>
            <h3>{profile.aboutHeading}</h3>
            {profile.aboutParagraphs.map((paragraph) => (
              <p className="body-copy" key={paragraph}>
                {paragraph}
              </p>
            ))}
            <div className="about-employers" aria-label="Career sites">
              {careerSites.map((site) => (
                <a className="employer-chip" href="#experience" key={site.id}>
                  <span
                    aria-hidden="true"
                    className={
                      site.status === 'active' ? 'status-pulse' : 'status-pulse status-pulse--muted'
                    }
                  />
                  <span>
                    <strong>{site.client}</strong>
                    <small>
                      {site.name} · {site.period}
                    </small>
                  </span>
                </a>
              ))}
            </div>
            <div className="about-metrics">
              {profile.careerMetrics.map((metric, index) => {
                const MetricIcon = index === 0 ? Activity : index === 1 ? ShieldCheck : Fingerprint;
                return (
                  <div className="about-metric" key={metric.label}>
                    <MetricIcon aria-hidden="true" size={16} />
                    <Counter className="about-metric-value" value={metric.value} />
                    <span className="about-metric-label">{metric.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
