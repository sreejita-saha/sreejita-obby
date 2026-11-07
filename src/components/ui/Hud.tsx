import { portfolio } from "../../data/portfolio";
import { ControlIcon } from "./ControlIcon";
import { useState } from "react";
type HudProps = {
  checkpoint: number;
  onOpenPortfolio: () => void;
  onSelectCheckpoint: (index: number) => void;
  onSkip: () => void;
  popupsEnabled: boolean;
  onTogglePopups: () => void;
};
export function Hud({
  checkpoint,
  onOpenPortfolio,
  onSelectCheckpoint,
  onSkip,
  popupsEnabled,
  onTogglePopups,
}: HudProps) {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  return (
    <header className="hud">
      <div className="brand-area">
        <button
          className="brand"
          type="button"
          onClick={() => setIsWelcomeOpen((open) => !open)}
          aria-expanded={isWelcomeOpen}
          aria-controls="avatar-welcome"
          aria-label="Open Sreejita's welcome message"
        >
        <img src="/images/myprofilepic-logo-closeup.png" alt="Sreejita's profile" />
        </button>
        {isWelcomeOpen && (
          <div className="brand-welcome ui-panel" id="avatar-welcome">
            <p>Hii, how are you?</p>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new Event("obby-open-ai-chat"));
                setIsWelcomeOpen(false);
              }}
            >
              Chat with me
            </button>
          </div>
        )}
      </div>
      <div
        className="progress"
        aria-label={`${checkpoint + 1} of ${portfolio.length} checkpoints`}
      >
        {portfolio.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className={index <= checkpoint ? "done" : ""}
            onClick={() => onSelectCheckpoint(index)}
            aria-label={`Go to ${section.kicker}: ${section.title}`}
            data-tooltip={`Travel to ${section.kicker}`}
            data-tooltip-position="bottom"
          />
        ))}
      </div>
      <div className="hud-actions">
        <div className="quick-actions" aria-label="Game controls">
          <button
            className="hud-utility hud-utility--skip"
            type="button"
            onClick={onSkip}
            data-tooltip="Move to the next checkpoint"
            data-tooltip-position="bottom"
          >
            <ControlIcon name="skip" />
            <span>Skip</span>
          </button>
          <button
            className={`hud-utility hud-utility--popups ${popupsEnabled ? "is-on" : "is-off"}`}
            type="button"
            onClick={onTogglePopups}
            aria-pressed={popupsEnabled}
            data-tooltip={
              popupsEnabled
                ? "Hide checkpoint popups"
                : "Show checkpoint popups"
            }
            data-tooltip-position="bottom"
          >
            <ControlIcon name="popups" />
            <span>Popups</span>
          </button>
        </div>
        <button
          className="menu-button"
          onClick={onOpenPortfolio}
          data-tooltip="Read every portfolio checkpoint"
          data-tooltip-position="bottom"
        >
          Portfolio
        </button>
      </div>
    </header>
  );
}
