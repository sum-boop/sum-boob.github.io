import { useCallback, useState } from 'react';
import { ArrowRight, Check, MapPin, Radio } from 'lucide-react';
import { Boot } from './components/Boot';
import { ContactForm } from './components/ContactForm';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { Navbar } from './components/Navbar';
import { ToastProvider } from './components/ToastProvider';
import { contact } from './data/contact';
import { useReveal } from './hooks/useReveal';
import { PortfolioSections } from './sections/PortfolioSections';
import type { DeploymentBriefing } from './types/portfolio';
import { assetPath } from './utils/assets';

type ActiveDialog =
  { kind: 'hire' } | { kind: 'deployment'; deployment: DeploymentBriefing } | null;

function AppContent() {
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  useReveal();

  const openHire = useCallback(() => setDialog({ kind: 'hire' }), []);
  const openDeployment = useCallback((deployment: DeploymentBriefing) => {
    setGalleryIndex(0);
    setImageFailed(false);
    setDialog({ kind: 'deployment', deployment });
  }, []);
  const closeDialog = useCallback(() => setDialog(null), []);

  const project = dialog?.kind === 'deployment' ? dialog.deployment : null;
  const galleryImage = project?.gallery[galleryIndex] ?? project?.image ?? '';

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <PortfolioSections onHire={openHire} onOpenDeployment={openDeployment} />
      <Footer />
      <Cursor />
      <Boot />
      <Modal
        className={dialog?.kind === 'deployment' ? 'modal-window--briefing' : 'modal-window--hire'}
        isOpen={dialog !== null}
        onClose={closeDialog}
        titleId="dialog-title"
      >
        {dialog?.kind === 'deployment' && project ? (
          <>
            <div className="modal-heading">
              <div>
                <p className="mono-label">{project.eyebrow}</p>
                <h2 id="dialog-title">{project.title}</h2>
              </div>
              <span className="modal-index">BRIEFING / {project.id.toUpperCase()}</span>
            </div>
            <img
              alt={`${project.title} — ${project.site}`}
              className="modal-image"
              decoding="async"
              height="600"
              onError={() => setImageFailed(true)}
              src={imageFailed ? assetPath('assets/sumit-monitoring-station.jpg') : galleryImage}
              width="1200"
            />
            {project.gallery.length ? (
              <div aria-label="Briefing image gallery" className="modal-gallery">
                {project.gallery.map((image, index) => (
                  <button
                    aria-label={`View frame ${index + 1} of ${project.title}`}
                    aria-pressed={galleryIndex === index}
                    className={
                      galleryIndex === index
                        ? 'gallery-thumb gallery-thumb--active'
                        : 'gallery-thumb'
                    }
                    key={image}
                    onClick={() => {
                      setImageFailed(false);
                      setGalleryIndex(index);
                    }}
                    type="button"
                  >
                    <img alt="" decoding="async" loading="lazy" src={image} />
                  </button>
                ))}
              </div>
            ) : null}
            <div className="modal-readouts">
              <div>
                <small>SITE</small>
                <strong>{project.site}</strong>
              </div>
              <div>
                <small>DURATION</small>
                <strong>{project.period}</strong>
              </div>
              <div>
                <small>CAMERAS</small>
                <strong>{project.cameras === null ? '—' : project.cameras}</strong>
              </div>
            </div>
            <p className="modal-description">{project.description}</p>
            <ul aria-label="Skills used in deployment" className="modal-tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div className="modal-actions">
              <button className="button button--quiet" onClick={closeDialog} type="button">
                Close briefing
              </button>
              <a className="button button--primary" href="#contact" onClick={closeDialog}>
                Request briefing <ArrowRight aria-hidden="true" size={16} />
              </a>
            </div>
          </>
        ) : dialog?.kind === 'hire' ? (
          <>
            <div className="modal-heading">
              <div>
                <p className="mono-label">
                  <Radio aria-hidden="true" size={14} /> REQUEST DEPLOYMENT
                </p>
                <h2 id="dialog-title">Open a channel with Sumit.</h2>
              </div>
              <span className="modal-index">
                <MapPin aria-hidden="true" size={13} /> HARYANA / NCR
              </span>
            </div>
            <p className="modal-description">{contact.hireAvailability}</p>
            <ContactForm variant="modal" />
            <div className="modal-contact-note">
              <Check aria-hidden="true" size={14} /> Direct line:{' '}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
