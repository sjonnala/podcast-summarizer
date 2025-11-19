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

// Get trending podcasts
app.get('/api/trending', (req, res) => {
  try {
    // Curated trending podcasts for busy professionals
    // In production, this could be fetched from a database or external API
    const trendingPodcasts = [
      // Technology
      {
        title: 'The AI Revolution: ChatGPT and Beyond',
        description: 'Deep dive into how ChatGPT is transforming industries, from healthcare to finance. Expert analysis on what comes next.',
        url: 'https://www.youtube.com/watch?v=aircAruvnKk',
        category: 'technology',
        duration: '45 min',
        host: 'Lex Fridman',
        trending: true,
      },
      {
        title: 'Building Scalable Systems at Google Scale',
        description: 'Former Google engineer shares insights on designing systems that handle billions of requests. Real-world architecture patterns.',
        url: 'https://www.youtube.com/watch?v=modXC5IWTJI',
        category: 'technology',
        duration: '38 min',
        host: 'Software Engineering Daily',
        trending: true,
      },
      {
        title: 'Cybersecurity in 2025: What You Need to Know',
        description: 'Critical security trends every developer and business leader should understand. Zero-trust architecture explained.',
        url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
        category: 'technology',
        duration: '32 min',
        host: 'Darknet Diaries',
        trending: false,
      },
      {
        title: 'The Future of Web Development: AI-Assisted Coding',
        description: 'How GitHub Copilot and AI tools are changing how we write code. Productivity tips from senior engineers.',
        url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
        category: 'technology',
        duration: '41 min',
        host: 'Syntax.fm',
        trending: false,
      },

      // Business
      {
        title: 'From Zero to Unicorn: The Startup Playbook',
        description: 'Y Combinator partner breaks down what actually makes startups succeed. Contrarian advice on fundraising and growth.',
        url: 'https://www.youtube.com/watch?v=ZoqgAy3h4OM',
        category: 'business',
        duration: '52 min',
        host: 'How I Built This',
        trending: true,
      },
      {
        title: 'Remote Work Revolution: Building Distributed Teams',
        description: 'Lessons from companies managing 100% remote teams. Culture, communication, and productivity strategies that work.',
        url: 'https://www.youtube.com/watch?v=5iFnzr73XXk',
        category: 'business',
        duration: '35 min',
        host: 'Masters of Scale',
        trending: false,
      },
      {
        title: 'The Art of Negotiation in Tech Sales',
        description: 'Enterprise sales expert reveals tactics for closing million-dollar deals. Psychology of decision-makers.',
        url: 'https://www.youtube.com/watch?v=guWxyI0mRGE',
        category: 'business',
        duration: '44 min',
        host: 'The SaaS Podcast',
        trending: false,
      },
      {
        title: 'Customer Retention > Customer Acquisition',
        description: 'Why focusing on retention is 5x more profitable. Data-driven strategies to reduce churn and increase LTV.',
        url: 'https://www.youtube.com/watch?v=n_yHZ_vKjno',
        category: 'business',
        duration: '29 min',
        host: 'Marketing Against the Grain',
        trending: true,
      },

      // Finance
      {
        title: 'Crypto Winter to Crypto Spring: What Changed?',
        description: 'Analysis of Bitcoin ETFs, institutional adoption, and regulatory clarity. Portfolio allocation strategies for 2025.',
        url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4',
        category: 'finance',
        duration: '48 min',
        host: 'Bankless',
        trending: true,
      },
      {
        title: 'Index Funds vs Individual Stocks: The Data Speaks',
        description: 'Vanguard researcher breaks down 30 years of performance data. Why 80% of active managers underperform.',
        url: 'https://www.youtube.com/watch?v=fwe-PjrX23o',
        category: 'finance',
        duration: '36 min',
        host: 'The Money Guy Show',
        trending: false,
      },
      {
        title: 'Real Estate Investing in a High-Rate Environment',
        description: 'Strategies that work when interest rates are 7%+. Creative financing and market timing insights.',
        url: 'https://www.youtube.com/watch?v=IjG-N_qGPXI',
        category: 'finance',
        duration: '42 min',
        host: 'BiggerPockets',
        trending: false,
      },
      {
        title: 'Tax Optimization for High Earners in Tech',
        description: 'CPA breaks down RSU strategies, backdoor Roth IRAs, and entity structures. Save $50K+ annually.',
        url: 'https://www.youtube.com/watch?v=qVu-vPE7pTg',
        category: 'finance',
        duration: '38 min',
        host: 'The White Coat Investor',
        trending: true,
      },

      // Personal Development
      {
        title: 'Deep Work in the Age of Distraction',
        description: 'Cal Newport on building focus in a world designed to steal your attention. Practical systems that actually work.',
        url: 'https://www.youtube.com/watch?v=3E7hkPZ-HTk',
        category: 'personal_development',
        duration: '55 min',
        host: 'The Knowledge Project',
        trending: true,
      },
      {
        title: 'Sleep Science: Optimizing Your Most Important KPI',
        description: 'Stanford sleep researcher reveals how to improve sleep quality. Impact on performance, health, and longevity.',
        url: 'https://www.youtube.com/watch?v=nm1TxQj9IsQ',
        category: 'personal_development',
        duration: '47 min',
        host: 'Huberman Lab',
        trending: false,
      },
      {
        title: 'Learning to Learn: Meta-Skills for Knowledge Workers',
        description: 'How to learn anything 10x faster. Techniques from memory champions and rapid skill acquisition experts.',
        url: 'https://www.youtube.com/watch?v=vd2dtkMINIw',
        category: 'personal_development',
        duration: '41 min',
        host: 'The Tim Ferriss Show',
        trending: false,
      },
      {
        title: 'Building a Second Brain: Knowledge Management Systems',
        description: 'Tiago Forte on capturing, organizing, and retrieving information. From note-taking to creative output.',
        url: 'https://www.youtube.com/watch?v=OP3dA2GcAh8',
        category: 'personal_development',
        duration: '50 min',
        host: 'Ali Abdaal',
        trending: true,
      },
    ];

    res.json({ podcasts: trendingPodcasts });
  } catch (error) {
    console.error('Error fetching trending podcasts:', error);
    res.status(500).json({
      error: 'Failed to fetch trending podcasts',
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
