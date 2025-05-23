import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/score", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("评分结果", data);
  };

  return (
    <div>
      <h1>AI 视觉评分系统 - DeepSeek 实时打分</h1>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload}>上传并分析</button>
    </div>
  );
}
