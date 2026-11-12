import { m } from 'framer-motion';
import { ArrowUpRight, Cpu, Network, ScanEye, ShieldCheck } from 'lucide-react';
import { skillCategories, skillTicker } from '../data/skills';
import { Marquee, StaggerGroup, staggerItemVariants } from '../motion';
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
        <StaggerGroup className="skills-grid">
          {skillCategories.map((category, index) => {
            const Icon = icons[index] ?? ScanEye;
            return (
              <m.article
                className={`skill-card skill-card--${category.accent}`}
                data-reveal
                key={category.name}
                variants={staggerItemVariants}
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
              </m.article>
            );
          })}
        </StaggerGroup>
      </div>
      <div aria-hidden="true" className="skill-ticker-wrap">
        <Marquee className="skill-ticker" items={skillTicker} />
      </div>
    </section>
  );
}
