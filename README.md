# Sreejita's Obby Portfolio

I built this interactive 3D portfolio around the idea of a Roblox obby. Instead of scrolling through a traditional portfolio, visitors move through an obstacle course and unlock checkpoints to learn about my education, experience, skills, and projects.

I also built an AI assistant that uses retrieval-augmented generation (RAG) to answer questions about my background using my portfolio content.

## Built with

- React, TypeScript, Vite, and CSS
- Three.js, React Three Fiber, and Drei for the interactive 3D experience
- Google Gemini API for the AI assistant
- Supabase for RAG vector search, ratings, feedback, and rate limiting
- Vercel Serverless Functions for the chat API
- Vercel for deployment, analytics, and performance monitoring

## Features

- I created a playable 3D obstacle course with checkpoint-based portfolio sections.
- I added keyboard and touch controls, checkpoint respawning, and a full portfolio overview for accessible browsing.
- The RAG-based AI assistant retrieves relevant portfolio information and shows the sources used in its answers.
- I designed interactive 3D scene elements, custom avatar models, and a responsive interface.
- Visitors can leave a rating and feedback.

## Inspiration and credits

I was inspired by [Bruno Simon's portfolio](https://bruno-simon.com/) and [Jesse Zhou's website](https://www.jesse-zhou.com/), as well as the playful checkpoint structure of Roblox obbies.