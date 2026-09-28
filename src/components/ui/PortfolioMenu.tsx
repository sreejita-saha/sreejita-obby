import type { CSSProperties } from "react";
import { portfolio } from "../../data/portfolio";
import { SectionContent } from "./SectionContent";

type PortfolioMenuProps = { onClose: () => void };

/** A scrollable overview so visitors can read every checkpoint in one place. */
export function PortfolioMenu({ onClose }: PortfolioMenuProps) {
  return (
    <section className="portfolio-menu" aria-labelledby="portfolio-title">
      <button
        className="close"
        type="button"
        onClick={onClose}
        aria-label="Close portfolio"
        data-tooltip="Close the portfolio overview"
      >
        ×
      </button>
      <div className="portfolio-menu__intro">
        <p className="eyebrow">No need to jump :)</p>
        <h2 id="portfolio-title">Sreejita’s portfolio</h2>
      </div>
      <div className="portfolio-overview">
        {portfolio.map((section) => (
          <article
            key={section.id}
            className="portfolio-overview__card ui-panel"
            style={{ "--section-color": section.color } as CSSProperties}
          >
            <p className="eyebrow">{section.kicker}</p>
            <h3 className="portfolio-overview__title">{section.title}</h3>
            <SectionContent content={section.content} />
            {section.links && (
              <div className="portfolio-overview__links">
                {section.links.map((link) => (
                  <a
                    key={link.href}
                    className="card-link"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
