import { useState, useRef, useEffect } from "react";
import axios from "axios";

const SUBJECTS = [
  { key: "Math",      label: "Mathematics",       icon: "🔢", color: "#6C47FF", bg: "#EEE9FF" },
  { key: "Physics",   label: "Physics",            icon: "⚛",  color: "#1D9E75", bg: "#E1F5EE" },
  { key: "Chemistry", label: "Chemistry",           icon: "🧪", color: "#D85A30", bg: "#FAECE7" },
  { key: "Biology",   label: "Biology",             icon: "🌿", color: "#639922", bg: "#EAF3DE" },
  { key: "History",   label: "History",             icon: "📜", color: "#BA7517", bg: "#FAEEDA" },
  { key: "English",   label: "English",             icon: "✍️", color: "#D4537E", bg: "#FBEAF0" },
  { key: "CS",        label: "Computer Science",    icon: "💻", color: "#378ADD", bg: "#E6F1FB" },
];

const SUGGESTIONS = {
  Math:      ["Explain derivatives", "What is integration?", "Give me a practice problem"],
  Physics:   ["Explain Newton's laws", "What is quantum mechanics?", "Solve a motion problem"],
  Chemistry: ["Explain chemical bonds", "What is the periodic table?", "Balance an equation"],
  Biology:   ["Explain DNA replication", "What is photosynthesis?", "Describe cell division"],
  History:   ["French Revolution summary", "Causes of WW1", "Important 1945 events"],
  English:   ["How to write a thesis", "Explain metaphors", "Give me a grammar quiz"],
  CS:        ["Explain recursion", "What is Big O notation?", "How does sorting work?"],
};

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{p}</strong> : p
  );
}

