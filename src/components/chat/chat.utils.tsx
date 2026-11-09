import { Fragment, type ReactNode } from "react";
import type { ChatSource } from "./chat.types";

const boldMarkdown = /(\*\*[^*]+\*\*)/g;

export function renderChatMessage(text: string): ReactNode {
  return text.split("\n").map((line, lineIndex, lines) => (
    <Fragment key={`${line}-${lineIndex}`}>
      {line
        .split(boldMarkdown)
        .map((part, partIndex) =>
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

  switch (source.title.toLowerCase()) {
    case "favourite project":
      return "projects";
    case "favourite internship":
      return "experience";
    case "hobbies":
    case "why software engineering":
      return "about";
  }

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

export function getPortfolioSectionLabel(sectionId: string) {
  const labels: Record<string, string> = {
    about: "About me",
    education: "Education",
    experience: "Experience",
    projects: "Projects",
    skills: "My toolkit",
  };

  return labels[sectionId] ?? "Portfolio section";
}
