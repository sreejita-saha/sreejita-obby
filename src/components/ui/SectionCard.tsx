import type { CSSProperties } from "react";
import type { PortfolioSection } from "../../types/portfolio";
import { SectionContent } from "./SectionContent";

type SectionCardProps = {
  section: PortfolioSection;
  onClose: () => void;
  /** The main button can restart the obby from the final card. */
  onContinue: () => void;
};

export function SectionCard({ section, onClose, onContinue }: SectionCardProps) {
  const style = { "--section-color": section.color } as CSSProperties;
  const isFinalSection = section.id === "contact";

  return (
    <div className="panel-backdrop" role="presentation" onMouseDown={onClose}>
      <article className={`section-card ui-panel section-card--${section.id}${section.image ? " section-card--with-image" : ""}`} style={style} role="dialog" aria-modal="true" aria-labelledby={`section-title-${section.id}`} onMouseDown={(event) => event.stopPropagation()}>
        <button className="close" type="button" onClick={onClose} aria-label="Close section">×</button>
        <p className="eyebrow">{section.kicker}</p>
        <h2 id={`section-title-${section.id}`}>{section.title}</h2>
        <SectionContent content={section.content} />
        {section.image && <img className={section.image.className} src={section.image.src} alt={section.image.alt} />}
        {section.links && (
          <div className="section-card__links">
            {section.links.map((link) => (
              <a key={link.href} className="card-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
        <button className="continue ui-button" type="button" onClick={onContinue}>
          {isFinalSection ? "Play again" : "Continue obby"}
        </button>
      </article>
    </div>
  );
}
