# 🎙️ Podcast Summarizer

An AI-powered web application that transforms podcast episodes into actionable insights. Simply provide a podcast URL, and get comprehensive analysis including TL;DR summaries, highlights, key takeaways, and more. Optimized for busy professionals who want to stay updated with minimal time investment.

## ✨ Features

### 🚀 Quick Win Features (New!)
- **Smart TL;DR View**: Get a 5-minute digest with the bottom line, top 3 insights, and "Worth listening?" verdict
- **Auto-Categorization**: Automatic classification into categories (Tech, Business, Finance, etc.) with visual badges
- **Trending Podcast Discovery**: Curated feed of trending podcasts with one-click processing

### 🤖 Multi-Provider LLM Support
Choose from 4 AI providers based on your needs:
- **Auto Mode** 🤖 - Smart fallback (Groq → Gemini → Claude)
- **Groq** ⚡ - Llama 3.3 70B (7x faster, 80-90% cheaper, $0.59-0.79 per 1M tokens)
- **Google Gemini** 🔮 - Gemini 2.0 Flash (FREE tier up to 128K tokens, 1M context)
- **Ollama** 🏠 - Local LLMs (100% free, private, no API needed)
- **Claude** 🧠 - Claude 3.5 Sonnet (Highest quality, $3.00-15.00 per 1M tokens)

### 📊 Advanced Analysis
- **Automatic Transcript Extraction**: Using AssemblyAI with speaker diarization
- **Chapter Detection**: Smart segmentation with timestamps
- **Speaker Statistics**: Track speaking time and contribution per speaker
- **Sentiment Analysis**: Emotion tracking throughout the episode
- **Highlights & Takeaways**: AI-extracted key moments with timestamps
- **Topic Mapping**: Discover related topics and concepts
- **Follow-Up Questions**: Suggested areas for deeper exploration

### 📚 Library & Organization
- **Episode Library**: Save and organize analyzed podcasts
- **Smart Search**: Full-text search across all saved episodes
- **Category Filters**: Filter library by category (Tech, Business, Finance, etc.)
- **Bookmarking System**: Mark important moments with notes
- **Quote Sharing**: Generate beautiful quote cards for social media

### 💰 Cost Optimization
- **Provider Comparison**: See estimated costs before processing
- **Real-Time Cost Tracking**: Know exactly what each analysis costs
- **Cost History**: Track your spending over time
- **Free Tier Options**: Gemini (FREE) and Ollama (local, FREE)

### 🎨 User Experience
- **Beautiful UI**: Clean, modern interface built with React and Tailwind CSS
- **Real-time Processing**: See progress as your podcast is being analyzed
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Export Options**: Download as JSON, Markdown, or PDF

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **AssemblyAI** - Transcript extraction with speaker diarization
- **Multiple LLM Providers**:
  - Anthropic Claude (Claude 3.5 Sonnet)
  - Groq (Llama 3.3 70B)
  - Google Gemini (Gemini 2.0 Flash)
  - Ollama (Local LLMs)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git** (for cloning the repository)

