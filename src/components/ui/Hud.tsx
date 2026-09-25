import { portfolio } from "../../data/portfolio";

type HudProps = {
  checkpoint: number;
  onOpenPortfolio: () => void;
};

export function Hud({ checkpoint, onOpenPortfolio }: HudProps) {
  return (
    <header className="hud">
      <a className="brand" href="#top">SREEJITA’S OBBY</a>
      <div className="progress" aria-label={`${checkpoint + 1} of ${portfolio.length} checkpoints`}>
        {portfolio.map((section, index) => <i key={section.id} className={index <= checkpoint ? "done" : ""} />)}
      </div>
      <button className="menu-button" onClick={onOpenPortfolio}>Portfolio</button>
    </header>
  );
}
