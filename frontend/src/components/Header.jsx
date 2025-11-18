export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <svg
              className="w-12 h-12 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            <h1 className="text-4xl font-bold">Podcast Summarizer</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Transform any podcast into actionable insights with AI-powered analysis.
            Get highlights, key takeaways, and topic mapping in seconds.
          </p>
        </div>
      </div>
    </header>
  );
}
