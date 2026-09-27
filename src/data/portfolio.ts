// This is the single place to edit checkpoint modal content.
// `summary` appears in the Portfolio menu; `content` appears in the modal.
import type { PortfolioSection } from "../types/portfolio";

export const portfolio: PortfolioSection[] = [
  {
    id: "about", kicker: "Checkpoint 01", title: "A Little About Me :)",
    summary: "A curious builder turning playful ideas into useful digital experiences.",
    content: [{ type: "paragraph", text: "I’m studying Immersive Software Engineering and figuring out what kind of developer I want to be. \n So far, I’ve found that I really enjoy making things that let me be creative and solving the messy problems that come up when real people use software. Outside of coursework, I like experimenting with web projects, game ideas, and anything that lets the artist in me thrive" }],
    image: { src: "/images/me wave.png", alt: "Sreejita waving", className: "modal-avatar" }, color: "#ffd84d",
  },
  {
    id: "education", kicker: "Checkpoint 02", title: "Education",
    summary: "I am a 3rd year Immersive Software Engineering [ISE] student at the Univeristy of Limerick. I am in my final year for my bachelor's.",
    content: [{ type: "paragraph", text: "I am a 3rd year Immersive Software Engineering [ISE] student at the Univeristy of Limerick. I am in my final year for my bachelor's. \n As part of my course, I have studied Computer Architecture, Object-Oriented Programming, Data Structures & Algorithms, Operating Systems, Mathematics, Relational Databases, Artificial Intelligence, Software Testing, Human-Computer Interaction, Computer Networks & Cybersecurity, Mobile App Development, Systems Thinking" }], color: "#ff7aa8",
  },
  {
    id: "experience", kicker: "Checkpoint 03", title: "Experience",
    summary: "Roles, organisations, and the impact you made.",
    content: [{ type: "paragraph", text: "Add your role, organisation, dates, and the impact you made. A short, concrete achievement works best here." }], color: "#67c75c",
  },
  {
    id: "projects", kicker: "Checkpoint 04", title: "Things I’ve built",
    summary: "A few projects, the problems they solve, and what you made.",
    content: [{ type: "paragraph", text: "Feature two or three projects here. Explain the problem, what you made, and the part you’re most proud of." }],
    links: [{ label: "View my GitHub", href: "https://github.com/" }], color: "#6fa8ff",
  },
  {
    id: "skills", kicker: "Checkpoint 05", title: "My toolkit",
    summary: "The technologies and tools I enjoy using.",
    content: [
      { type: "paragraph", text: "Replace this list with the tools you actually enjoy using." },
      { type: "list", items: ["React", "TypeScript", "JavaScript", "HTML & CSS", "Three.js"] },
    ],
    color: "#ff9c4a",
  },
  {
    id: "contact", kicker: "Finish!", title: "Let’s make something",
    summary: "Ways to get in touch and keep in touch.",
    content: [{ type: "paragraph", text: "Thanks for playing! Add your email, LinkedIn, CV, and anything else you want visitors to find." }],
    links: [{ label: "Say hello", href: "mailto:hello@example.com" }], color: "#f4c542",
  },
];
