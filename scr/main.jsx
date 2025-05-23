import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import RadarChartComponent from "./components/RadarChart";

function App() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("请先选择图片");
    const form = new FormData();
    form.append("file", file);
    setLoading(true);
    const res = await fetch("/api/score", { method: "POST", body: form });
    const data = await res.json();
    setScore(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>AI 视觉打分（DeepSeek）</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload} style={{ marginLeft: 10 }} disabled={loading}>
        {loading ? "正在评分..." : "提交打分"}
      </button>
      {score && (
        <>
          <h3 style={{ marginTop: 20 }}>总分：{score.总分} 分</h3>
          <RadarChartComponent data={score.评分} />
          <pre style={{ background: "#f7f7f7", padding: "1rem" }}>
            {JSON.stringify(score.点评, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
