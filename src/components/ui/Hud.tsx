import { portfolio } from "../../data/portfolio";
import { ControlIcon } from "./ControlIcon";
import { ToggleControl } from "./ToggleControl";
import { useState, type ReactNode } from "react";
import { openPortfolioChat } from "../../config/events";
import "../../styles/ui/Hud.css";
import "../../styles/ui/GameControls.css";
type HudProps = {
  children: ReactNode;
  checkpoint: number;
  onOpenPortfolio: () => void;
  onSelectCheckpoint: (index: number) => void;
  onSkip: () => void;
  popupsEnabled: boolean;
  onTogglePopups: () => void;
};
export function Hud({
  children,
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
          onClick={() => {
            if (window.matchMedia("(max-width: 640px)").matches) {
              openPortfolioChat();
              return;
            }
            setIsWelcomeOpen((open) => !open);
          }}
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
                openPortfolioChat();
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
          <ToggleControl
            className="hud-utility hud-utility--popups"
            enabled={popupsEnabled}
            label={popupsEnabled ? "Disable checkpoint popups" : "Enable checkpoint popups"}
            tooltip={popupsEnabled ? "Hide checkpoint popups" : "Show checkpoint popups"}
            tooltipPosition="bottom"
            onToggle={onTogglePopups}
          >
            <ControlIcon name="popups" />
            <span>Popups</span>
          </ToggleControl>
          {children}
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
