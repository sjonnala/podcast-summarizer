import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processPodcast } from './services/podcastProcessor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Podcast Summarizer API is running' });
});

// Main podcast processing endpoint
app.post('/api/process-podcast', async (req, res) => {
  try {
    const { podcastUrl } = req.body;

    if (!podcastUrl) {
      return res.status(400).json({ error: 'Podcast URL is required' });
    }

    // Validate URL format
    try {
      new URL(podcastUrl);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Processing podcast: ${podcastUrl}`);

    // Process the podcast
    const result = await processPodcast(podcastUrl);

    res.json(result);
  } catch (error) {
    console.error('Error processing podcast:', error);
    res.status(500).json({
      error: 'Failed to process podcast',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/process-podcast`);
});