### Optional (for local LLMs):
- **Ollama** - [Install Ollama](https://ollama.ai/) for 100% free local processing

### API Keys (at least one required):
- [Anthropic (Claude AI)](https://console.anthropic.com/) - Premium quality
- [Groq](https://console.groq.com/) - Fast & affordable
- [Google AI Studio (Gemini)](https://makersuite.google.com/app/apikey) - Free tier available
- [AssemblyAI](https://www.assemblyai.com/) - Required for transcription

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/sjonnala/podcast-summarizer.git
cd podcast-summarizer
```

### 2. Install dependencies

Install root dependencies:
```bash
npm install
```

Install both frontend and backend dependencies:
```bash
npm run install:all
```

Or install them separately:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables

#### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Edit `backend/.env` and add your API keys:

```env
# Server Configuration
PORT=3001

# Required: Transcription Service
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# LLM Providers (configure at least one)
# Option 1: Claude (Premium quality)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Option 2: Groq (Fast & affordable)
GROQ_API_KEY=your_groq_api_key_here

# Option 3: Gemini (FREE tier)
GEMINI_API_KEY=your_gemini_api_key_here

# Option 4: Ollama (Local, no API key needed)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.3:70b
```

#### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
touch .env
```

The default configuration should work for local development:

```env
VITE_API_URL=http://localhost:3001
```

## 🔑 Getting Your API Keys

### AssemblyAI (Required)
1. Visit [https://www.assemblyai.com/](https://www.assemblyai.com/)
2. Sign up for a free account (includes free credits)
3. Go to your dashboard
4. Copy your API key
5. Paste it into `backend/.env` as `ASSEMBLYAI_API_KEY`

### Anthropic Claude (Optional - Premium)
1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it into `backend/.env` as `ANTHROPIC_API_KEY`

**Pricing**: $3.00 per 1M input tokens, $15.00 per 1M output tokens

### Groq (Optional - Fast & Affordable)
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it into `backend/.env` as `GROQ_API_KEY`

**Pricing**: $0.59 per 1M input tokens, $0.79 per 1M output tokens (7x faster than Claude)

### Google Gemini (Optional - FREE Tier)
1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste it into `backend/.env` as `GEMINI_API_KEY`

**Pricing**: FREE up to 15 requests per minute and 128K tokens

### Ollama (Optional - 100% Free Local)
1. Install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Start Ollama: `ollama serve`
3. Pull a model: `ollama pull llama3.3:70b`
4. No API key needed! Just set `OLLAMA_URL=http://localhost:11434` in `.env`

**Pricing**: 100% FREE (runs on your local machine)

## 🏃 Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Production Build

Build the frontend for production:

```bash
npm run build
```

The built files will be in `frontend/dist/`

Start the backend in production mode:

```bash
cd backend
NODE_ENV=production node server.js
```

### Deployment Options

#### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel)**:
```bash
cd frontend
npm install -g vercel
vercel
```

**Backend (Railway)**:
1. Visit [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Set environment variables in Railway dashboard
5. Deploy

#### Option 2: Deploy to Render (Full Stack)

1. Visit [render.com](https://render.com)
2. Create a new Web Service for backend
3. Create a new Static Site for frontend
4. Set environment variables in Render dashboard
5. Deploy both services

#### Option 3: Deploy to DigitalOcean App Platform

1. Visit [DigitalOcean](https://www.digitalocean.com/products/app-platform)
2. Create a new app
3. Connect your GitHub repository
4. Configure build settings:
   - Backend: Node.js, `npm run dev:backend`
   - Frontend: Static Site, `npm run build`
5. Set environment variables
6. Deploy

#### Option 4: Self-Host with Docker (Coming Soon)

```bash
docker-compose up -d
```

## 📖 Usage

### Basic Workflow

1. **Open the application** at http://localhost:3000
2. **Select your AI provider** (Auto, Groq, Gemini, Ollama, or Claude)
3. **Enter a podcast URL**:
   - Direct MP3/audio links
   - YouTube video URLs
   - Spotify podcast links
   - Apple Podcasts URLs
4. **Click "Analyze Podcast"**
5. **Wait for processing** (2-5 minutes depending on length):
   - Transcription extraction
   - Speaker diarization
   - AI analysis
6. **Review your Quick Digest**:
   - 5-minute TL;DR summary
   - Top 3 key insights with timestamps
   - "Worth listening?" verdict
   - Time saved calculation
7. **Explore detailed analysis**:
   - Full transcript with search
   - Chapter navigation
   - Speaker statistics
   - Sentiment timeline
   - Highlights and takeaways
8. **Save to library** for later reference
9. **Bookmark important moments** with notes
10. **Share quotes** on social media

### Alternative: Discover Trending Podcasts

1. Click **"Discover Trending"** on the home page
2. Browse curated podcasts by category:
   - Technology
   - Business
   - Finance
   - Personal Development
3. Click **"Analyze This Podcast"** for instant processing
4. Get your Quick Digest and full analysis

### Library Management

1. Click **"Open My Library"** to view saved episodes
2. **Filter by category** using the category buttons
3. **Search episodes** using the search bar
4. **Load any episode** to view full analysis
5. **Delete episodes** you no longer need

### Provider Selection Guide

| Provider | Best For | Speed | Cost | Quality |
|----------|----------|-------|------|---------|
| **Auto** | First-time users | Variable | Variable | High |
| **Groq** | Cost-conscious users | ⚡ Very Fast | $ Cheap | High |
| **Gemini** | Free tier users | Fast | 🆓 Free* | High |
| **Ollama** | Privacy-focused | Medium | 🆓 Free | Good |
| **Claude** | Maximum quality | Medium | $$$ Premium | Highest |

*Free up to 15 RPM and 128K tokens

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```
Returns the health status of the API server.

**Response**:
```json
{
  "status": "ok",
  "message": "Podcast Summarizer API is running"
}
```

### Get Available Providers
```http
GET /api/providers
```
Returns information about available LLM providers and their status.

**Response**:
```json
{
  "providers": {
    "auto": { "available": true, "name": "Auto (Smart Fallback)", ... },
    "groq": { "available": true, "name": "Groq (Llama 3.3 70B)", ... },
    "gemini": { "available": true, "name": "Google Gemini 2.0 Flash", ... },
    "ollama": { "available": false, "name": "Ollama (Local)", ... },
    "claude": { "available": true, "name": "Claude 3.5 Sonnet", ... }
  }
}
```

### Get Trending Podcasts
```http
GET /api/trending
```
Returns a curated list of trending podcasts.

**Response**:
```json
{
  "podcasts": [
    {
      "title": "The AI Revolution: ChatGPT and Beyond",
      "description": "Deep dive into how ChatGPT is transforming industries...",
      "url": "https://www.youtube.com/watch?v=...",
      "category": "technology",
      "duration": "45 min",
      "host": "Lex Fridman",
      "trending": true
    }
  ]
}
```

### Process Podcast
```http
POST /api/process-podcast
Content-Type: application/json

{
  "podcastUrl": "https://example.com/podcast.mp3",
  "llmProvider": "auto",
  "ollamaModel": "llama3.3:70b"
}
```

**Parameters**:
- `podcastUrl` (required): URL of the podcast to analyze
- `llmProvider` (optional): One of `auto`, `groq`, `gemini`, `ollama`, `claude` (default: `auto`)
- `ollamaModel` (optional): Ollama model to use (default: `llama3.3:70b`)

**Response**:
```json
{
  "analysis": {
    "title": "Episode Title",
    "summary": "Brief summary...",
    "tldr": {
      "quickSummary": "5-minute digest...",
      "keyInsights": [...],
      "worthListening": {
        "verdict": "highly_recommended",
        "reason": "...",
        "bestFor": "..."
      }
    },
    "categories": {
      "primary": "technology",
      "secondary": ["AI", "Software"],
      "industry": "tech",
      "topics": [...]
    },
    "highlights": [...],
    "keyTakeaways": [...],
    "similarTopics": [...],
    "followUps": [...]
  },
  "transcript": "Full transcript...",
  "chapters": [...],
  "utterances": [...],
  "speakerStats": {...},
  "sentimentAnalysis": [...],
  "audioUrl": "...",
  "duration": 2700,
  "processingTime": "2.5 minutes",
  "cost": {
    "provider": "groq",
    "inputTokens": 15000,
    "outputTokens": 2000,
    "inputCost": 0.00885,
    "outputCost": 0.00158,
    "totalCost": 0.01043
  }
}
```

## 📁 Project Structure

```
podcast-summarizer/
├── backend/
│   ├── services/
│   │   ├── transcriptService.js      # AssemblyAI integration
│   │   ├── llmService.js              # Claude AI integration
│   │   ├── groqService.js             # Groq integration
│   │   ├── geminiService.js           # Google Gemini integration
│   │   ├── ollamaService.js           # Ollama integration
│   │   ├── promptTemplate.js          # Shared prompt template
│   │   └── podcastProcessor.js        # Main processing logic
│   ├── server.js                      # Express server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── PodcastInput.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── QuickDigest.jsx        # TL;DR component (NEW)
│   │   │   ├── TrendingFeed.jsx       # Trending podcasts (NEW)
│   │   │   ├── ProviderSelector.jsx   # LLM provider selector (NEW)
│   │   │   ├── EpisodeLibrary.jsx     # Saved episodes library (NEW)
│   │   │   ├── BookmarkManager.jsx    # Bookmarking system (NEW)
│   │   │   ├── QuoteCard.jsx          # Quote sharing (NEW)
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── ChapterNavigation.jsx
│   │   │   ├── SpeakerStats.jsx
│   │   │   ├── TranscriptSearch.jsx
│   │   │   ├── SentimentTimeline.jsx
│   │   │   ├── ExportOptions.jsx
│   │   │   ├── CostBreakdown.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── utils/
│   │   │   └── storageService.js      # LocalStorage management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```

## 🔧 Troubleshooting

### Backend won't start
- Ensure you have Node.js v18 or higher: `node --version`
- Check that port 3001 is not already in use: `lsof -i :3001`
- Verify your API keys are correctly set in `backend/.env`
- Check backend logs for specific error messages

### Frontend won't connect to backend
- Make sure the backend server is running first
- Check that `VITE_API_URL` in `frontend/.env` points to `http://localhost:3001`
- Verify CORS is enabled in the backend (enabled by default)
- Clear browser cache and reload

### Transcription fails
- Verify your AssemblyAI API key is valid
- Check that the podcast URL is accessible (try opening it in a browser)
- Ensure the audio file format is supported (MP3, WAV, M4A, etc.)
- Check your AssemblyAI usage limits

### AI analysis fails
- Verify at least one LLM provider API key is configured
- Check your API usage limits and credits
- Try switching to a different provider (Auto mode will try multiple providers)
- For Ollama: Ensure Ollama is running (`ollama serve`) and model is pulled

### "No providers available" error
- Configure at least one LLM provider API key in `backend/.env`
- For Ollama: Install Ollama and pull a model
- Restart the backend after adding API keys

### Ollama connection issues
- Ensure Ollama is installed and running: `ollama serve`
- Check that the model is pulled: `ollama list`
- Pull the model if needed: `ollama pull llama3.3:70b`
- Verify `OLLAMA_URL` in `.env` is correct (default: `http://localhost:11434`)

### Cost calculation is incorrect
- Each provider has different pricing tiers
- Check the latest pricing on provider websites
- Token counts are estimates based on content length
- Actual costs may vary slightly

## 🎯 Best Practices

### For Optimal Results

1. **Choose the right provider**:
   - Use **Groq** for fast, affordable analysis
   - Use **Gemini** when on a tight budget (free tier)
   - Use **Claude** when quality is paramount
   - Use **Ollama** for complete privacy

2. **URL format**:
   - Direct audio links work best: `https://example.com/podcast.mp3`
   - YouTube URLs are supported: `https://www.youtube.com/watch?v=...`
   - Ensure URLs are publicly accessible

3. **Library management**:
   - Use categories to organize episodes
   - Add bookmarks at key moments
   - Use search to quickly find content

4. **Cost optimization**:
   - Start with Auto mode for smart fallback
   - Use free tier providers (Gemini, Ollama) for testing
   - Monitor costs in the breakdown section

## 🚀 Roadmap

### Upcoming Features
- [ ] Multi-language support
- [ ] Batch processing
- [ ] Custom LLM prompts
- [ ] API webhooks
- [ ] Chrome extension
- [ ] Mobile apps (iOS/Android)
- [ ] Podcast RSS feed integration
- [ ] Mind map visualization
- [ ] Study notes generation
- [ ] Flashcard creation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💬 Support

If you encounter any issues or have questions:

1. Check the **Troubleshooting** section above
2. Review the API documentation:
   - [AssemblyAI Docs](https://www.assemblyai.com/docs)
   - [Anthropic Docs](https://docs.anthropic.com/)
   - [Groq Docs](https://console.groq.com/docs)
   - [Google AI Studio](https://ai.google.dev/)
   - [Ollama Docs](https://github.com/ollama/ollama)
3. Open an issue on [GitHub Issues](https://github.com/sjonnala/podcast-summarizer/issues)
4. Join our community discussions

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) for Claude AI
- [Groq](https://groq.com/) for ultra-fast LLM inference
- [Google](https://ai.google.dev/) for Gemini API
- [Ollama](https://ollama.ai/) for local LLM support
- [AssemblyAI](https://www.assemblyai.com/) for transcript extraction
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Vite](https://vitejs.dev/) for the build tool
- All contributors and users of this project

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

**Built with ❤️ for busy professionals who want to stay informed**
