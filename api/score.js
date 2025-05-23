import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  try {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: '上传失败', detail: err });

      const prompt = `
你是视觉设计专家，请从以下6个维度为图像内容打分并点评：
构图排版、色彩系统、字体风格、人物素材、字数控制、安全风控。
返回如下结构：
{
  "评分": { "构图排版": 4.5, ... },
  "点评": { "构图排版": "...", ... },
  "总分": 89
}`;

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + process.env.DEEPSEEK_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const result = await response.json();
      const reply = result.choices?.[0]?.message?.content;

      try {
        const json = JSON.parse(reply);
        res.status(200).json(json);
      } catch (e) {
        res.status(500).json({ error: "返回格式非 JSON", raw: reply });
      }
    });
  } catch (e) {
    res.status(500).json({ error: "函数错误", detail: String(e) });
  }
}
