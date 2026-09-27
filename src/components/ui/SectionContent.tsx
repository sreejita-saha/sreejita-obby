import type { PortfolioContentBlock } from "../../types/portfolio";

type SectionContentProps = { content: readonly PortfolioContentBlock[] };

/** Renders the structured, editable body of a checkpoint modal. */
export function SectionContent({ content }: SectionContentProps) {
  return <div className="section-card__content">{content.map((block, index) => {
    const key = `${block.type}-${index}`;
    if (block.type === "heading") return <h3 className="section-card__heading" key={key}>{block.text}</h3>;
    if (block.type === "list") return <ul key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    if (block.type === "tags") return <div className="section-card__tags" key={key}>{block.items.map((item) => <span key={item}>{item}</span>)}</div>;
    return <p key={key}>{block.text}</p>;
  })}</div>;
}
