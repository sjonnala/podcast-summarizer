import { useState } from 'react';
import Header from './components/Header';
import PodcastInput from './components/PodcastInput';
import LoadingState from './components/LoadingState';
import Results from './components/Results';
import ErrorMessage from './components/ErrorMessage';
import EpisodeLibrary from './components/EpisodeLibrary';
import { processPodcast } from './services/api';
import { saveEpisode } from './utils/storageService';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (url) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await processPodcast(url);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to process podcast. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setSaved(false);
  };

  const handleSaveEpisode = () => {
    if (results && saveEpisode(results)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleLoadEpisode = (data) => {
    setResults(data);
    setSaved(false);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!loading && !results && (
          <div className="max-w-2xl mx-auto">
            <PodcastInput onSubmit={handleSubmit} disabled={loading} />
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            {/* Library Access Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLibrary(true)}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Open My Library
              </button>
            </div>
          </div>
        )}

        {loading && <LoadingState />}

        {!loading && results && (
          <Results
            data={results}
            onReset={handleReset}
            onSave={handleSaveEpisode}
            saved={saved}
          />
        )}
      </main>

      {/* Episode Library Modal */}
      {showLibrary && (
        <EpisodeLibrary
          onLoadEpisode={handleLoadEpisode}
          onClose={() => setShowLibrary(false)}
        />
      )}

      <footer className="text-center text-slate-600 text-sm mt-12">
        <p>Powered by Claude AI & AssemblyAI</p>
      </footer>
    </div>
  );
}

export default App;
