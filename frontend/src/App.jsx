import { useState } from 'react';
import Header from './components/Header';
import PodcastInput from './components/PodcastInput';
import LoadingState from './components/LoadingState';
import Results from './components/Results';
import ErrorMessage from './components/ErrorMessage';
import { processPodcast } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

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
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!loading && !results && (
          <div className="max-w-2xl mx-auto">
            <PodcastInput onSubmit={handleSubmit} disabled={loading} />
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
          </div>
        )}

        {loading && <LoadingState />}

        {!loading && results && (
          <Results data={results} onReset={handleReset} />
        )}
      </main>

      <footer className="text-center text-slate-600 text-sm mt-12">
        <p>Powered by Claude AI & AssemblyAI</p>
      </footer>
    </div>
  );
}

export default App;
