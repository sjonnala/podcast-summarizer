import { useState, useEffect } from 'react';

export default function TrendingFeed({ onSelectPodcast, onClose }) {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTrendingPodcasts();
  }, []);

  const fetchTrendingPodcasts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/trending');
      const data = await response.json();
      setPodcasts(data.podcasts || []);
    } catch (error) {
      console.error('Failed to fetch trending podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'technology', 'business', 'finance', 'personal_development'];

  const filteredPodcasts = selectedCategory === 'all'
    ? podcasts
    : podcasts.filter(p => p.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700',
      business: 'bg-purple-100 text-purple-700',
      finance: 'bg-green-100 text-green-700',
      personal_development: 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Trending Podcasts</h2>
                <p className="text-sm text-slate-600">Curated content for busy professionals</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-indigo-50'
                }`}
              >
                {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPodcasts.map((podcast, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(podcast.category)}`}>
                      {podcast.category?.replace('_', ' ').toUpperCase()}
                    </span>
                    {podcast.trending && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                        🔥 TRENDING
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{podcast.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{podcast.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>⏱️ {podcast.duration}</span>
                    <span>👤 {podcast.host}</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPodcast(podcast.url);
                      onClose();
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Analyze This Podcast
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredPodcasts.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-500">No trending podcasts in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
