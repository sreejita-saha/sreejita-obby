import type { CSSProperties } from "react";
import { portfolio } from "../../data/portfolio";
import { SectionContent } from "./SectionContent";

type PortfolioMenuProps = { onClose: () => void };

/** A scrollable overview so visitors can read every checkpoint in one place. */
export function PortfolioMenu({ onClose }: PortfolioMenuProps) {
  return (
    <section className="portfolio-menu" aria-labelledby="portfolio-title">
      <button className="close" type="button" onClick={onClose} aria-label="Close portfolio">×</button>
      <div className="portfolio-menu__intro">
        <p className="eyebrow">No jumping required</p>
        <h2 id="portfolio-title">Sreejita’s portfolio</h2>
        <p>Scroll through every checkpoint, all in one place.</p>
      </div>
      <div className="portfolio-overview">
        {portfolio.map((section) => (
          <article key={section.id} className="portfolio-overview__card" style={{ "--section-color": section.color } as CSSProperties}>
            <p className="eyebrow">{section.kicker}</p>
            <h3>{section.title}</h3>
            <SectionContent content={section.content} />
            {section.links?.map((link) => <a key={link.href} className="card-link" href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
          </article>
        ))}
      </div>
    </section>
  );
}
