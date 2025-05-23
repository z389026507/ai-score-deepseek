import formidable from "formidable";
import fs from "fs";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "上传失败" });

    const file = files.file[0];
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const imageBuffer = fs.readFileSync(file.filepath);

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是图像视觉分析师，请根据图像质量从1到5分数维度评价" },
          { role: "user", content: [{ type: "image_url", image_url: { url: `data:image/png;base64,${imageBuffer.toString("base64")}` } }] }
        ],
      }),
    });

    const result = await response.json();
    res.status(200).json({ result });
  });
}