import type { PortfolioSection } from "../types/portfolio";

// Replace these placeholders with your real details. The UI and obby labels
// automatically use this content.
export const portfolio: PortfolioSection[] = [
  {
    id: "about",
    kicker: "Checkpoint 01",
    title: "Hi, I’m Sreejita!",
    body: "I’m a curious builder who loves turning playful ideas into useful digital experiences. Welcome to my tiny corner of the internet.",
    color: "#ffd84d",
  },
  {
    id: "education",
    kicker: "Checkpoint 02",
    title: "Education",
    body: "Add your course, university, graduation year, and one sentence about what you focused on here.",
    color: "#ff7aa8",
  },
  {
    id: "experience",
    kicker: "Checkpoint 03",
    title: "Experience",
    body: "Add your role, organisation, dates, and the impact you made. A short, concrete achievement works best here.",
    color: "#55d6be",
  },
  {
    id: "projects",
    kicker: "Checkpoint 04",
    title: "Things I’ve built",
    body: "Feature two or three projects here. Explain the problem, what you made, and the part you’re most proud of.",
    links: [{ label: "View my GitHub", href: "https://github.com/" }],
    color: "#6fa8ff",
  },
  {
    id: "skills",
    kicker: "Checkpoint 05",
    title: "My toolkit",
    body: "React · TypeScript · JavaScript · HTML · CSS · Three.js — replace this list with the tools you actually enjoy using.",
    color: "#ff9c4a",
  },
  {
    id: "contact",
    kicker: "Finish!",
    title: "Let’s make something",
    body: "Thanks for playing! Add your email, LinkedIn, CV, and anything else you want visitors to find.",
    links: [{ label: "Say hello", href: "mailto:hello@example.com" }],
    color: "#b991ff",
  },
];
