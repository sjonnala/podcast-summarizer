export default function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-3">
          Processing Your Podcast
        </h3>
        <p className="text-slate-600 mb-8">
          This may take a few moments while we extract and analyze the content...
        </p>

        <div className="space-y-3 text-left max-w-md mx-auto">
          <LoadingStep
            text="Extracting transcript from audio"
            delay="0s"
          />
          <LoadingStep
            text="Analyzing content with AI"
            delay="1s"
          />
          <LoadingStep
            text="Generating highlights and insights"
            delay="2s"
          />
          <LoadingStep
            text="Mapping related topics"
            delay="3s"
          />
        </div>
      </div>
    </div>
  );
}

function LoadingStep({ text, delay }) {
  return (
    <div
      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg animate-pulse"
      style={{ animationDelay: delay }}
    >
      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
      <span className="text-slate-700">{text}</span>
    </div>
  );
}
