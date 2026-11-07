import type { ReactNode } from "react";
import type { PortfolioContentBlock } from "../../types/portfolio";

const markdownLink = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

function renderInlineLinks(text: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markdownLink.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <a
        key={`${match[2]}-${match.index}`}
        className="inline-link"
        href={match[2]}
        target="_blank"
        rel="noreferrer"
      >
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length ? nodes : text;
}

type SectionContentProps = {
  content: readonly PortfolioContentBlock[];
  leadingImage?: { src: string; alt: string; className?: string };
};

/** Renders the structured, editable body of a checkpoint modal. */
export function SectionContent({ content, leadingImage }: SectionContentProps) {
  return (
    <div className="section-card__content">
      {leadingImage && (
        <img
          className={leadingImage.className}
          src={leadingImage.src}
          alt={leadingImage.alt}
        />
      )}
      {content.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading")
          return (
            <h3 className="section-card__heading" key={key}>
              {block.text}
            </h3>
          );
        if (block.type === "list")
          return (
            <ul key={key}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        if (block.type === "tags")
          return (
            <div className="section-card__tags" key={key}>
              {block.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          );
        return <p key={key}>{renderInlineLinks(block.text)}</p>;
      })}
    </div>
  );
}
