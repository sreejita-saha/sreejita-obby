import type { CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { creditsSection, portfolio } from "../../data/portfolio";
import { SectionContent } from "./SectionContent";
import "../../styles/portfolio/PortfolioPanels.css";
import "../../styles/screens/WelcomeScreen.css";
import "../../styles/ui-primitives.css";

type PortfolioMenuProps = { onClose: () => void };

/** A scrollable overview so visitors can read every checkpoint in one place. */
export function PortfolioMenu({ onClose }: PortfolioMenuProps) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="portfolio-menu__backdrop" />
        <Dialog.Content className="portfolio-menu" aria-describedby={undefined}>
          <Dialog.Close asChild>
            <button
              className="close"
              type="button"
              aria-label="Close portfolio"
              data-tooltip="Close the portfolio overview"
            >
              &times;
            </button>
          </Dialog.Close>
          <div className="portfolio-menu__intro">
            <p className="eyebrow">No need to jump :)</p>
        <Dialog.Title asChild>
          <h2 id="portfolio-title">Sreejita’s portfolio</h2>
        </Dialog.Title>
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
            <article
              className="portfolio-overview__card ui-panel"
              style={{ "--section-color": creditsSection.color } as CSSProperties}
            >
              <p className="eyebrow">{creditsSection.kicker}</p>
              <h3 className="portfolio-overview__title">{creditsSection.title}</h3>
              <SectionContent content={creditsSection.content} />
            </article>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
