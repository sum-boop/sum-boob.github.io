import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { deployments } from '../data/projects';
import type { DeploymentBriefing } from '../types/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CameraFeedCard } from './CameraFeedCard';
import { SectionHeading } from './SectionHeading';

interface DeploymentsProps {
  onOpen: (deployment: DeploymentBriefing) => void;
}

const DESKTOP_CARDS_PER_SLIDE = 4;
const MOBILE_CARDS_PER_SLIDE = 2;

export function Deployments({ onOpen }: DeploymentsProps) {
  const [activeFilter, setActiveFilter] = useState('All deployments');
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(DESKTOP_CARDS_PER_SLIDE);
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
  const slidePages = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(visibleDeployments.length / cardsPerSlide) },
        (_, slideIndex) =>
          visibleDeployments.slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide),
      ),
    [cardsPerSlide, visibleDeployments],
  );
  const operatingNetworks = new Set(visibleDeployments.map((deployment) => deployment.site)).size;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 760px)');
    const updateCardsPerSlide = () => {
      setCardsPerSlide(mediaQuery.matches ? MOBILE_CARDS_PER_SLIDE : DESKTOP_CARDS_PER_SLIDE);
      setActiveSlide(0);
      trackRef.current?.scrollTo({ left: 0, behavior: 'auto' });
    };

    updateCardsPerSlide();
    mediaQuery.addEventListener('change', updateCardsPerSlide);
    return () => mediaQuery.removeEventListener('change', updateCardsPerSlide);
  }, []);

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

  const activePage = slidePages[activeSlide];
  const slideAnnouncement = activePage
    ? `Slide ${activeSlide + 1} of ${slidePages.length}. ${activePage.map((deployment) => deployment.cardTitle).join(', ')}`
    : 'No deployments available for this filter.';
  const progress = slidePages.length ? ((activeSlide + 1) / slidePages.length) * 100 : 0;

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
          aria-label="Deployment matrix carousel"
          aria-roledescription="carousel"
          className="feed-carousel feed-matrix-shell"
          role="region"
        >
          <div className="feed-matrix-toolbar">
            <div className="feed-matrix-mode">
              <span aria-hidden="true" className="feed-matrix-beacon" />
              <span className="feed-matrix-mode-label">MATRIX VIEW</span>
              <span aria-hidden="true" className="feed-matrix-separator" />
              <span className="feed-matrix-total">
                {String(visibleDeployments.length).padStart(2, '0')} DEPLOYMENTS
              </span>
            </div>
            <span className="feed-matrix-filter-label">{activeFilter.toUpperCase()}</span>
          </div>
          <div
            aria-label="Deployment matrix slides"
            className="feed-matrix-track"
            id="deployment-carousel"
            onScroll={updateActiveSlide}
            ref={trackRef}
            role="group"
            tabIndex={0}
          >
            {slidePages.map((page, slideIndex) => (
              <div
                aria-label={`Slide ${slideIndex + 1} of ${slidePages.length}, ${page.length} deployment cards`}
                aria-roledescription="slide"
                className={`feed-matrix-page ${page.length === 1 ? 'feed-matrix-page--single' : ''} ${page.length === 2 ? 'feed-matrix-page--two' : ''} ${page.length === 3 ? 'feed-matrix-page--three' : ''}`}
                data-slide-index={slideIndex}
                key={page.map((deployment) => deployment.id).join('-')}
                role="group"
              >
                {page.map((deployment) => (
                  <div className="feed-matrix-cell" key={deployment.id}>
                    <CameraFeedCard
                      deployment={deployment}
                      index={deployments.indexOf(deployment)}
                      onOpen={onOpen}
                    />
                  </div>
                ))}
                {page.length < cardsPerSlide && (
                  <div
                    aria-label="Portfolio matrix summary"
                    className={`feed-matrix-summary ${page.length === 3 ? 'feed-matrix-summary--cell' : ''}`}
                    role="group"
                  >
                    <div className="feed-matrix-summary-head">
                      <span aria-hidden="true" className="feed-matrix-summary-beacon" />
                      <span>PORTFOLIO INDEX</span>
                      <span>OVERVIEW</span>
                    </div>
                    <div className="feed-matrix-summary-main">
                      <strong>{String(visibleDeployments.length).padStart(2, '0')}</strong>
                      <div>
                        <span>DEPLOYMENT BRIEFINGS</span>
                        <p>Explore the field context behind each operating network.</p>
                      </div>
                    </div>
                    <div className="feed-matrix-summary-foot">
                      <span>{operatingNetworks} OPERATING NETWORKS</span>
                      <span>INDEX / {String(slideIndex + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="feed-matrix-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="feed-carousel-controls">
            <span aria-hidden="true" className="feed-slide-count">
              {String(activeSlide + 1).padStart(2, '0')} /{' '}
              {String(slidePages.length).padStart(2, '0')}
            </span>
            <div aria-label="Choose deployment slide" className="feed-carousel-dots" role="group">
              {slidePages.map((page, slideIndex) => (
                <button
                  aria-current={activeSlide === slideIndex ? 'true' : undefined}
                  aria-label={`Go to slide ${slideIndex + 1} of ${slidePages.length}`}
                  className={`feed-carousel-dot ${activeSlide === slideIndex ? 'feed-carousel-dot--active' : ''}`}
                  key={page.map((deployment) => deployment.id).join('-')}
                  onClick={() => scrollToSlide(slideIndex)}
                  type="button"
                />
              ))}
            </div>
            <div aria-label="Carousel navigation" className="feed-carousel-buttons" role="group">
              <button
                aria-controls="deployment-carousel"
                aria-label="Previous slide"
                disabled={activeSlide === 0}
                onClick={() => scrollToSlide(activeSlide - 1)}
                type="button"
              >
                <ChevronLeft aria-hidden="true" size={18} />
              </button>
              <button
                aria-controls="deployment-carousel"
                aria-label="Next slide"
                disabled={activeSlide >= slidePages.length - 1}
                onClick={() => scrollToSlide(activeSlide + 1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" size={18} />
              </button>
            </div>
            <span aria-atomic="true" aria-live="polite" className="sr-only">
              {slideAnnouncement}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
