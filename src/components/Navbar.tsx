import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Radio, X } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useScrollSpy } from '../hooks/useScrollSpy';

const links = [
  { href: '#about', label: 'Expertise' },
  { href: '#footprint', label: 'Footprint' },
  { href: '#operations', label: 'Feeds' },
  { href: '#experience', label: 'Logbook' },
  { href: '#contact', label: 'Contact' },
] as const;
const sectionIds = ['hero', 'about', 'footprint', 'operations', 'experience', 'contact'] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const activeSection = useScrollSpy(sectionIds);
  const clock = useClock();
  const progress = useScrollProgress();

  useEffect(() => {
    if (!menuOpen) return;
    firstLinkRef.current?.focus({ preventScroll: true });
    document.body.classList.add('menu-open');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const closeAfterNavigation = () => setMenuOpen(false);

  return (
    <>
      <div
        aria-label="Scroll progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        className="scroll-progress"
        role="progressbar"
      >
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <header className="site-header">
        <nav aria-label="Primary navigation" className="nav-shell">
          <a
            aria-label="Sumit Anand — Home"
            className="brand-mark"
            href="#hero"
            onClick={closeAfterNavigation}
          >
            <span aria-hidden="true" className="brand-symbol">
              <Radio size={19} strokeWidth={1.8} />
            </span>
            <span>
              Sumit<span className="brand-surname"> Anand</span>
            </span>
          </a>
          <div className="nav-telemetry" aria-label={`Online, ${clock}`}>
            <span aria-hidden="true" className="status-pulse" />
            <span>ONLINE</span>
            <time>{clock}</time>
          </div>
          <div className="desktop-nav">
            {links.map((link) => (
              <a
                aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
                className="nav-link"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
            <a className="nav-cta" href="#contact">
              Let&apos;s talk <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </div>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            ref={toggleRef}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </nav>
        <div
          aria-hidden={!menuOpen}
          className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}
          hidden={!menuOpen}
          id="mobile-navigation"
        >
          <div className="mobile-nav-head">
            <span className="mono-label">Navigation / 06</span>
            <button
              aria-label="Close navigation"
              className="icon-button"
              onClick={() => {
                setMenuOpen(false);
                toggleRef.current?.focus({ preventScroll: true });
              }}
              type="button"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          {links.map((link, index) => (
            <a
              aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
              className="mobile-nav-link"
              href={link.href}
              key={link.href}
              onClick={closeAfterNavigation}
              ref={index === 0 ? firstLinkRef : undefined}
            >
              <span className="mobile-nav-index">0{index + 1}</span>
              {link.label}
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ))}
        </div>
      </header>
    </>
  );
}
