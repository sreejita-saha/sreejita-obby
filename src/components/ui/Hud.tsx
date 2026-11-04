import { portfolio } from "../../data/portfolio";
import { ControlIcon } from "./ControlIcon";
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
  return (
    <header className="hud">
      <a className="brand" href="#top" aria-label="Sreejita's Obby home">
        <img src="/images/mascot-logo.png" alt="Sreejita's Obby" />
      </a>
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
