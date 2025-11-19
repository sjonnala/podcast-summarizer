import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processPodcast } from './services/podcastProcessor.js';
import { checkOllamaAvailability, getOllamaModels } from './services/ollamaService.js';

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

// Get available LLM providers
app.get('/api/providers', async (req, res) => {
  try {
    const providers = {
      auto: {
        available: true,
        name: 'Auto (Smart Fallback)',
        description: 'Tries Groq → Gemini → Claude automatically',
        cost: 'Variable',
        icon: '🤖',
      },
      groq: {
        available: !!process.env.GROQ_API_KEY,
        name: 'Groq (Llama 3.3 70B)',
        description: '7x faster, 80-90% cheaper than Claude',
        cost: '$0.59-0.79 per 1M tokens',
        icon: '⚡',
      },
      gemini: {
        available: !!process.env.GEMINI_API_KEY,
        name: 'Google Gemini 2.0 Flash',
        description: 'FREE tier, 1M context window',
        cost: 'FREE up to 128K tokens',
        icon: '🔮',
      },
      ollama: {
        available: await checkOllamaAvailability(process.env.OLLAMA_URL),
        name: 'Ollama (Local)',
        description: '100% free, private, no API needed',
        cost: 'FREE (local processing)',
        icon: '🏠',
        models: await getOllamaModels(process.env.OLLAMA_URL),
      },
      claude: {
        available: !!process.env.ANTHROPIC_API_KEY,
        name: 'Claude 3.5 Sonnet',
        description: 'Highest quality, premium pricing',
        cost: '$3.00-15.00 per 1M tokens',
        icon: '🧠',
      },
    };

    res.json({ providers });
  } catch (error) {
    console.error('Error checking providers:', error);
    res.status(500).json({
      error: 'Failed to check providers',
      message: error.message
    });
  }
});

// Main podcast processing endpoint
app.post('/api/process-podcast', async (req, res) => {
  try {
    const { podcastUrl, llmProvider = 'auto', ollamaModel = 'llama3.3:70b' } = req.body;

    if (!podcastUrl) {
      return res.status(400).json({ error: 'Podcast URL is required' });
    }

    // Validate URL format
    try {
      new URL(podcastUrl);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Processing podcast: ${podcastUrl} with provider: ${llmProvider}`);

    // Process the podcast
    const result = await processPodcast(podcastUrl, llmProvider, ollamaModel);

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
