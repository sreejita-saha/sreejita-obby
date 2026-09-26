import type { CSSProperties } from "react";
import type { PortfolioSection } from "../../types/portfolio";

type SectionCardProps = {
  section: PortfolioSection;
  onClose: () => void;
};

export function SectionCard({ section, onClose }: SectionCardProps) {
  const style = { "--section-color": section.color } as CSSProperties;

  return (
    <div className="panel-backdrop">
      <article className={`section-card${section.id === "about" ? " section-card--about" : ""}`} style={style}>
        <button className="close" onClick={onClose} aria-label="Continue playing">×</button>
        <p className="eyebrow">{section.kicker}</p>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
        {section.id === "about" && <img className="modal-avatar" src="/images/me wave.png" alt="Sreejita waving" />}
        {section.links?.map((link) => (
          <a key={link.label} className="card-link" href={link.href} target="_blank" rel="noreferrer">
            {link.label} ↗
          </a>
        ))}
        <button className="continue" onClick={onClose}>
          {section.id === "contact" ? "Play again" : "Continue obby"}
        </button>
      </article>
    </div>
  );
}
