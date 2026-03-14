"use client";

import { useState } from "react";

type Step = "input" | "processing" | "result" | "submitted";

interface GrievanceResult {
  category: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  key_facts: string[];
  department: string;
  portal: string;
  escalation: string;
  formal_letter: string;
  reference_number: string;
  submitted_at: string;
}

interface SubmitResult {
  success: boolean;
  message: string;
  reference_number: string;
  portal: string;
  department: string;
  expected_resolution: string;
  next_steps: string[];
}

const URGENCY_COLORS: Record<string, string> = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

const CATEGORY_ICONS: Record<string, string> = {
  electricity: "⚡",
  water: "💧",
  road: "🛣️",
  police: "🚔",
  consumer: "🛒",
  ration: "🌾",
  healthcare: "🏥",
  other: "📋",
};

const EXAMPLE_COMPLAINTS = [
  "My electricity bill was double this month with no explanation. I usually pay ₹800 but got a bill of ₹2400.",
  "There is a large pothole on Main Street near the market. Two bikes have already fallen due to it.",
  "The ration shop dealer is not giving us our monthly quota of rice and wheat for the past 2 months.",
];

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [complaint, setComplaint] = useState("");
  const [result, setResult] = useState<GrievanceResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!complaint.trim() || complaint.trim().length < 10) {
      setError("Please describe your complaint in at least 10 characters.");
      return;
    }
    setError("");
    setStep("processing");

    try {
      const res = await fetch("http://localhost:8000/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint: complaint.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setResult(data.data);
      setStep("result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to backend. Make sure the backend server is running.";
      setError(msg);
      setStep("input");
    }
  };

  const handleSubmit = async () => {
    if (!result) return;
    setStep("processing");

    try {
      const res = await fetch("http://localhost:8000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference_number: result.reference_number,
          category: result.category,
          department: result.department,
          portal: result.portal,
        }),
      });

      const data = await res.json();
      setSubmitResult(data);
      setStep("submitted");
    } catch {
      setError("Submission failed. Please try again.");
      setStep("result");
    }
  };

  const handleReset = () => {
    setStep("input");
    setComplaint("");
    setResult(null);
    setSubmitResult(null);
    setError("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (result?.formal_letter) {
      navigator.clipboard.writeText(result.formal_letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 50%, #0a1628 100%)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e3a5f",
        background: "rgba(10,15,30,0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #f97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem",
          }}>⚖️</div>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              Grievance<span style={{ color: "#f97316" }}>GPT</span>
            </h1>
            <p style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "-1px" }}>Agentic AI · Civic Empowerment</p>
          </div>
        </div>
        <div style={{
          background: "rgba(37,99,235,0.15)",
          border: "1px solid rgba(37,99,235,0.3)",
          borderRadius: "999px",
          padding: "0.3rem 1rem",
          fontSize: "0.75rem",
          color: "#93c5fd",
          fontWeight: 500,
        }}>
          🏆 Hack &amp; Break 2026
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Hero */}
        {step === "input" && (
          <div style={{ textAlign: "center", marginBottom: "2.5rem", paddingTop: "1rem" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.3)",
              borderRadius: "999px",
              padding: "0.4rem 1.2rem",
              fontSize: "0.8rem",
              color: "#fb923c",
              fontWeight: 600,
              marginBottom: "1.2rem",
              letterSpacing: "0.05em",
            }}>
              POWERED BY AGENTIC AI
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1.1,
              marginBottom: "1rem",
              letterSpacing: "-0.03em",
            }}>
              Your Voice.<br />
              <span style={{ background: "linear-gradient(90deg, #2563eb, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Filed. Followed Up.
              </span><br />
              Automatically.
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: 500, margin: "0 auto 2rem", lineHeight: 1.6 }}>
              Just describe your problem in plain language. Our AI agent classifies it,
              drafts a formal complaint, and submits it to the right government department — in seconds.
            </p>
          </div>
        )}

        {/* Processing */}
        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <div style={{
                width: 80, height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem",
                margin: "0 auto 1.5rem",
                animation: "pulse 1.5s infinite",
                boxShadow: "0 0 40px rgba(37,99,235,0.4)",
              }}>🤖</div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" }}>
                Agent Working...
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Classifying → Routing → Drafting your complaint</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 320, margin: "0 auto" }}>
              {["Analyzing your complaint...", "Identifying correct department...", "Drafting formal letter..."].map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  background: "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.15)",
                  borderRadius: 10, padding: "0.6rem 1rem",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: "2px solid #2563eb",
                    borderTopColor: "transparent",
                    animation: "spin 1s linear infinite",
                    animationDelay: `${i * 0.2}s`,
                    flexShrink: 0,
                  }} />
                  <span style={{ color: "#93c5fd", fontSize: "0.85rem" }}>{step}</span>
                </div>
              ))}
            </div>
            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
          </div>
        )}

        {/* Input Form */}
        {step === "input" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            {/* Steps indicator */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.5rem", marginBottom: "2rem",
            }}>
              {["Describe Problem", "AI Analysis", "Submit Complaint"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i === 0 ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "rgba(30,58,95,0.5)",
                    border: i === 0 ? "none" : "1px solid #1e3a5f",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 700,
                    color: i === 0 ? "#fff" : "#475569",
                  }}>{i + 1}</div>
                  <span style={{ fontSize: "0.8rem", color: i === 0 ? "#93c5fd" : "#475569", fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
                  {i < 2 && <span style={{ color: "#1e3a5f", margin: "0 0.25rem" }}>→</span>}
                </div>
              ))}
            </div>

            {/* Complaint input card */}
            <div style={{
              background: "rgba(26,34,53,0.8)",
              border: "1px solid #1e3a5f",
              borderRadius: 16,
              padding: "2rem",
              backdropFilter: "blur(10px)",
              marginBottom: "1.5rem",
            }}>
              <label style={{
                display: "block", marginBottom: "0.75rem",
                fontWeight: 600, color: "#f1f5f9", fontSize: "1rem",
              }}>
                🗣️ Describe your problem
              </label>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>
                Write in English, Hindi, or any Indian language. Be as specific as possible.
              </p>
              <textarea
                value={complaint}
                onChange={(e) => { setComplaint(e.target.value); setError(""); }}
                placeholder="E.g. My electricity bill was double this month without any explanation. I usually pay ₹800 but received a bill of ₹2400..."
                rows={5}
                style={{
                  width: "100%",
                  background: "rgba(10,15,30,0.6)",
                  border: `1px solid ${error ? "#ef4444" : "#1e3a5f"}`,
                  borderRadius: 10,
                  color: "#f1f5f9",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  padding: "1rem",
                  resize: "vertical",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = error ? "#ef4444" : "#1e3a5f")}
              />
              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.5rem" }}>⚠️ {error}</p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#475569" }}>{complaint.length}/2000 characters</span>
                <button
                  onClick={handleAnalyze}
                  disabled={!complaint.trim()}
                  style={{
                    background: complaint.trim()
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : "rgba(37,99,235,0.2)",
                    color: complaint.trim() ? "#fff" : "#475569",
                    border: "none",
                    borderRadius: 10,
                    padding: "0.75rem 2rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: complaint.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}
                >
                  🤖 Analyze with AI →
                </button>
              </div>
            </div>

            {/* Example prompts */}
            <div>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.75rem", fontWeight: 500 }}>
                💡 Try an example:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {EXAMPLE_COMPLAINTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setComplaint(ex)}
                    style={{
                      background: "rgba(37,99,235,0.05)",
                      border: "1px solid rgba(37,99,235,0.15)",
                      borderRadius: 8,
                      padding: "0.65rem 1rem",
                      color: "#93c5fd",
                      fontSize: "0.82rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = "rgba(37,99,235,0.12)";
                      (e.target as HTMLElement).style.borderColor = "rgba(37,99,235,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = "rgba(37,99,235,0.05)";
                      (e.target as HTMLElement).style.borderColor = "rgba(37,99,235,0.15)";
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && result && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* Steps indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
              {["Describe Problem", "AI Analysis ✓", "Submit Complaint"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i < 2 ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 700, color: "#fff",
                  }}>{i < 2 ? "✓" : 3}</div>
                  <span style={{ fontSize: "0.8rem", color: i < 2 ? "#86efac" : "#93c5fd", fontWeight: 600 }}>{s}</span>
                  {i < 2 && <span style={{ color: "#1e3a5f", margin: "0 0.25rem" }}>→</span>}
                </div>
              ))}
            </div>

            {/* Classification Summary */}
            <div style={{
              background: "rgba(26,34,53,0.8)",
              border: "1px solid #1e3a5f",
              borderRadius: 16, padding: "1.5rem",
              marginBottom: "1rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "2rem" }}>{CATEGORY_ICONS[result.category] || "📋"}</span>
                    <div>
                      <h3 style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "1.1rem", textTransform: "capitalize" }}>
                        {result.category} Complaint
                      </h3>
                      <p style={{ color: "#64748b", fontSize: "0.82rem" }}>{result.summary}</p>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{
                    background: `${URGENCY_COLORS[result.urgency]}22`,
                    border: `1px solid ${URGENCY_COLORS[result.urgency]}55`,
                    color: URGENCY_COLORS[result.urgency],
                    borderRadius: "999px", padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
                  }}>
                    {result.urgency} urgency
                  </span>
                  <span style={{
                    background: "rgba(37,99,235,0.1)",
                    border: "1px solid rgba(37,99,235,0.25)",
                    color: "#93c5fd",
                    borderRadius: "999px", padding: "0.25rem 0.75rem",
                    fontSize: "0.75rem", fontWeight: 500,
                  }}>
                    📤 {result.portal}
                  </span>
                </div>
              </div>

              {/* Key facts */}
              <div style={{ marginTop: "1rem", borderTop: "1px solid #1e3a5f", paddingTop: "1rem" }}>
                <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "0.5rem" }}>KEY FACTS EXTRACTED</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {result.key_facts.map((fact, i) => (
                    <span key={i} style={{
                      background: "rgba(249,115,22,0.08)",
                      border: "1px solid rgba(249,115,22,0.2)",
                      borderRadius: 6, padding: "0.3rem 0.6rem",
                      fontSize: "0.78rem", color: "#fdba74",
                    }}>→ {fact}</span>
                  ))}
                </div>
              </div>

              {/* Routing info */}
              <div style={{
                marginTop: "1rem", borderTop: "1px solid #1e3a5f", paddingTop: "1rem",
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem",
              }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>DEPARTMENT</p>
                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", fontWeight: 500 }}>🏛️ {result.department}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>ESCALATION PATH</p>
                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", fontWeight: 500 }}>⬆️ {result.escalation}</p>
                </div>
              </div>
            </div>

            {/* Formal Letter */}
            <div style={{
              background: "rgba(26,34,53,0.8)",
              border: "1px solid #1e3a5f",
              borderRadius: 16, padding: "1.5rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4 style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem" }}>
                  📝 Formal Complaint Letter (AI Drafted)
                </h4>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? "rgba(34,197,94,0.15)" : "rgba(37,99,235,0.1)",
                    border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(37,99,235,0.25)",
                    borderRadius: 8, padding: "0.3rem 0.8rem",
                    color: copied ? "#86efac" : "#93c5fd",
                    fontSize: "0.78rem", cursor: "pointer", fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              <div style={{
                background: "rgba(10,15,30,0.5)",
                border: "1px solid #0f2040",
                borderRadius: 10, padding: "1.25rem",
                maxHeight: 280, overflowY: "auto",
              }}>
                <pre style={{
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.8,
                  fontFamily: "inherit", margin: 0,
                }}>
                  {result.formal_letter}
                </pre>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={handleReset}
                style={{
                  flex: 1, minWidth: 140,
                  background: "rgba(30,58,95,0.3)",
                  border: "1px solid #1e3a5f",
                  borderRadius: 10, padding: "0.85rem",
                  color: "#94a3b8", fontSize: "0.9rem", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                ← New Complaint
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 2, minWidth: 200,
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  border: "none", borderRadius: 10, padding: "0.85rem",
                  color: "#fff", fontSize: "0.95rem", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: "0 4px 24px rgba(249,115,22,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}
              >
                🚀 Submit to {result.portal.split(" ")[0]} →
              </button>
            </div>
          </div>
        )}

        {/* Submitted */}
        {step === "submitted" && submitResult && result && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.5rem", margin: "0 auto 1.5rem",
              boxShadow: "0 0 60px rgba(34,197,94,0.3)",
            }}>✅</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.5rem" }}>
              Complaint Filed!
            </h2>
            <p style={{ color: "#86efac", marginBottom: "2rem", fontSize: "0.95rem" }}>
              Your grievance has been submitted successfully.
            </p>

            {/* Reference card */}
            <div style={{
              background: "rgba(26,34,53,0.8)",
              border: "1px solid #1e3a5f",
              borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem",
              textAlign: "left",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #1e3a5f",
              }}>
                <span style={{ color: "#64748b", fontSize: "0.82rem" }}>REFERENCE NUMBER</span>
                <span style={{
                  background: "rgba(249,115,22,0.1)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  borderRadius: 8, padding: "0.35rem 0.75rem",
                  color: "#fb923c", fontWeight: 700, fontSize: "0.9rem",
                  fontFamily: "monospace", letterSpacing: "0.05em",
                }}>
                  {submitResult.reference_number}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>SUBMITTED TO</p>
                  <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.88rem" }}>🏛️ {submitResult.department}</p>
                </div>
                <div>
                  <p style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.25rem" }}>EXPECTED RESOLUTION</p>
                  <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.88rem" }}>⏱️ {submitResult.expected_resolution}</p>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #1e3a5f", paddingTop: "1rem" }}>
                <p style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "0.75rem", fontWeight: 600 }}>NEXT STEPS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {submitResult.next_steps.map((step, i) => (
                    <div key={i} style={{
                      display: "flex", gap: "0.6rem", alignItems: "flex-start",
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.65rem", color: "#86efac", fontWeight: 700, flexShrink: 0, marginTop: 2,
                      }}>{i + 1}</span>
                      <span style={{ color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                border: "none", borderRadius: 10,
                padding: "0.85rem 2rem",
                color: "#fff", fontSize: "0.95rem", fontWeight: 700,
                cursor: "pointer", boxShadow: "0 4px 24px rgba(37,99,235,0.3)",
              }}
            >
              + File Another Complaint
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: "center", padding: "2rem",
        borderTop: "1px solid #0f2040",
        color: "#334155", fontSize: "0.78rem", marginTop: "3rem",
      }}>
        <p>GrievanceGPT · Hack &amp; Break 2026 · Agentic AI Theme</p>
        <p style={{ marginTop: "0.25rem", color: "#f97316", fontStyle: "italic" }}>
          &quot;Accountability shouldn&apos;t require a law degree.&quot;
        </p>
      </footer>
    </main>
  );
}
