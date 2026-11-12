import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail, MapPin, MessageCircle, Phone, Radio } from 'lucide-react';
import { contact } from '../data/contact';
import { assetPath } from '../utils/assets';
import { ContactForm } from './ContactForm';
import { SectionHeading } from './SectionHeading';
import { useToast } from './ToastProvider';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const showToast = useToast();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      showToast({ type: 'success', title: 'Email copied', message: contact.email });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast({
        type: 'error',
        title: 'Copy unavailable',
        message: 'Use the email link to reach Sumit.',
      });
    }
  }

  return (
    <section
      aria-labelledby="contact-title"
      className="content-section contact-section"
      id="contact"
    >
      <div className="section-inner">
        <SectionHeading
          eyebrow="Open a channel"
          id="contact-title"
          number="07"
          title="Request operator access."
          tone="cyan"
        />
        <div className="contact-layout">
          <div className="contact-copy" data-reveal>
            <p className="eyebrow-line">// DIRECT LINE · NO INTERMEDIARIES</p>
            <p className="contact-intro">{contact.availability}</p>
            <div className="contact-terminal">
              <div className="terminal-heading">
                <span>
                  <Radio aria-hidden="true" size={15} /> SECURE CHANNEL
                </span>
                <span>ENCRYPTED / READY</span>
              </div>
              <a href={`mailto:${contact.email}`}>
                <Mail aria-hidden="true" size={17} />
                <span>
                  <small>EMAIL</small>
                  {contact.email}
                </span>
                <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
                <Phone aria-hidden="true" size={17} />
                <span>
                  <small>PHONE</small>
                  {contact.phone}
                </span>
                <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <a href={contact.whatsappUrl} rel="noopener noreferrer" target="_blank">
                <MessageCircle aria-hidden="true" size={17} />
                <span>
                  <small>WHATSAPP</small>Message directly
                </span>
                <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <button className="copy-email" onClick={copyEmail} type="button">
                {copied ? (
                  <Check aria-hidden="true" size={15} />
                ) : (
                  <Copy aria-hidden="true" size={15} />
                )}
                {copied ? 'Copied' : 'Copy email address'}
              </button>
              <a className="resume-link" download href={assetPath(contact.resumePath)}>
                <ArrowUpRight aria-hidden="true" size={14} /> Download résumé PDF
              </a>
            </div>
            <p className="contact-location">
              <MapPin aria-hidden="true" size={15} /> {contact.location}
            </p>
          </div>
          <div className="contact-form-panel" data-reveal>
            <div className="contact-form-heading">
              <span className="mono-label">TRANSMIT A REQUEST</span>
              <span aria-label="Available" className="availability-chip">
                <i /> AVAILABLE
              </span>
            </div>
            <p>{contact.hireAvailability}</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
