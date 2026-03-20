# 🤖 AI Dev Tools — Code Assistant + Prompt Generator

An AI-powered full-stack developer toolkit that helps you review code, analyze complexity, and generate professional prompts — all in one place.

🔗 **Live Demo**: [https://codeassistant-2m4o.onrender.com/](https://codeassistant-2m4o.onrender.com/)

---

## 📌 About the Project

This project started as a simple code review tool and grew into a complete AI developer toolkit. The idea was to build something that a developer would actually use daily — not just a demo project.

It uses **Google Gemini AI** on the backend to analyze code and generate content, wrapped in a clean **VS Code-inspired UI** that supports dark and light mode.

There are three main tools packed into one app:

**1. AI Code Review** — paste any code snippet and get instant feedback organized into three sections: bugs and issues, performance improvements, and a fully refactored clean version of your code.

**2. Big-O Complexity Analyzer** — automatically calculates the time and space complexity of your code with a detailed breakdown of loops, recursion, and data structure operations.

**3. Universal Prompt Generator** — takes any vague idea in any language (English, Hindi, Spanish, etc.) and transforms it into a clear, professional AI prompt. Works for any field — coding, healthcare, marketing, legal, and more.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, CodeMirror, React Markdown |
| **Backend** | Java 17, Spring Boot 3.1.5 |
| **AI** | Google Gemini API (gemini-flash-latest) |
| **Deployment** | Render (Backend + Frontend) |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+, Maven 3.8+, React js
- Google Gemini API key → [Get one free](https://aistudio.google.com/app/apikey)

### Run Locally

```bash
# Backend
cd backend
# Set your API key
set GEMINI_API_KEY=your_key      # Windows
mvn spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
npm start
```

Open `http://localhost:3000`

---

## 👨‍💻 Author

**Abhishek**  
[GitHub](https://github.com/abhi9146) · [LinkedIn](https://www.linkedin.com/in/abhisheksunkarwad/)
