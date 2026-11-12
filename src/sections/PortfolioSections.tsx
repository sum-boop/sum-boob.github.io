import type { DeploymentBriefing } from '../types/portfolio';
import { About } from '../components/About';
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
    <main id="main-content">
      <Hero onHire={onHire} />
      <About />
      <Skills />
      <Footprint />
      <Deployments onOpen={onOpenDeployment} />
      <Experience />
      <Credentials />
      <Contact />
    </main>
  );
}
