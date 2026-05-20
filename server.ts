import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ limit: '500mb', extended: true }));

  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  app.post('/api/gemini/generate', async (req, res) => {
    try {
      const { text, files, locale } = req.body;
      if (!text && (!files || files.length === 0)) {
        return res.status(400).json({ error: 'Study material or files are required' });
      }

      const langName = locale === 'id' ? 'Indonesian' : 'English';

      const prompt = `Analyze the provided study material (text and/or files). Return ONLY a JSON object containing two keys: 'summary' (a single markdown formatted string with a brief explanation using bullet points) and 'quiz' (an array of 5 multiple-choice questions. Each question object must have 'question', 'options' array, 'correctAnswer', and 'explanation').

IMPORTANT: The summary, all quiz questions, options, and explanations MUST be written in ${langName} language.`;

      const parts: any[] = [{ text: prompt }];

      if (text) {
        parts.push({ text: `Text Content:\n${text}` });
      }

      if (files && Array.isArray(files)) {
        files.forEach((file: any) => {
          parts.push({
            inlineData: {
              data: file.data,
              mimeType: file.mimeType,
            },
          });
        });
      }

      const response = await genAI.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (!response.text) {
        throw new Error('Empty response from AI');
      }

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      let errorMessage = error.message || 'Failed to generate content';

      if (errorMessage.includes('503') || errorMessage.includes('high demand') || errorMessage.includes('UNAVAILABLE')) {
        errorMessage = 'The AI model is currently experiencing high demand. Please try again in a few moments.';
      }

      res.status(500).json({ error: errorMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
