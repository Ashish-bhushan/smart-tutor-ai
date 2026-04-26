const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "llama3.2:latest"; 

app.post("/api/chat", async (req, res) => {
  const { messages, subject, level } = req.body;

  const systemPrompt = `You are TutorAI, an expert educational tutor specializing in ${subject || "General Knowledge"}. Adapt your explanations for a ${level || "beginner"} student. Be encouraging, clear, and pedagogically effective. Use examples when helpful. Use **bold** for key terms. Keep responses focused (2-4 paragraphs max). If asked for practice problems, provide one clear problem and wait for the student's attempt before revealing the answer.`;

  const ollamaMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: ollamaMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: "Ollama error: " + err });
    }

    const data = await response.json();
    const reply = data.message?.content || "No response from model.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not connect to Ollama. Make sure it is running with: ollama serve" });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(3001, () => {
  console.log("✅ TutorAI backend running at http://localhost:3001");
});