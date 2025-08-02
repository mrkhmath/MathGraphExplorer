import React, { useState } from "react";

const API_URL = "https://ml-sandbox-backend.onrender.com/predict_readiness";

export default function MLSandbox() {
  const [studentId, setStudentId] = useState("");
  const [targetCcss, setTargetCcss] = useState("");
  const [dok, setDok] = useState(2);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, target_ccss: targetCcss, dok })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Prediction failed");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>🧠 ML Sandbox</h2>

      <label>Student ID:</label>
      <input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. 000f64..." />

      <label>Target Concept (CCSS):</label>
      <input value={targetCcss} onChange={e => setTargetCcss(e.target.value)} placeholder="e.g. 8.EE.2" />

      <label>Depth of Knowledge (DoK):</label>
      <select value={dok} onChange={e => setDok(Number(e.target.value))}>
        {[1, 2, 3, 4].map(level => <option key={level} value={level}>DoK {level}</option>)}
      </select>

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict Readiness"}
      </button>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Result</h3>
          <p><strong>Readiness Score:</strong> {result.readiness_score}</p>
          <p><strong>Ready:</strong> {result.ready ? "✅ Yes" : "❌ No"}</p>

          <h4>Assessment Timeline</h4>
          <img src={result.timeline_img} alt="Timeline" style={{ width: "100%" }} />

          <h4>Concept Subgraph</h4>
          <img src={result.graph_img} alt="Graph" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