export default function App() {
  const [subject, setSubject]     = useState(SUBJECTS[0]);
  const [level, setLevel]         = useState("Beginner");
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [sidebarOpen, setSidebar] = useState(false);
  const endRef  = useRef(null);
  const taRef   = useRef(null);

  const welcome = (sub, lvl) =>
    `Hi! I'm your **AI Tutor**. Ask me anything about **${sub.label}** — I'll explain concepts, solve problems, and quiz you at a **${lvl}** level. What would you like to learn? 🎯`;

  useEffect(() => {
    setMessages([{ role: "assistant", content: welcome(subject, level) }]);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const switchSubject = (s) => {
    setSubject(s);
    setSidebar(false);
    setMessages([{ role: "assistant", content: welcome(s, level) }]);
  };

  const switchLevel = (l) => {
    setLevel(l);
    setMessages([{ role: "assistant", content: welcome(subject, l) }]);
  };

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    const newMessages = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3001/api/chat", {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        subject: subject.label,
        level,
      });
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages([...newMessages, {
        role: "assistant",
        content: "❌ **Could not reach the backend.** Make sure both `ollama serve` and `node server.js` are running.",
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
      {/* HEADER */}
      <header style={{
        background:"rgba(255,255,255,0.75)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(108,71,255,0.13)",
        height:64, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 1.5rem",
        position:"sticky", top:0, zIndex:50, flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* hamburger on mobile */}
          <button onClick={() => setSidebar(!sidebarOpen)} style={{
            display:"none", background:"none", border:"none", cursor:"pointer",
            fontSize:20, padding:4,
            ["@media(max-width:768px)"]: { display:"block" }
          }} className="md:hidden">☰</button>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#6C47FF,#A77BFF)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontSize:18,
          }}>✦</div>
          <span className="syne" style={{ fontWeight:700, fontSize:20, letterSpacing:"-0.3px", color:"#0D0D14" }}>
            Tutor<span style={{ color:"#9B7FFF" }}>AI</span>
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{
            background:"#EEE9FF", color:"#6C47FF", fontSize:11,
            fontWeight:700, padding:"4px 10px", borderRadius:999,
            letterSpacing:"0.5px", textTransform:"uppercase"
          }}>Ollama Local</span>
          <div style={{
            width:32, height:32, borderRadius:"50%",
            background:"linear-gradient(135deg,#6C47FF,#A77BFF)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontSize:12, fontWeight:700,
          }} className="syne">YO</div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* SIDEBAR */}
        <aside style={{
          width:260, background:"rgba(255,255,255,0.72)",
          backdropFilter:"blur(16px)",
          borderRight:"1px solid rgba(108,71,255,0.12)",
          display:"flex", flexDirection:"column",
          padding:"1.5rem 1rem", gap:"1.5rem",
          overflowY:"auto", flexShrink:0,
        }} className="hidden md:flex">
          <SidebarContent
            subjects={SUBJECTS} subject={subject} switchSubject={switchSubject}
            levels={LEVELS} level={level} switchLevel={switchLevel}
          />
        </aside>

        {/* mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{
            position:"fixed", inset:0, zIndex:100,
            background:"rgba(0,0,0,0.3)", backdropFilter:"blur(4px)",
          }} onClick={() => setSidebar(false)}>
            <aside style={{
              width:260, height:"100%",
              background:"rgba(255,255,255,0.97)",
              display:"flex", flexDirection:"column",
              padding:"1.5rem 1rem", gap:"1.5rem",
              overflowY:"auto",
            }} onClick={e => e.stopPropagation()}>
              <SidebarContent
                subjects={SUBJECTS} subject={subject} switchSubject={switchSubject}
                levels={LEVELS} level={level} switchLevel={switchLevel}
              />
            </aside>
          </div>
        )}

        {/* CHAT */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* subject bar */}
          <div style={{
            padding:"1rem 1.75rem 0.5rem",
            display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap",
            flexShrink:0,
          }}>
            <span className="syne" style={{ fontSize:18, fontWeight:700, color:"#0D0D14", letterSpacing:"-0.3px" }}>
              {subject.icon} {subject.label}
            </span>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {(SUGGESTIONS[subject.key] || []).map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  background:"white", border:"1px solid rgba(108,71,255,0.15)",
                  color:"#6B6880", fontSize:12, padding:"5px 12px",
                  borderRadius:999, cursor:"pointer", transition:"all 0.15s",
                  fontFamily:"'DM Sans',sans-serif",
                }}
                  onMouseOver={e => { e.target.style.borderColor="#6C47FF"; e.target.style.color="#6C47FF"; e.target.style.background="#EEE9FF"; }}
                  onMouseOut={e => { e.target.style.borderColor="rgba(108,71,255,0.15)"; e.target.style.color="#6B6880"; e.target.style.background="white"; }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"1rem 1.75rem", display:"flex", flexDirection:"column", gap:16 }}>
            {messages.map((m, i) => (
              <MessageBubble key={i} msg={m} subject={subject} />
            ))}
            {loading && <TypingBubble />}
            <div ref={endRef} />
          </div>

          {/* input */}
          <div style={{
            padding:"1rem 1.75rem 1.25rem",
            background:"rgba(255,255,255,0.75)", backdropFilter:"blur(16px)",
            borderTop:"1px solid rgba(108,71,255,0.12)", flexShrink:0,
          }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
              <textarea
                ref={taRef}
                value={input}
                onChange={e => { setInput(e.target.value); autoResize(e); }}
                onKeyDown={handleKey}
                placeholder="Ask a question, request an explanation, or try a problem…"
                rows={1}
                style={{
                  flex:1, border:"1.5px solid rgba(108,71,255,0.2)",
                  borderRadius:14, padding:"12px 16px", fontSize:14,
                  fontFamily:"'DM Sans',sans-serif", color:"#0D0D14",
                  background:"white", outline:"none", resize:"none",
                  minHeight:46, maxHeight:120, lineHeight:1.5, transition:"border-color 0.18s, box-shadow 0.18s",
                }}
                onFocus={e => { e.target.style.borderColor="#6C47FF"; e.target.style.boxShadow="0 0 0 3px rgba(108,71,255,0.1)"; }}
                onBlur={e => { e.target.style.borderColor="rgba(108,71,255,0.2)"; e.target.style.boxShadow="none"; }}
              />
              <button onClick={() => send()} disabled={loading || !input.trim()} style={{
                width:46, height:46, borderRadius:13,
                background: (loading || !input.trim()) ? "#C4B8FF" : "linear-gradient(135deg,#6C47FF,#9B7FFF)",
                border:"none", cursor: (loading || !input.trim()) ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.18s", flexShrink:0,
                boxShadow: (loading || !input.trim()) ? "none" : "0 4px 16px rgba(108,71,255,0.3)",
              }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ subjects, subject, switchSubject, levels, level, switchLevel }) {
  return (
    <>
      <div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#A8A6B8", padding:"0 8px", marginBottom:4 }}>Subjects</div>
        {subjects.map(s => (
          <button key={s.key} onClick={() => switchSubject(s)} style={{
            display:"flex", alignItems:"center", gap:10, padding:"9px 10px",
            borderRadius:12, cursor:"pointer", fontSize:13.5,
            fontWeight: s.key === subject.key ? 500 : 400,
            color: s.key === subject.key ? s.color : "#6B6880",
            background: s.key === subject.key ? s.bg : "transparent",
            border:"none", width:"100%", textAlign:"left",
            transition:"all 0.15s", fontFamily:"'DM Sans',sans-serif",
          }}>
            <span style={{
              width:28, height:28, borderRadius:8,
              background: s.bg, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:13, flexShrink:0,
            }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#A8A6B8", padding:"0 8px", marginBottom:8 }}>Level</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {levels.map(l => (
            <button key={l} onClick={() => switchLevel(l)} style={{
              padding:"8px 14px", borderRadius:999, fontSize:13,
              fontWeight: l === level ? 600 : 400,
              background: l === level ? "#6C47FF" : "white",
              color: l === level ? "white" : "#6B6880",
              border: l === level ? "none" : "1px solid rgba(108,71,255,0.15)",
              cursor:"pointer", transition:"all 0.18s",
              fontFamily:"'DM Sans',sans-serif",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{
        marginTop:"auto", background:"linear-gradient(135deg,#6C47FF,#9B7FFF)",
        borderRadius:14, padding:"1rem", color:"white",
      }}>
        <div style={{ fontSize:11, opacity:0.7, marginBottom:4 }}>Questions solved</div>
        <div className="syne" style={{ fontSize:22, fontWeight:700 }}>47</div>
        <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:99, height:5, marginTop:8 }}>
          <div style={{ background:"white", borderRadius:99, height:5, width:"62%" }} />
        </div>
      </div>
    </>
  );
}

function MessageBubble({ msg, subject }) {
  const isUser = msg.role === "user";
  return (
    <div className="msg-in" style={{
      display:"flex", gap:10, alignItems:"flex-start",
      flexDirection: isUser ? "row-reverse" : "row",
    }}>
      <div style={{
        width:32, height:32, borderRadius:10, flexShrink:0,
        background: isUser ? "#EEE9FF" : "linear-gradient(135deg,#6C47FF,#A77BFF)",
        display:"flex", alignItems:"center", justifyContent:"center",
        color: isUser ? "#6C47FF" : "white",
        fontSize: isUser ? 11 : 15, fontWeight:700,
      }} className={isUser ? "syne" : ""}>{isUser ? "YOU" : "✦"}</div>
      <div style={{
        maxWidth:"72%", padding:"12px 16px", borderRadius:18, fontSize:14, lineHeight:1.65,
        background: isUser ? "linear-gradient(135deg,#6C47FF,#8B6BFF)" : "white",
        color: isUser ? "white" : "#0D0D14",
        border: isUser ? "none" : "1px solid rgba(108,71,255,0.12)",
        borderTopLeftRadius: isUser ? 18 : 4,
        borderTopRightRadius: isUser ? 4 : 18,
        boxShadow: isUser ? "none" : "0 2px 12px rgba(108,71,255,0.07)",
      }}>
        {msg.content.split("\n").map((line, i) => (
          <p key={i} style={{ margin: i > 0 ? "6px 0 0" : 0 }}>{parseBold(line)}</p>
        ))}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="msg-in" style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
      <div style={{
        width:32, height:32, borderRadius:10,
        background:"linear-gradient(135deg,#6C47FF,#A77BFF)",
        display:"flex", alignItems:"center", justifyContent:"center",
        color:"white", fontSize:15, flexShrink:0,
      }}>✦</div>
      <div style={{
        padding:"14px 18px", borderRadius:18, borderTopLeftRadius:4,
        background:"white", border:"1px solid rgba(108,71,255,0.12)",
        boxShadow:"0 2px 12px rgba(108,71,255,0.07)",
        display:"flex", gap:4, alignItems:"center",
      }}>
        {["dot1","dot2","dot3"].map(c => (
          <div key={c} className={c} style={{
            width:6, height:6, borderRadius:"50%", background:"#6C47FF",
          }}/>
        ))}
      </div>
    </div>
  );
}