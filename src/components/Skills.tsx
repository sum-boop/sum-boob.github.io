import { ArrowUpRight, Cpu, Network, ScanEye, ShieldCheck } from 'lucide-react';
import { skillCategories, skillTicker } from '../data/skills';
import { SectionHeading } from './SectionHeading';

const icons = [ScanEye, Network, Cpu, ShieldCheck] as const;

export function Skills() {
  return (
    <section aria-labelledby="skills-title" className="content-section skills-section" id="skills">
      <div className="section-inner">
        <SectionHeading
          description="A working toolkit across camera systems, connectivity, gate operations, and safety response."
          eyebrow="Capabilities / signal map"
          id="skills-title"
          number="02"
          title="Systems in sync."
          tone="violet"
        />
        <div className="skills-grid">
          {skillCategories.map((category, index) => {
            const Icon = icons[index] ?? ScanEye;
            return (
              <article
                className={`skill-card skill-card--${category.accent}`}
                data-reveal
                key={category.name}
              >
                <div className="skill-card-header">
                  <span className="skill-icon">
                    <Icon aria-hidden="true" size={19} />
                  </span>
                  <span className="mono-label">SKILL GROUP / 0{index + 1}</span>
                  <ArrowUpRight aria-hidden="true" className="skill-arrow" size={16} />
                </div>
                <h3>{category.name}</h3>
                <ul className="skill-list">
                  {category.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <div aria-hidden="true" className="signal-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div aria-hidden="true" className="skill-ticker-wrap">
        <div className="skill-ticker">
          {[...skillTicker, ...skillTicker].map((skill, index) => (
            <span key={`${skill}-${index}`}>
              {skill}
              <i />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
