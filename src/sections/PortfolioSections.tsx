import type { DeploymentBriefing } from '../types/portfolio';
import { About } from '../components/About';
import { PageTransition, Reveal } from '../motion';
import { Contact } from '../components/Contact';
import { Credentials } from '../components/Credentials';
import { Deployments } from '../components/Deployments';
import { Experience } from '../components/Experience';
import { Footprint } from '../components/Footprint';
import { Hero } from '../components/Hero';
import { Skills } from '../components/Skills';

interface PortfolioSectionsProps {
  onHire: () => void;
  onOpenDeployment: (deployment: DeploymentBriefing) => void;
}

export function PortfolioSections({ onHire, onOpenDeployment }: PortfolioSectionsProps) {
  return (
    <PageTransition>
      <main id="main-content">
        <Hero onHire={onHire} />
        <Reveal direction="left">
          <About />
        </Reveal>
        <Reveal direction="right">
          <Skills />
        </Reveal>
        <Reveal direction="up">
          <Footprint />
        </Reveal>
        <Reveal direction="left">
          <Deployments onOpen={onOpenDeployment} />
        </Reveal>
        <Reveal direction="right">
          <Experience />
        </Reveal>
        <Reveal direction="up">
          <Credentials />
        </Reveal>
        <Reveal direction="left">
          <Contact />
        </Reveal>
      </main>
    </PageTransition>
  );
}
