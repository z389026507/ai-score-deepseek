import formidable from "formidable";
import fs from "fs";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "上传失败" });
    }

    const filePath = files.file.filepath;
    const fileBuffer = fs.readFileSync(filePath);

    // 调用 DeepSeek 或 GPT-4 vision 接口（根据你选用的模型）
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-coder",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "请分析这张图像的设计质量并给出 0 到 10 的评分" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${fileBuffer.toString("base64")}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();
    res.status(200).json(result);
  });
}
