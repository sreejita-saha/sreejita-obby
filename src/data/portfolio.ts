// Edit this file to update the content shown at each portfolio checkpoint.
import type {
  PortfolioContentBlock,
  PortfolioLink,
  PortfolioSection,
} from "../types/portfolio";

const paragraph = (text: string): PortfolioContentBlock => ({
  type: "paragraph",
  text,
});

const heading = (text: string): PortfolioContentBlock => ({
  type: "heading",
  text,
});

const tags = (...items: string[]): PortfolioContentBlock => ({
  type: "tags",
  items,
});

const link = (label: string, href: string): PortfolioLink => ({ label, href });

const project = (
  title: string,
  summary: string,
  details?: string,
): PortfolioContentBlock[] => [
  heading(title),
  paragraph(summary),
  ...(details ? [paragraph(details)] : []),
];

const projects = [
  ...project(
    "WhatSaS Secure Messaging Platform",
    "A secure messaging platform with desktop and web clients, where users can create accounts, log in, and send encrypted messages.",
    "I worked across the C++, Python, and JavaScript parts of the system, including authentication, end-to-end encryption, secure key management, and encrypted message storage. I was also responsible for designing and building the frontend, which was a great chance to work on both the technical and user-facing sides of a larger system.",
  ),
  ...project(
    "LaRo Beam",
    "A portable emergency communication device designed for situations where mobile networks may not be available.",
    "It uses LoRa mesh networking and GPS to support long-range messaging and location sharing. It also has a physical SOS feature that can be used without a phone. I worked on the prototype, the product design, and the 3D-printed enclosure. It was my first experience with 3D printing, and I really enjoyed seeing an idea become a physical object.",
  ),
  ...project(
    "Rep It Workout Tracking App",
    "A native Android app built with Kotlin to help people organise and track their workouts.",
    "Users can create workout sessions and record exercises, sets, and repetitions. I wanted to keep the app simple and useful, giving people an easy way to look back at their training and stay consistent.",
  ),
  ...project(
    "ISE Jobs Board",
    "A Python application based on the ISE course jobs board, built to manage students and available placement roles.",
    "The project includes an automated allocation algorithm that matches students to roles based on their preferences and placement constraints. It was an interesting problem because it needed to balance the needs of students, employers, and the course.",
  ),
  ...project(
    "Linux IPC Driver",
    "A Linux kernel driver written in C for secure inter-process communication.",
    "The project included encryption and synchronisation using mutexes and semaphores. It gave me the chance to work closer to the operating system level and understand how software behaves beyond the applications we use every day.",
  ),
  ...project(
    "System Hardware Monitor",
    "A Java desktop application that displays real-time laptop hardware information.",
    "Using native libraries and a Java Swing interface, it shows information such as CPU, memory, storage, and general system details. This project helped me learn more about connecting Java applications with lower-level system information.",
  ),
  ...project(
    "Java Swing Dino Game",
    "An interactive Dino Game that I built with Java and Java Swing.",
    "Building it gave me a hands-on way to apply object-oriented programming, event-driven UI development, and game logic. I enjoyed breaking the experience into smaller components and making the desktop game respond to player input.",
  ),
  ...project(
    "This Website :)",
    "An interactive portfolio inspired by Roblox obbies, where visitors move through checkpoints to explore my education, experience, and projects.",
    "I built it with React, TypeScript, Three.js, and React Three Fiber. I was inspired by [Bruno Simon’s portfolio](https://bruno-simon.com/) and [Jesse Zhou’s website](https://www.jesse-zhou.com/), especially the way they make browsing a portfolio feel more like an experience than simply reading a page. Building this taught me a lot about 3D models, interaction design, and making the web feel a little more playful.",
  ),
];

