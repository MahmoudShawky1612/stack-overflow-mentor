import express from 'express';
import { analyzeQuestion } from './analyzer';
import cors from 'cors'; // Add this


const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Extension-ID']
}));



app.use(express.json());

app.post('/analyze', async (req, res) => {
  try {
    const { title, body } = req.body;
    const analysis = await analyzeQuestion(body, title);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️ Server running at http://localhost:${PORT}`);
});