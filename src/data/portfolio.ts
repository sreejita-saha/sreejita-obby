// This is the single place to edit checkpoint modal content.
// `content` appears in both the checkpoint modal and Portfolio overview.
import type { PortfolioSection } from "../types/portfolio";

export const portfolio: PortfolioSection[] = [
  {
    id: "about", kicker: "Checkpoint 01", title: "About Me :)",
    content: [
      { type: "paragraph", text: "I’m student and I'm figuring out what kind of developer I want to be. So far, I have found that I really enjoy making things that let me be creative and solving the messy problems that come up when real people use software. " },
      { type: "paragraph", text: "Outside of coursework, I like experimenting with web projects, game ideas, and anything that lets the artist in me thrive" }],
    image: { src: "/images/me wave.png", alt: "Sreejita waving", className: "modal-avatar" }, color: "#ffd84d",
  },
  {
    id: "education", kicker: "Checkpoint 02", title: "Education",
    content: [
      { type: "paragraph", text: "I’m studying Immersive Software Engineering at the University of Limerick. My course has given me experience with programming, databases, operating systems, artificial intelligence, cybersecurity, mobile apps and software testing." },
      { type: "paragraph", text: "I’m in the final year of the bachelor’s part of my degree. I’m still exploring the different areas of software engineering, but I know that I enjoy creating useful things and working through difficult problems." },
    ],
    color: "#ff7aa8",
  },
  {
    id: "experience", kicker: "Checkpoint 03", title: "Experience",
    content: [
      { type: "heading", text: "Fin by Salesforce — Product Engineering Intern" },
      { type: "paragraph", text: "June 2026 – August 2026" },
      { type: "paragraph", text: "During my internship, I worked on Fin Messenger and helped fix problems that customers were experiencing. I spent a lot of time understanding a large existing codebase, finding the causes of bugs and testing changes carefully." },
      { type: "paragraph", text: "I worked mainly on the web product, while also looking into issues affecting mobile. I also built a feature that allowed special notices to turn off automatically after a set amount of time." },
      { type: "paragraph", text: "This was my first experience working on a large production product, and it taught me a lot about debugging, teamwork and writing software for real users." },
      { type: "heading", text: "Cloudcards — Software Engineering Intern" },
      { type: "paragraph", text: "June 2025 – December 2025" },
      { type: "paragraph", text: "At Cloudcards, I built a desktop application for uploading large aviation datasets. The old upload process could be slow and difficult to use, especially when dealing with large folders." },
      { type: "paragraph", text: "I helped create a more reliable experience where users could pause, resume and track their uploads. I also worked with the operations team to understand what they needed and improve the application based on their feedback." },
      { type: "paragraph", text: "This project gave me experience building something from the beginning and seeing it used in a real working environment." },
    ],
    color: "#67c75c",
  },
  {
    id: "projects", kicker: "Checkpoint 04", title: "Things I’ve built",
    content: [
      { type: "heading", text: "Secure Messaging Platform" },
      { type: "paragraph", text: "For a university group project, I helped build a secure messaging platform with a desktop client and a web client. The system allowed users to register, log in and send messages securely." },
      { type: "paragraph", text: "I worked on the client, server and database parts of the project. I’m most proud of the security work, because we had to think carefully about encryption, user access and protecting messages." },
      { type: "heading", text: "Gym Workout Tracking App" },
      { type: "paragraph", text: "I built a native Android app for recording workouts. Users can keep track of their exercises, sets and progress in one place." },
      { type: "paragraph", text: "This project helped me understand mobile app development and how small design decisions can make an app easier to use." },
      { type: "heading", text: "System Hardware Monitor" },
      { type: "paragraph", text: "This is a Java tool that displays information about a computer’s hardware. It reads details about the system and presents them in a simple way." },
      { type: "paragraph", text: "I enjoyed this project because it helped me understand how software can communicate with the hardware underneath it." },
    ],
    links: [{ label: "View my GitHub", href: "https://github.com/sreejita-saha" }], color: "#6fa8ff",
  },
  {
    id: "skills", kicker: "Checkpoint 05", title: "My toolkit",
    content: [
      { type: "paragraph", text: "I’ve worked with a wide range of tools through university, internships and projects. I'm always happy to learn a new one." },
      { type: "heading", text: "Languages" },
      { type: "tags", items: ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Kotlin", "Swift", "Ruby", "SQL"] },
      { type: "heading", text: "Frameworks & platforms" },
      { type: "tags", items: ["React", "Ruby on Rails", "Flask", ".NET", "Blazor Hybrid", "Android development"] },
      { type: "heading", text: "Data & development tools" },
      { type: "tags", items: ["MySQL", "SQLite", "Git", "GitHub", "Linux", "Microsoft Azure"] },
    ],
    color: "#ff9c4a",
  },
  {
    id: "contact", kicker: "Finish!", title: "Yay!",
    content: [
      { type: "paragraph", text: "Thanks for making it to the end of my portfolio!" },
      { type: "paragraph", text: "You can find me through my email, LinkedIn or GitHub. My CV is also available below." },
    ],
    links: [
      { label: "Email: sreejita_saha@outlook.com", href: "mailto:sreejita_saha@outlook.com" },
      { label: "GitHub: sreejita-saha", href: "https://github.com/sreejita-saha" },
      { label: "LinkedIn: sreejita-s", href: "https://www.linkedin.com/in/sreejita-s" },
      { label: "CV", href: "/cv.pdf" },
    ],
    color: "#ffd769",
  },
];
