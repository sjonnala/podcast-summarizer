import { useState } from 'react';

export default function PodcastInput({ onSubmit, disabled }) {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUrlError('');

    if (!url.trim()) {
      setUrlError('Please enter a podcast URL');
      return;
    }

    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    onSubmit(url);
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (urlError) setUrlError('');
  };

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
        Enter Podcast URL
      </h2>
      <p className="text-slate-600 mb-6 text-center">
        Paste the URL of any podcast episode to get started
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="https://example.com/podcast-episode.mp3"
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              urlError
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-white'
            }`}
            disabled={disabled}
          />
          {urlError && (
            <p className="text-red-600 text-sm mt-2 ml-1">{urlError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Analyze Podcast</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-slate-700">
          <strong className="text-blue-700">Tip:</strong> You can use direct links to MP3 files, YouTube URLs,
          or URLs from popular podcast platforms.
        </p>
      </div>
    </div>
  );
}
