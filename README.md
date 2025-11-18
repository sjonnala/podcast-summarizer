# Podcast Summarizer

An AI-powered web application that transforms podcast episodes into actionable insights. Simply provide a podcast URL, and get comprehensive analysis including highlights, key takeaways, related topics, and follow-up questions.

## Features

- **Automatic Transcript Extraction**: Extracts transcripts from podcast audio files using AssemblyAI
- **AI-Powered Analysis**: Leverages Claude AI to analyze and summarize podcast content
- **Highlights**: Get the most memorable moments from the episode
- **Key Takeaways**: Actionable insights and important points
- **Topic Mapping**: Discover related topics and concepts
- **Follow-Up Questions**: Suggested areas for deeper exploration
- **Beautiful UI**: Clean, modern interface built with React and Tailwind CSS
- **Real-time Processing**: See progress as your podcast is being analyzed

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **AssemblyAI** - Transcript extraction service
- **Anthropic Claude** - AI analysis and summarization

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- API keys for:
  - [Anthropic (Claude AI)](https://console.anthropic.com/)
  - [AssemblyAI](https://www.assemblyai.com/)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
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
cp .env.example .env
```

Edit `backend/.env` and add your API keys:

```env
PORT=3001
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```

#### Frontend Configuration (Optional)

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

The default configuration should work for local development:

```env
VITE_API_URL=http://localhost:3001
```

## Getting Your API Keys

### Anthropic (Claude AI)
1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it into your `.env` file

### AssemblyAI
1. Visit [https://www.assemblyai.com/](https://www.assemblyai.com/)
2. Sign up for a free account
3. Go to your dashboard
4. Copy your API key
5. Paste it into your `.env` file

## Running the Application

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
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Production Build

Build the frontend for production:

```bash
npm run build
```

The built files will be in `frontend/dist/`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a podcast URL (direct MP3 link, YouTube URL, or podcast platform URL)
3. Click "Analyze Podcast"
4. Wait while the application:
   - Extracts the transcript from the audio
   - Analyzes the content with AI
   - Generates insights and summaries
5. Review your results:
   - **Summary**: Quick overview of the episode
   - **Highlights**: Key moments and memorable quotes
   - **Key Takeaways**: Actionable insights
   - **Related Topics**: Similar concepts and areas
   - **Follow-Up Questions**: Areas for deeper exploration

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the health status of the API server.

### Process Podcast
```
POST /api/process-podcast
Content-Type: application/json

{
  "podcastUrl": "https://example.com/podcast.mp3"
}
```

Returns comprehensive analysis of the podcast including transcript and AI-generated insights.

## Project Structure

```
podcast-summarizer/
├── backend/
│   ├── services/
│   │   ├── transcriptService.js    # AssemblyAI integration
│   │   ├── llmService.js            # Claude AI integration
│   │   └── podcastProcessor.js      # Main processing logic
│   ├── server.js                    # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── PodcastInput.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── Results.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── services/
│   │   │   └── api.js               # API client
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

## Features in Detail

### Transcript Extraction
- Uses AssemblyAI's advanced speech-to-text API
- Supports multiple audio formats
- Includes chapter detection for better structure
- Real-time polling for transcription status

### AI Analysis
- Powered by Claude 3.5 Sonnet (Anthropic's latest model)
- Generates structured JSON responses
- Creates meaningful summaries and insights
- Maps related topics and suggests follow-up questions

### User Interface
- Responsive design works on all devices
- Real-time loading states with progress indicators
- Beautiful gradient designs and smooth animations
- Error handling with helpful messages
- Clean, intuitive workflow

## Troubleshooting

### Backend won't start
- Ensure you have Node.js v18 or higher installed
- Check that port 3001 is not already in use
- Verify your API keys are correctly set in `backend/.env`

### Frontend won't connect to backend
- Make sure the backend server is running
- Check that `VITE_API_URL` in `frontend/.env` points to the correct backend URL
- Verify CORS is enabled in the backend

### Transcription fails
- Verify your AssemblyAI API key is valid
- Check that the podcast URL is accessible
- Ensure the audio file format is supported

### AI analysis fails
- Verify your Anthropic API key is valid
- Check your API usage limits
- Ensure you have sufficient credits

## Demo Mode

If API keys are not configured, the application will use mock data for demonstration purposes. This allows you to test the UI without setting up external services.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the API documentation for [AssemblyAI](https://www.assemblyai.com/docs) and [Anthropic](https://docs.anthropic.com/)
3. Open an issue on GitHub

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for Claude AI
- [AssemblyAI](https://www.assemblyai.com/) for transcript extraction
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Vite](https://vitejs.dev/) for the build tool
