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
    "A secure messaging platform with desktop and web clients where users can register, log in and send encrypted messages.",
    "I worked across the C++, Python and JavaScript parts of the system, including end-to-end encryption, authentication, secure key management and encrypted message storage. I was also primary frontend designer and developer of this project.",
  ),
  ...project(
    "LaRo Beam",
    "A portable off-grid emergency communication device designed for situations where mobile networks may not be available.",
    "It uses LoRa mesh networking and GPS for long-range communication and location sharing, with a physical SOS feature that can work without a phone. I also worked on prototyping, designing, and 3D printing the device enclosure. This was my first time 3D printing and I really enjoyed the process.",
  ),
  ...project(
    "Rep It Workout Tracking App",
    "A native Android app built with Kotlin that helps users organise and track their workouts. Users can create workout sessions and record exercises, sets and repetitions, giving them a simple way to keep track of their training.",
  ),
  ...project(
    "ISE Jobs Board",
    "A Python application based on the ISE course jobs board, built to manage students and available placement roles. It includes an automated allocation algorithm that assigns students to roles based on their preferences and different placement constraints.",
  ),
  ...project(
    "Linux IPC Driver",
    "A Linux kernel driver written in C for secure inter-process communication. The project included encryption and synchronisation using mutexes and semaphores, and gave me experience working closer to the operating system level.",
  ),
  ...project(
    "System Hardware Monitor",
    "A Java desktop application that uses native libraries to analyse and display real-time laptop hardware information. It displays information such as CPU, memory, storage and general system details through a Java Swing interface.",
  ),
  ...project(
    "This website :)",
    "An gamified portfolio like Roblox obbies. Users move through different checkpoints to explore my education, experience and projects.",
    "I built it using React, TypeScript, Three.js and React Three Fiber. I was inspired by [Bruno Simon’s portfolio](https://bruno-simon.com/) and [Jesse Zhou’s website](https://www.jesse-zhou.com/), especially how they use 3D and game-like ideas to make their portfolios more interactive. While building it, I learned a lot about working with 3D models and creating interactive web experiences, and I really enjoyed making it.",
  ),
];

export const portfolio: PortfolioSection[] = [
  {
    id: "about",
    kicker: "Checkpoint 01",
    title: "About Me :)",
    content: [
      paragraph(
        "I’m a student figuring out what kind of developer I want to be. I enjoy making creative things and solving the messy problems that come up when real people use software.",
      ),
      paragraph(
        "Outside of coursework, I like experimenting with web projects, game ideas, and anything that lets the artist in me thrive.",
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
        "I’m studying Immersive Software Engineering (ISE) at the University of Limerick. My course has given me experience with programming, databases, operating systems, artificial intelligence, cybersecurity, mobile apps, software testing, and much more.",
      ),
      paragraph(
        "I’m in the final year of the bachelor’s part of my degree. I’m still exploring the different areas of software engineering, but I know that I enjoy creating useful things and working through difficult problems.",
      ),
      paragraph("I am a recipient of the Transact Campus Scholarship."),
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
        "During my internship, I worked on Fin Messenger and helped fix problems that customers were experiencing. I spent a lot of time understanding a large existing codebase, finding the causes of bugs, and testing changes carefully.",
      ),
      paragraph(
        "I worked mainly on the web product, while also looking into issues affecting mobile. I also built a feature that allowed special notices to turn off automatically after a set amount of time.",
      ),
      paragraph(
        "This was my first experience working on a large production product, and it taught me a lot about debugging, teamwork, and writing software for real users. Being able to solve customers’ issues was a very rewarding feeling :D",
      ),
      heading("Cloudcards — Software Engineering Intern"),
      paragraph("June 2025 – December 2025"),
      paragraph(
        "At Cloudcards, I built a desktop application for uploading large aviation datasets. The old upload process could be slow and difficult to use, especially when dealing with large folders.",
      ),
      paragraph(
        "I helped create a more reliable experience where users could pause, resume, and track their uploads. I also worked with the operations team to understand what they needed and improve the application based on their feedback.",
      ),
      paragraph(
        "This project gave me experience building something from the beginning and seeing it used in a real working environment. I was very happy with the work I was able to achieve as a first year.",
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
        "I’ve worked with a wide range of tools through university, internships, and projects. I’m always happy to learn a new one.",
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
        "You can find me through my email, LinkedIn, or GitHub. My CV is also available below.",
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
      "I built this portfolio using Codex. I really enjoyed exploring ideas, solving problems, and bringing the project to life through code with its help.",
    ),
    paragraph(
      "I was inspired by [Bruno Simon’s portfolio](https://bruno-simon.com/) and [Jesse Zhou’s website](https://www.jesse-zhou.com/)",
    ),
    heading("3D model credits"),
    paragraph(
      "I adapted and compressed the following 3D models for web use. Each is licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).",
    ),
    paragraph("[Roblox-Noob](https://skfb.ly/orzpY) by Roblox,  [Torii - Arche Japonaise](https://skfb.ly/6xTKP) by etifontaine, [Low poly Tree](https://skfb.ly/6zIw7) by 1342345234, [Laptop V2](https://skfb.ly/oq7NW) by FishyBusiness, [3D book and pencil object](https://sketchfab.com/3d-models/3d-book-and-pencil-object-5746a5ac7be4442f9e6a685104c993ff) by MZA3DDesign, [3D book and pencil object](https://sketchfab.com/3d-models/3d-book-and-pencil-object-5746a5ac7be4442f9e6a685104c993ff) by MZA3DDesign, [Low Poly Grass](https://skfb.ly/onvVP) by Ruben Roseleth."),
  ],
  color: "#b991ff",
};
