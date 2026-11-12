import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { deployments } from '../data/projects';
import type { DeploymentBriefing } from '../types/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CameraFeedCard } from './CameraFeedCard';
import { SectionHeading } from './SectionHeading';

interface DeploymentsProps {
  onOpen: (deployment: DeploymentBriefing) => void;
}

export function Deployments({ onOpen }: DeploymentsProps) {
  const [activeFilter, setActiveFilter] = useState('All deployments');
  const [activeSlide, setActiveSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const filters = useMemo(
    () => ['All deployments', ...new Set(deployments.map((deployment) => deployment.category))],
    [],
  );
  const visibleDeployments =
    activeFilter === 'All deployments'
      ? deployments
      : deployments.filter((deployment) => deployment.category === activeFilter);

  const scrollToSlide = (slideIndex: number) => {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>(`[data-slide-index="${slideIndex}"]`);

    if (!track || !slide) return;

    const trackLeft = track.getBoundingClientRect().left;
    const left = track.scrollLeft + slide.getBoundingClientRect().left - trackLeft;
    track.scrollTo({ left, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setActiveSlide(slideIndex);
  };

  const updateActiveSlide = () => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-slide-index]'));
    if (slides.length === 0) return;

    const firstSlide = slides[0];
    if (!firstSlide) return;

    const trackLeft = track.getBoundingClientRect().left;
    const closestSlide = slides.slice(1).reduce((closest, slide) => {
      const currentDistance = Math.abs(closest.getBoundingClientRect().left - trackLeft);
      const nextDistance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return nextDistance < currentDistance ? slide : closest;
    }, firstSlide);
    const nextSlide = Number(closestSlide.dataset.slideIndex);

    if (!Number.isInteger(nextSlide)) return;

    setActiveSlide((currentSlide) => (currentSlide === nextSlide ? currentSlide : nextSlide));
  };

  const changeFilter = (filter: string) => {
    setActiveFilter(filter);
    setActiveSlide(0);
    trackRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  };

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
              onClick={() => changeFilter(filter)}
              type="button"
            >
              {filter}
              <span>
                {filter === 'All deployments'
                  ? deployments.length
                  : deployments.filter((deployment) => deployment.category === filter).length}
              </span>
            </button>
          ))}
        </div>
        <div
          aria-label="Deployment carousel"
          aria-roledescription="carousel"
          className="feed-carousel"
          role="region"
        >
          <div
            aria-label="Deployment slides"
            className="feed-grid"
            id="deployment-carousel"
            onScroll={updateActiveSlide}
            ref={trackRef}
            role="group"
            tabIndex={0}
          >
            {visibleDeployments.map((deployment, slideIndex) => (
              <div
                aria-label={`Slide ${slideIndex + 1} of ${visibleDeployments.length}: ${deployment.cardTitle}`}
                aria-roledescription="slide"
                className="feed-slide"
                data-slide-index={slideIndex}
                key={deployment.id}
                role="group"
              >
                <CameraFeedCard
                  deployment={deployment}
                  index={deployments.indexOf(deployment)}
                  onOpen={onOpen}
                />
              </div>
            ))}
          </div>
          <div className="feed-carousel-controls">
            <span aria-hidden="true" className="feed-slide-count">
              {String(activeSlide + 1).padStart(2, '0')} /{' '}
              {String(visibleDeployments.length).padStart(2, '0')}
            </span>
            <div aria-label="Choose deployment slide" className="feed-carousel-dots" role="group">
              {visibleDeployments.map((deployment, slideIndex) => (
                <button
                  aria-current={activeSlide === slideIndex ? 'true' : undefined}
                  aria-label={`Go to slide ${slideIndex + 1}: ${deployment.cardTitle}`}
                  className={`feed-carousel-dot ${activeSlide === slideIndex ? 'feed-carousel-dot--active' : ''}`}
                  key={deployment.id}
                  onClick={() => scrollToSlide(slideIndex)}
                  type="button"
                />
              ))}
            </div>
            <div aria-label="Carousel navigation" className="feed-carousel-buttons" role="group">
              <button
                aria-controls="deployment-carousel"
                aria-label="Previous deployment"
                disabled={activeSlide === 0}
                onClick={() => scrollToSlide(activeSlide - 1)}
                type="button"
              >
                <ChevronLeft aria-hidden="true" size={18} />
              </button>
              <button
                aria-controls="deployment-carousel"
                aria-label="Next deployment"
                disabled={activeSlide >= visibleDeployments.length - 1}
                onClick={() => scrollToSlide(activeSlide + 1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" size={18} />
              </button>
            </div>
            <span aria-atomic="true" aria-live="polite" className="sr-only">
              {visibleDeployments[activeSlide]
                ? `Slide ${activeSlide + 1} of ${visibleDeployments.length}: ${visibleDeployments[activeSlide].cardTitle}`
                : 'No deployments available for this filter.'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
