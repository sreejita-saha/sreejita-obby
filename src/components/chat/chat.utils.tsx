import { Fragment, type ReactNode } from "react";
import type { ChatSource } from "./chat.types";

const boldMarkdown = /(\*\*[^*]+\*\*)/g;

export function renderChatMessage(text: string): ReactNode {
  return text.split("\n").map((line, lineIndex, lines) => (
    <Fragment key={`${line}-${lineIndex}`}>
      {line.split(boldMarkdown).map((part, partIndex) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={partIndex}>{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={partIndex}>{part}</Fragment>
        ),
      )}
      {lineIndex < lines.length - 1 && <br />}
    </Fragment>
  ));
}

export function getPortfolioSectionId(source: ChatSource) {
  if (source.source === "projects.md") return "projects";
  if (source.source === "education.md") return "education";

  switch (source.metadata?.section?.toLowerCase()) {
    case "profile":
      return "about";
    case "education":
      return "education";
    case "experience":
      return "experience";
    case "technical skills":
      return "skills";
    case "selected projects":
      return "projects";
    default:
      return undefined;
  }
}
