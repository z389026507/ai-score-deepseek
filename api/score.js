import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ error: 'Error parsing the form data' });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const imageData = fs.readFileSync(file.filepath);

      const response = await fetch('https://api.deepseek.com/v1/images/gpt-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: imageData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('API error:', errText);
        return res.status(response.status).json({ error: 'DeepSeek API error', detail: errText });
      }

      const result = await response.json();
      return res.status(200).json({ score: result.score });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
