// /api/score.js

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const body = await req.json();
    const base64Image = body.imageBase64;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "请根据图片内容从“视觉设计角度”给出打分，满分100分，并只输出数字结果。" },
              { type: "image_url", image_url: { url: base64Image } },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "抱歉，未能获取评分。";

    return new Response(JSON.stringify({ score: content }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "发生错误" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
