import { ArrowUp, Radio } from 'lucide-react';
import { contact } from '../data/contact';
import { profile } from '../data/profile';
import { useClock } from '../hooks/useClock';
import { assetPath } from '../utils/assets';

const footerLinks = [
  { href: '#about', label: 'Expertise' },
  { href: '#footprint', label: 'Footprint' },
  { href: '#operations', label: 'Deployments' },
  { href: '#experience', label: 'Logbook' },
  { href: '#certifications', label: 'Credentials' },
  { href: '#contact', label: 'Contact' },
] as const;

export function Footer() {
  const clock = useClock();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-telemetry">
          <span>
            ROLE: <b>CCTV OPERATOR</b>
          </span>
          <span>REGION: HARYANA, INDIA</span>
          <span>
            CLOCK: <time>{clock}</time>
          </span>
          <span className="footer-status">
            <i /> SYSTEM ONLINE
          </span>
        </div>
        <div className="footer-main">
          <a className="footer-signature" href="#hero">
            <span className="footer-symbol">
              <Radio aria-hidden="true" size={17} />
            </span>
            <span>
              <strong>{profile.name}</strong>
              <small>{profile.role}</small>
            </span>
          </a>
          <nav aria-label="Footer navigation" className="footer-nav">
            {footerLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="footer-resume" download href={assetPath(contact.resumePath)}>
            Résumé PDF <ArrowUp aria-hidden="true" size={14} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {profile.name}. All rights reserved.</span>
          <span>Built with care · Patli, IN</span>
          <a href="#hero">
            Back to top <ArrowUp aria-hidden="true" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
