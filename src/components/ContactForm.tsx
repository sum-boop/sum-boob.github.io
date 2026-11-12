import { m } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { contact } from '../data/contact';
import { motionDurations, motionEasings } from '../motion/config';
import { useToast } from './ToastProvider';

interface ContactFormProps {
  variant?: 'page' | 'modal';
}

function makeEmailDraft(fields: {
  name: string;
  email: string;
  organization: string;
  message: string;
}): string {
  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    ...(fields.organization ? [`Organization: ${fields.organization}`] : []),
    '',
    fields.message,
  ].join('\n');
  return `mailto:${contact.email}?subject=${encodeURIComponent(`Portfolio contact from ${fields.name}`)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ variant = 'page' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'idle' | 'success' | 'fallback'>('idle');
  const [draftUrl, setDraftUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const showToast = useToast();
  const prefix = variant === 'modal' ? 'hire' : 'contact';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fields = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      organization: String(formData.get('organization') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    if (fields.name.length < 2 || fields.name.length > 120) {
      setErrorMessage('Enter a name between 2 and 120 characters.');
      form.querySelector<HTMLInputElement>(`#${prefix}-name`)?.focus();
      return;
    }
    if (fields.email.length < 3 || fields.email.length > 254) {
      setErrorMessage('Enter a valid email address (254 characters or fewer).');
      form.querySelector<HTMLInputElement>(`#${prefix}-email`)?.focus();
      return;
    }
    if (fields.organization.length > 120) {
      setErrorMessage('Keep the organization name to 120 characters or fewer.');
      form.querySelector<HTMLInputElement>(`#${prefix}-org`)?.focus();
      return;
    }
    if (fields.message.length < 10 || fields.message.length > 5000) {
      setErrorMessage('Enter a message between 10 and 5,000 characters.');
      form.querySelector<HTMLTextAreaElement>(`#${prefix}-message`)?.focus();
      return;
    }

    setErrorMessage('');
    if (String(formData.get('website') ?? '').trim()) {
      setResult('success');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = new URL('api/contact', window.location.href);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Contact submission failed');
      }
      setResult('success');
      showToast({
        type: 'success',
        title: 'Channel opened',
        message: 'Your message has been received.',
      });
    } catch {
      setDraftUrl(makeEmailDraft(fields));
      setResult('fallback');
      showToast({
        type: 'error',
        title: 'Form unavailable',
        message: 'Use the prefilled email draft to continue.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result === 'success') {
    return (
      <div className="form-result form-result--success" role="status">
        <span className="result-indicator">
          <i /> REQUEST RECEIVED
        </span>
        <strong>Message received.</strong>
        <p>I&apos;ll reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <form
      aria-busy={isSubmitting}
      className={`contact-form contact-form--${variant}`}
      onSubmit={handleSubmit}
    >
      {result === 'fallback' ? (
        <div className="form-result form-result--fallback" role="alert">
          <strong>Email draft available</strong>
          <p>
            The form is unavailable on this host. Send your message using a prefilled email draft.
          </p>
          <a className="email-draft-link" href={draftUrl}>
            Open email draft <ArrowRight aria-hidden="true" size={15} />
          </a>
        </div>
      ) : null}
      {errorMessage ? (
        <m.p
          animate={{ opacity: 1, y: 0 }}
          className="form-error"
          initial={{ opacity: 1, y: 6 }}
          role="alert"
          transition={{ duration: motionDurations.micro, ease: motionEasings.out }}
        >
          {errorMessage}
        </m.p>
      ) : null}
      <div aria-hidden="true" className="form-honeypot">
        <label htmlFor={`${prefix}-website`}>Leave this field empty</label>
        <input
          autoComplete="off"
          id={`${prefix}-website`}
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>
      <fieldset className="form-fields" disabled={isSubmitting}>
        <div className="form-field-row">
          <div className="form-field">
            <input
              autoComplete="name"
              id={`${prefix}-name`}
              maxLength={120}
              minLength={2}
              name="name"
              placeholder=" "
              required
              type="text"
            />
            <label htmlFor={`${prefix}-name`}>Name</label>
          </div>
          <div className="form-field">
            <input
              aria-describedby={`${prefix}-email-help`}
              autoComplete="email"
              id={`${prefix}-email`}
              maxLength={254}
              name="email"
              placeholder=" "
              required
              type="email"
            />
            <label htmlFor={`${prefix}-email`}>Email</label>
          </div>
        </div>
        <p className="form-help" id={`${prefix}-email-help`}>
          {contact.responseTime}
        </p>
        <div className="form-field">
          <input
            autoComplete="organization"
            id={`${prefix}-org`}
            maxLength={120}
            name="organization"
            placeholder=" "
            type="text"
          />
          <label htmlFor={`${prefix}-org`}>Company / Organization</label>
        </div>
        <div className="form-field">
          <textarea
            id={`${prefix}-message`}
            maxLength={5000}
            minLength={10}
            name="message"
            placeholder=" "
            required
            rows={4}
          />
          <label htmlFor={`${prefix}-message`}>Message</label>
        </div>
        <m.button
          className="button button--primary form-submit"
          disabled={isSubmitting}
          type="submit"
          {...(!isSubmitting ? { whileTap: { scale: 0.985 } } : {})}
        >
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="spinner" size={17} />
          ) : (
            <ArrowRight aria-hidden="true" size={17} />
          )}
          {isSubmitting ? 'Transmitting…' : 'Transmit Request'}
        </m.button>
      </fieldset>
    </form>
  );
}
