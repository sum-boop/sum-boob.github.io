interface SectionHeadingProps {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: 'cyan' | 'violet' | 'lime' | 'amber';
  id: string;
}

export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  tone = 'cyan',
  id,
}: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${tone}`} data-reveal>
      <p className="section-eyebrow">
        <span>{number}</span> / {eyebrow}
      </p>
      <h2 id={id}>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </header>
  );
}
