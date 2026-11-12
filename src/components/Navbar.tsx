import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Radio, X } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { ScrollProgress } from '../motion';
import { motionDurations, motionEasings, motionSprings } from '../motion/tokens';
import { useScrollSpy } from '../hooks/useScrollSpy';

const links = [
  { href: '#about', label: 'Expertise' },
  { href: '#footprint', label: 'Footprint' },
  { href: '#operations', label: 'Deployments' },
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
      <ScrollProgress />
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
            {links.map((link) => {
              const active = activeSection === link.href.slice(1);
              return (
                <m.a
                  aria-current={active ? 'location' : undefined}
                  className="nav-link"
                  href={link.href}
                  key={link.href}
                  whileTap={{ scale: 0.97 }}
                >
                  {link.label}
                  {active ? (
                    <m.span
                      aria-hidden="true"
                      className="nav-active-indicator"
                      layoutId="active-nav-indicator"
                      transition={motionSprings.snappy}
                    />
                  ) : null}
                </m.a>
              );
            })}
            <m.a
              className="nav-cta"
              href="#contact"
              transition={{ duration: motionDurations.micro, ease: motionEasings.out }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Let&apos;s talk <ArrowUpRight aria-hidden="true" size={14} />
            </m.a>
          </div>
          <m.button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            ref={toggleRef}
            type="button"
            whileTap={{ scale: 0.94 }}
          >
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </m.button>
        </nav>
        <AnimatePresence initial={false}>
          {menuOpen ? (
            <m.div
              aria-hidden={!menuOpen}
              className="mobile-nav mobile-nav--open"
              id="mobile-navigation"
              initial={{ opacity: 1, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: motionDurations.micro, ease: motionEasings.out }}
            >
              <div className="mobile-nav-head">
                <span className="mono-label">Navigation / 06</span>
                <m.button
                  aria-label="Close navigation"
                  className="icon-button"
                  onClick={() => {
                    setMenuOpen(false);
                    toggleRef.current?.focus({ preventScroll: true });
                  }}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                >
                  <X aria-hidden="true" size={18} />
                </m.button>
              </div>
              {links.map((link, index) => {
                const active = activeSection === link.href.slice(1);
                return (
                  <m.a
                    aria-current={active ? 'location' : undefined}
                    className="mobile-nav-link"
                    href={link.href}
                    key={link.href}
                    onClick={closeAfterNavigation}
                    ref={index === 0 ? firstLinkRef : undefined}
                    initial={{ opacity: 1, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: motionDurations.micro,
                      delay: index * 0.035,
                      ease: motionEasings.out,
                    }}
                  >
                    {active ? (
                      <m.span
                        aria-hidden="true"
                        className="nav-active-indicator"
                        layoutId="mobile-active-nav-indicator"
                      />
                    ) : null}
                    <span className="mobile-nav-index">0{index + 1}</span>
                    {link.label}
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </m.a>
                );
              })}
            </m.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
