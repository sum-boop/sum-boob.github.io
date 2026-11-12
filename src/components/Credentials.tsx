import { Award, GraduationCap } from 'lucide-react';
import { certifications, education } from '../data/certifications';
import { SectionHeading } from './SectionHeading';

export function Credentials() {
  return (
    <section
      aria-labelledby="credentials-title"
      className="content-section credentials-section"
      id="certifications"
    >
      <div className="section-inner">
        <SectionHeading
          eyebrow="Certifications & training"
          id="credentials-title"
          number="06"
          title="Verified credentials."
          tone="amber"
        />
        <div className="credentials-layout">
          <div className="education-card" data-reveal>
            <span className="credential-icon">
              <GraduationCap aria-hidden="true" size={21} />
            </span>
            <span className="mono-label">EDUCATION</span>
            <h3>{education}</h3>
            <span className="credential-note">Educational organization</span>
          </div>
          <div className="certification-grid">
            {certifications.map((certification, index) => (
              <article className="certification-card" data-reveal key={certification.title}>
                <div className="certification-topline">
                  <Award aria-hidden="true" size={18} />
                  <span>0{index + 1} / CERTIFIED</span>
                </div>
                <h3>{certification.title}</h3>
                <p>{certification.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
