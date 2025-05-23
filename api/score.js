import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "上传失败" });

    const filePath = files.file[0].filepath;
    const buffer = fs.readFileSync(filePath);

    // 伪造 GPT 请求体（替换为真实 deepseek）
    const result = await fetch("https://api.deepseek.com/v1/chat/completions", {
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
              { type: "text", text: "请从视觉设计角度对这张图打 0-10 分" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${buffer.toString("base64")}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const json = await result.json();
    res.status(200).json({ result: json });
  });
}
