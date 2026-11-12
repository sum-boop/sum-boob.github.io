import { m } from 'framer-motion';
import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { experience } from '../data/experience';
import { motionDurations, motionEasings } from '../motion/config';
import { SectionHeading } from './SectionHeading';

export function Experience() {
  return (
    <section
      aria-labelledby="experience-title"
      className="content-section experience-section"
      id="experience"
    >
      <div className="section-inner">
        <SectionHeading
          eyebrow="Duty history"
          id="experience-title"
          number="05"
          title="Operational logbook."
          tone="violet"
        />
        <ol className="experience-timeline">
          {experience.map((entry, index) => (
            <li
              className={`experience-entry experience-entry--${entry.status}`}
              data-reveal
              key={entry.id}
            >
              <div className="experience-rail" aria-hidden="true">
                <span />
                <m.i
                  initial={{ scaleY: 0.86 }}
                  transition={{ duration: motionDurations.reveal, ease: motionEasings.out }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileInView={{ scaleY: 1 }}
                />
              </div>
              <div className="experience-content">
                <div className="experience-topline">
                  <span className="experience-date">
                    {entry.startYear} — {entry.endYear}
                  </span>
                  <span className={`experience-status experience-status--${entry.status}`}>
                    <i /> {entry.status === 'active' ? 'Active post' : 'Archived'}
                  </span>
                </div>
                <h3>{entry.role}</h3>
                <p className="experience-company">
                  <BriefcaseBusiness aria-hidden="true" size={15} /> {entry.company}
                </p>
                <a className="experience-site" href="#footprint">
                  {entry.site} <ArrowUpRight aria-hidden="true" size={13} />
                </a>
                <ul className="responsibility-list">
                  {entry.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
                <ul aria-label={`Skills used at ${entry.company}`} className="experience-tags">
                  {entry.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
              <span aria-hidden="true" className="experience-index">
                LOG / 0{index + 1}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
