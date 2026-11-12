import { useMemo, useState } from 'react';
import { CameraFeedCard } from './CameraFeedCard';
import { SectionHeading } from './SectionHeading';
import { deployments } from '../data/projects';
import type { DeploymentBriefing } from '../types/portfolio';

interface DeploymentsProps {
  onOpen: (deployment: DeploymentBriefing) => void;
}

export function Deployments({ onOpen }: DeploymentsProps) {
  const [activeFilter, setActiveFilter] = useState('All feeds');
  const filters = useMemo(
    () => ['All feeds', ...new Set(deployments.map((deployment) => deployment.category))],
    [],
  );
  const visibleDeployments =
    activeFilter === 'All feeds'
      ? deployments
      : deployments.filter((deployment) => deployment.category === activeFilter);

  return (
    <section
      aria-labelledby="operations-title"
      className="content-section operations-section"
      id="operations"
    >
      <div className="section-inner">
        <SectionHeading
          description="Illustrative feed imagery is not footage from the listed client sites. Each briefing separates visual reference from recorded work details."
          eyebrow="Key deployments"
          id="operations-title"
          number="04"
          title="Camera feed deployments."
          tone="amber"
        />
        <div aria-label="Filter deployments" className="feed-filters" role="group">
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={`feed-filter ${activeFilter === filter ? 'feed-filter--active' : ''}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
              <span>
                {filter === 'All feeds'
                  ? deployments.length
                  : deployments.filter((deployment) => deployment.category === filter).length}
              </span>
            </button>
          ))}
        </div>
        <div aria-live="polite" className="feed-grid">
          {visibleDeployments.map((deployment) => (
            <CameraFeedCard
              deployment={deployment}
              index={deployments.indexOf(deployment)}
              key={deployment.id}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
