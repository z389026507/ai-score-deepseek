import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setScore("");
  };

  const handleUpload = async () => {
    if (!file) return alert("请先选择图片");

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setScore("");

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setScore(data?.result?.choices?.[0]?.message?.content || "未能获取评分");
    } catch (err) {
      console.error(err);
      alert("上传失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI 视觉评分系统 - <span className="text-blue-600">DeepSeek</span> 实时打分
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "分析中..." : "上传并分析"}
      </button>

      {score && (
        <div className="mt-6 p-4 bg-white rounded shadow max-w-lg">
          <h2 className="text-xl font-semibold mb-2">评分结果</h2>
          <pre className="whitespace-pre-wrap">{score}</pre>
        </div>
      )}
    </div>
  );
}