export const portfolio: PortfolioSection[] = [
  {
    id: "about",
    kicker: "Checkpoint 01",
    title: "About Me :)",
    content: [
      paragraph(
        "I’m a final-year Immersive Software Engineering student who enjoys building useful things and finding creative ways to solve problems.",
      ),
      paragraph(
        "What I enjoy most about software is taking an idea that starts out messy or unclear and turning it into something people can actually use. I like the mix of problem-solving, creativity, and teamwork that comes with building software.",
      ),
      paragraph(
        "Outside of university, I enjoy experimenting with web projects, game ideas, and anything interactive. I’m especially drawn to projects that have a bit of personality and make people want to explore.",
      ),
    ],
    image: {
      src: "/images/me wave.png",
      alt: "Sreejita waving",
      className: "modal-avatar",
    },
    color: "#ffd84d",
  },
  {
    id: "education",
    kicker: "Checkpoint 02",
    title: "Education",
    content: [
      paragraph(
        "I study Immersive Software Engineering at the University of Limerick, where I am currently completing the final year of the bachelor’s stage of my degree.",
      ),
      paragraph(
        "My course has given me experience across a wide range of areas, including programming, databases, operating systems, artificial intelligence, cybersecurity, mobile development, software testing, project management and much more.",
      ),
      paragraph(
        "I have enjoyed getting to try different parts of software engineering through both coursework and projects. The variety has helped me become comfortable learning new tools, working through unfamiliar problems, and building things from the ground up.",
      ),
      paragraph(
        "I am also a recipient of the Transact Campus Scholarship.",
      ),
    ],
    color: "#ff7aa8",
  },
  {
    id: "experience",
    kicker: "Checkpoint 03",
    title: "Experience",
    content: [
      heading("Fin from Salesforce — Product Engineering Intern"),
      paragraph("June 2026 – August 2026"),
      paragraph(
        "During my internship, I worked on Fin Messenger and helped investigate issues that customers were experiencing. A big part of the role was learning how to navigate a large existing codebase, understand what was happening, and trace problems back to their cause.",
      ),
      paragraph(
        "I worked mainly on the web product, while also looking into issues affecting mobile. I spent time debugging, testing changes carefully, and making sure fixes worked as expected before they reached users.",
      ),
      paragraph(
        "I also built a feature that allowed time-sensitive notices to turn off automatically after a set period. This was my first experience working on a large production product, and it taught me a lot about debugging, collaboration, and building software for real people. It was very rewarding to know that my work helped solve problems customers were actually facing.",
      ),

      heading("Cloudcards — Software Engineering Intern"),
      paragraph("June 2025 – December 2025"),
      paragraph(
        "At Cloudcards, I helped build a desktop application for uploading large aviation datasets. The existing upload process could be slow and difficult to use, especially when users were dealing with large folders.",
      ),
      paragraph(
        "I worked on creating a more reliable experience where users could pause, resume, and track their uploads. I also worked with the operations team to understand their workflow and improve the application based on what would actually make their jobs easier.",
      ),
      paragraph(
        "This project gave me the chance to help build something from the beginning and then see it used in a real working environment. It was a really valuable experience, especially early in my degree, and it showed me how much I enjoy building practical tools that solve everyday problems.",
      ),
    ],
    color: "#67c75c",
  },
  {
    id: "projects",
    kicker: "Checkpoint 04",
    title: "Things I’ve built",
    content: projects,
    links: [link("View my GitHub", "https://github.com/sreejita-saha")],
    color: "#6fa8ff",
  },
  {
    id: "skills",
    kicker: "Checkpoint 05",
    title: "My toolkit",
    content: [
      paragraph(
        "I’ve used these tools through university, internships, and personal projects. I enjoy learning new technologies when a project calls for them, so this list is always growing.",
      ),
      heading("Languages"),
      tags(
        "Java",
        "C",
        "C++",
        "C#",
        "Ruby",
        "Python",
        "TypeScript",
        "JavaScript",
        "Kotlin",
      ),
      heading("Frameworks & libraries"),
      tags("Ruby on Rails", "Flask", "React", ".NET", "Blazor Hybrid", "WPF"),
      heading("Tools & platforms"),
      tags(
        "Git/GitHub",
        "Linux",
        "Azure",
        "AWS",
        "Postman",
        "Vercel",
        "Firebase",
        "Supabase",
      ),
    ],
    color: "#ff9c4a",
  },
  {
    id: "contact",
    kicker: "Finish!",
    title: "Yay!",
    content: [
      paragraph("Thanks for making it to the end of my portfolio!"),
      paragraph(
        "If you would like to chat about an opportunity, a project, or anything software-related, I would love to hear from you. You can find my email, LinkedIn, GitHub, and CV below.",
      ),
    ],
    links: [
      link(
        "Email: sreejita_saha@outlook.com",
        "mailto:sreejita_saha@outlook.com",
      ),
      link("GitHub: sreejita-saha", "https://github.com/sreejita-saha"),
      link("LinkedIn: sreejita-s", "https://www.linkedin.com/in/sreejita-s"),
      link("CV", "doc/Sreejita_Saha_CV.pdf"),
    ],
    color: "#f2a7fc",
  },
];

// Credits are intentionally separate from the playable checkpoint sequence.
export const creditsSection: PortfolioSection = {
  id: "credits",
  kicker: "Credits",
  title: "With a little help",
  content: [
    paragraph(
      "I built this portfolio with Codex. It helped me explore ideas, solve problems, and bring the project to life through code.",
    ),
    paragraph(
      "I was inspired by [Bruno Simon’s portfolio](https://bruno-simon.com/) and [Jesse Zhou’s website](https://www.jesse-zhou.com/).",
    ),
    heading("3D model credits"),
    paragraph(
      "I adapted and compressed the following 3D models for web use. Each is licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).",
    ),
    paragraph(
      "[Roblox-Noob](https://skfb.ly/orzpY) by Roblox, [Torii - Arche Japonaise](https://skfb.ly/6xTKP) by etifontaine, [Low poly Tree](https://skfb.ly/6zIw7) by 1342345234, [Laptop V2](https://skfb.ly/oq7NW) by FishyBusiness, [3D book and pencil object](https://sketchfab.com/3d-models/3d-book-and-pencil-object-5746a5ac7be4442f9e6a685104c993ff) by MZA3DDesign, and [Low Poly Grass](https://skfb.ly/onvVP) by Ruben Roseleth.",
    ),
  ],
  color: "#b991ff",
};
