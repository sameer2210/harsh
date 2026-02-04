AiVeda — Ayurvedic AI Chat Assistant
🌿 Project Overview

AiVeda is a modern AI-powered chat application that responds like an Ayurvedic doctor (Vaidya).
It blends classical Ayurvedic knowledge with Google Gemini AI to provide natural, context-aware wellness guidance through a clean, minimal chat interface.

## 🎥 Project Demo

![AiVeda Banner](/public/chatscreen.png)
https://aiveda.netlify.app/


### Preview
![Demo](/public/aiveda.gif)

### Full Walkthrough
[Watch Full Demo](/public/aiveda.mp4)


[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

The project focuses on:

Authentic Ayurvedic tone and terminology
Fast, lightweight frontend
Modular, scalable architecture
Secure AI integration

🧠 Core Philosophy

Ancient wisdom. Modern intelligence.

AiVeda is designed to simulate the consultation style of an Ayurvedic practitioner—focusing on Doshas (Vata, Pitta, Kapha), lifestyle balance, and holistic well-being rather than symptom-only answers.

🚀 Features

🧘 Ayurvedic-style AI responses (Vaidya tone)
💬 Minimal, distraction-free chat UI
⚡ Fast frontend powered by Vite
🧩 Modular React component structure
🔐 Centralized Gemini AI service layer
♻️ Easy to extend (profiles, history, auth)

🏗️ Project Architecture
AiVeda/
├── index.html # App entry HTML
├── package.json
├── vite.config.ts
├── .env.local # Gemini API key (not committed)
└── src/
├── index.tsx # React entry point
├── App.tsx # Root component
├── components/ # UI components
│ ├── ChatInterface.tsx
│ ├── MessageBubble.tsx
│ ├── Input.tsx
│ ├── Button.tsx
│ └── Sidebar.tsx
├── services/
│ └── geminiService.ts # Gemini AI integration
├── types.ts # Shared TypeScript types
├── constants.ts # App constants
└── metadata.json # App metadata

🧰 Technology Stack
Frontend

React + TypeScript
Vite (fast dev & build tool)
Modern component-based UI
AI
Google Gemini API
Prompt-engineered for Ayurvedic responses
Runtime
Node.js

npm

🔄 How It Works

1. User Interaction Flow
   User inputs query → Chat UI → Gemini Service → AI response → Message bubble

2. AI Response Strategy
   User question
   ↓
   System prompt (Ayurvedic doctor role)
   ↓
   Gemini AI reasoning
   ↓
   Structured, calm, Vaidya-style reply

🔐 Environment Setup

Create a .env.local file in the project root:

GEMINI_API_KEY=your_gemini_api_key_here

⚠️ Security Note
If exposing API calls in the browser, follow Vite conventions (VITE\_ prefix) or proxy requests through a backend for production.

🚀 Getting Started
Prerequisites

Node.js 16+ (LTS recommended)

npm

Installation
npm install

Run Development Server
npm run dev

Open:
👉 http://localhost:5173

📜 Available Scripts

npm run dev — start development server
npm run build — production build
npm run preview — preview production build

🌱 Ayurvedic AI Tone Rules (Design Principle)

AiVeda responses are designed to:
Avoid medical diagnosis claims
Use calming, advisory language
Reference Doshas & lifestyle balance
Encourage holistic well-being

Maintain respectful, traditional tone

🔒 Best Practices

Never commit .env.local
Keep AI logic centralized in geminiService.ts
Maintain small, reusable UI components
Extend via prompts, not hard-coded logic

🛣️ Future Enhancements

User profiles & Dosha history
Conversation persistence
Multi-language support
Auth + secure backend proxy
Ayurvedic diet & routine modules
Mobile-first UI refinement

🤝 Contributing

Fork the repository
Create a feature branch
Keep commits clean and focused
Submit a PR with a clear description

📄 License

No license included yet.
Add MIT or Apache 2.0 before public distribution.

👨‍💻 Developer

<div align="center">
Sameer Khan

Full Stack Developer (MERN)

sameerkhan2756@gmail.com

</div>
