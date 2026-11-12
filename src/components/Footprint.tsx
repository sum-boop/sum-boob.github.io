import { useState } from 'react';
import { ArrowUpRight, Crosshair, MapPin, Radio, Satellite } from 'lucide-react';
import { careerSites } from '../data/experience';
import { profile } from '../data/profile';
import { contact } from '../data/contact';
import { assetPath } from '../utils/assets';
import { NetworkMap } from './NetworkMap';
import { SectionHeading } from './SectionHeading';

export function Footprint() {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <section
      aria-labelledby="footprint-title"
      className="content-section footprint-section"
      id="footprint"
    >
      <div className="section-inner">
        <SectionHeading
          description="One operator base. Two logistics deployments. A clear line between the map and the work."
          eyebrow="Deployment footprint"
          id="footprint-title"
          number="03"
          title="Where I watch from."
          tone="lime"
        />
        <div className="footprint-layout">
          <div className="footprint-map" data-reveal>
            <video
              aria-hidden="true"
              autoPlay
              className="footprint-video"
              loop
              muted
              playsInline
              poster={assetPath('assets/og-cover.jpg')}
            >
              <source src={assetPath('assets/earth-globe.mp4')} type="video/mp4" />
            </video>
            <div aria-hidden="true" className="footprint-map-overlay" />
            <div className="footprint-map-top">
              <span>
                <Satellite size={15} /> OPERATOR POSITION
              </span>
              <span>INDIA / HR</span>
            </div>
            <div aria-hidden="true" className="footprint-marker">
              <Crosshair size={17} />
            </div>
            <div className="footprint-map-bottom">
              <span>
                <MapPin aria-hidden="true" size={14} /> PATLI, HARYANA, INDIA
              </span>
              <button
                aria-controls="footprint-details"
                aria-expanded={detailsOpen}
                onClick={() => setDetailsOpen((open) => !open)}
                type="button"
              >
                {detailsOpen ? 'Close details' : 'Locate operator'}
                <ArrowUpRight aria-hidden="true" size={14} />
              </button>
            </div>
            {detailsOpen ? (
              <div className="footprint-details" id="footprint-details">
                <div className="footprint-details-heading">
                  <span className="status-pulse" /> OPERATOR LOCATED
                </div>
                <strong>{profile.name}</strong>
                <div className="footprint-readouts">
                  <span>
                    <small>ROLE</small>CCTV Operator
                  </span>
                  <span>
                    <small>BASE</small>Patli, HR
                  </span>
                  <span>
                    <small>ACTIVE</small>2+ YRS
                  </span>
                </div>
                <p>
                  Deployed at <b>Flipkart Kalash Mega Hub</b> (current) and previously at{' '}
                  <b>Ekart Logistics</b>.
                </p>
                <a href={contact.mapUrl} rel="noopener noreferrer" target="_blank">
                  Open in Google Maps <ArrowUpRight aria-hidden="true" size={14} />
                </a>
              </div>
            ) : null}
          </div>
          <div className="network-panel" data-reveal>
            <div className="network-panel-header">
              <span className="mono-label">
                <Radio aria-hidden="true" size={13} /> NETWORK TOPOLOGY
              </span>
              <span className="network-health">
                <i /> TOPOLOGY VIEW
              </span>
            </div>
            <NetworkMap />
            <div className="network-panel-foot">
              <span>NETWORK NODES</span>
              <span>ILLUSTRATIVE TOPOLOGY</span>
            </div>
          </div>
        </div>
        <div className="site-list" aria-label="Deployment history">
          {careerSites.map((site, index) => (
            <article className="site-row" data-reveal key={site.id}>
              <span className="site-index">0{index + 1}</span>
              <span className="site-row-state">
                <i
                  className={
                    site.status === 'active' ? 'status-pulse' : 'status-pulse status-pulse--muted'
                  }
                />
                {site.status === 'active' ? 'CURRENT' : 'ARCHIVED'}
              </span>
              <strong>{site.name}</strong>
              <span>
                {site.client} · {site.period}
              </span>
              <span className="site-camera-count">{site.cameras} cameras</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
