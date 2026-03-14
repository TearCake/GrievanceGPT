<div align="center">
  <img src="https://img.shields.io/badge/Status-Hackathon_Prototype-FF6B2B?style=for-the-badge&logo=hackthebox&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/badge/Theme-Agentic_AI-1A3A6B?style=for-the-badge&logo=probot&logoColor=white" alt="Theme" />
  <img src="https://img.shields.io/badge/Model-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=googlebot&logoColor=white" alt="Model" />
</div>

<br>

<h1 align="center">GrievanceGPT</h1>
<h3 align="center">Your Voice. Filed. Followed Up. Automatically.</h3>

---

## 💡 About the Project

**GrievanceGPT** is an Agentic AI system built for the **Hack & Break 2026** competition under the **Agentic AI** theme. 

Millions of citizens face legitimate grievances (overcharged bills, broken infrastructure, RTI requests) but give up before filing because government portals are complex, bureaucratic, and jargon-heavy. 

GrievanceGPT entirely removes this barrier. A citizen simply types their problem in plain language. The AI agent:
1. **Understands & Classifies** the grievance type.
2. **Routes** it to the correct government portal (e.g., CPGRAMS, PGPortal, Consumer Forum).
3. **Drafts** a formal, legally appropriate complaint letter.
4. **Submits** the grievance and returns a tracking reference number.

This is a true demonstration of Agentic AI—planning, reasoning, and executing real-world actions with minimal human intervention.

---

## Demo
https://github.com/user-attachments/assets/cc6fc49b-c406-4187-93a7-3b2da73b5772

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend & AI Agent
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

---

## 🏛️ System Architecture

```mermaid
graph TD
    A[User types complaint in plain language] -->|JSON payload| B(Next.js Frontend)
    B -->|REST POST /api/grievance| C{FastAPI Backend}
    C -->|Prompt 1: Classify| D[Gemini 2.5 AI Model]
    D -->|JSON: Category & Facts| C
    C -->|Prompt 2: Draft| E[Gemini 2.5 AI Model]
    E -->|Formal Letter String| C
    C -->|Routing Logic| F((Select Govt Portal))
    F -->|Response payload| B
    B -->|User clicks Submit| G[Success UI + Reference Number]
```

---

## 🚀 How to Run Locally

This project is split into a Python backend and a Next.js frontend. You will need two terminals running simultaneously.

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- A Google Gemini API Key added to `backend/.env`

### 1. Start the Backend API (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*Runs on http://localhost:8000*

### 2. Start the Frontend UI (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:3000*

### 3. Usage
Open [http://localhost:3000](http://localhost:3000) in your browser. Type a sample complaint like:
> *"My electricity bill was double this month with no explanation. I usually pay ₹800 but got a bill of ₹2400."*

Click **Analyze with AI** and watch the agent classify, route, and draft the formal letter in seconds.
