import type { CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { PortfolioSection } from "../../types/portfolio";
import { SectionContent } from "./SectionContent";
import "../../styles/portfolio/PortfolioPanels.css";
import "../../styles/screens/WelcomeScreen.css";
import "../../styles/ui-primitives.css";

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
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="panel-backdrop" />
        <Dialog.Content
          className={`section-card ui-panel section-card--${section.id}${section.image ? " section-card--with-image" : ""}`}
          style={style}
          aria-describedby={undefined}
        >
          <Dialog.Close asChild>
            <button
              className="close"
              type="button"
              aria-label="Close section"
              data-tooltip="Close this checkpoint"
            >
              &times;
            </button>
          </Dialog.Close>
          <p className="eyebrow">{section.kicker}</p>
          <Dialog.Title asChild>
            <h2 id={`section-title-${section.id}`}>{section.title}</h2>
          </Dialog.Title>
          <SectionContent content={section.content} leadingImage={section.image} />
          {section.links && (
            <div className="section-card__links">
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
          <button className="continue ui-button" type="button" onClick={onContinue}>
            {isFinalSection ? "Play again" : "Continue obby"}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
