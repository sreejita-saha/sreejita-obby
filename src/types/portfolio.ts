export type PortfolioSectionId = "about" | "education" | "experience" | "projects" | "skills" | "contact";

export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type PortfolioImage = { src: string; alt: string; className?: string };

export type PortfolioSection = {
  id: PortfolioSectionId;
  kicker: string;
  title: string;
  summary: string;
  content: PortfolioContentBlock[];
  links?: readonly PortfolioLink[];
  image?: PortfolioImage;
  color: string;
};
