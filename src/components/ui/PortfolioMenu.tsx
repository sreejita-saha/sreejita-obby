import { portfolio } from "../../data/portfolio";

type PortfolioMenuProps = {
  onClose: () => void;
  onSelectSection: (index: number) => void;
};

export function PortfolioMenu({ onClose, onSelectSection }: PortfolioMenuProps) {
  return (
    <div className="portfolio-menu">
      <button className="close" onClick={onClose} aria-label="Close portfolio">×</button>
      <p className="eyebrow">No jumping required</p>
      <h2>Sreejita’s portfolio</h2>
      <div className="menu-grid">
        {portfolio.map((section, index) => (
          <button key={section.id} onClick={() => onSelectSection(index)}>
            <span style={{ background: section.color }}>{String(index + 1).padStart(2, "0")}</span>
            <strong>{section.title}</strong>
            <small>{section.body}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
