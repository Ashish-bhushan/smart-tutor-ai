# ✦ TutorAI — Local AI Tutor (Ollama + React)

TutorAI is a full-stack AI tutoring app that runs locally using Ollama.
It helps students learn subjects like Math, Physics, CS, and more with adaptive explanations.

---

## 🚀 Features

* 🎯 Subject-based learning (Math, Physics, Chemistry, etc.)
* 📊 Level selection (Beginner → Advanced)
* 💬 Chat-based AI tutor
* ⚡ Fast local AI using Ollama
* 🧠 Smart teaching-style responses
* 🎨 Clean modern UI

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Axios
* CSS

### Backend

* Node.js
* Express
* Ollama API

---

## 📂 Project Structure

```
TutorAI/
│
├── backend/
│   └── server.js
│
├── frontend/
│   ├── App.jsx
│   ├── main.jsx
│   ├── app.css
│   └── index.css
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Install Ollama

Download from: https://ollama.com

Run:

```
ollama serve
```

Pull model:

```
ollama run llama3.2
```

---

### 2. Backend Setup

```
cd backend
npm install
node server.js
```

Backend runs at:

```
http://localhost:3001
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔌 API

### POST /api/chat

Request:

```
{
  "messages": [{ "role": "user", "content": "Explain gravity" }],
  "subject": "Physics",
  "level": "Beginner"
}
```

Response:

```
{
  "reply": "Gravity is **a force** that attracts objects..."
}
```

---

### GET /api/health

```
{ "status": "ok" }
```

---

## 🧠 How It Works

1. User sends a question
2. Backend adds a system prompt
3. Request goes to Ollama
4. AI responds as a tutor
5. UI displays response

---

## 💡 Example Prompts

* Explain derivatives
* What is recursion?
* Give me a practice problem
* Explain DNA replication

---

## ⚠️ Common Issues

### Backend not working

Run:

```
node server.js
```

### Ollama not working

Run:

```
ollama serve
```

### No model response

Run:

```
ollama run llama3.2
```

---

## ✨ Future Improvements

* Voice input
* Chat history
* Authentication
* Deployment

---
