import { useState, useEffect } from 'react';
import { getSavedEpisodes, deleteEpisode, getLibraryStats, searchEpisodes, getBookmarks } from '../utils/storageService';

export default function EpisodeLibrary({ onLoadEpisode, onClose }) {
  const [episodes, setEpisodes] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const saved = getSavedEpisodes();
    setEpisodes(saved);
    setStats(getLibraryStats());
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchEpisodes(query);
      setEpisodes(results);
    } else {
      setEpisodes(getSavedEpisodes());
    }
  };

  const handleDelete = (episodeId) => {
    if (confirm('Delete this episode and all its bookmarks?')) {
      if (deleteEpisode(episodeId)) {
        loadData();
        handleSearch(searchQuery); // Refresh search results
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">My Library</h2>
                <p className="text-sm text-slate-600">{stats?.totalEpisodes || 0} episodes saved</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-700">{stats.totalEpisodes}</p>
                <p className="text-xs text-indigo-600">Episodes</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg">
                <p className="text-2xl font-bold text-rose-700">{stats.totalBookmarks}</p>
                <p className="text-xs text-rose-600">Bookmarks</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-700">{stats.totalDurationFormatted}</p>
                <p className="text-xs text-emerald-600">Total Duration</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-700">{stats.avgBookmarksPerEpisode}</p>
                <p className="text-xs text-amber-600">Avg Bookmarks</p>
              </div>
            </div>
          )}

          {/* Search and View Mode */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search episodes..."
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-slate-500'}`}
                title="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-slate-500'}`}
                title="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div className="flex-1 overflow-y-auto p-6">
          {episodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-24 h-24 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg font-semibold text-slate-600 mb-2">
                {searchQuery ? 'No episodes found' : 'Your library is empty'}
              </p>
              <p className="text-slate-500">
                {searchQuery ? 'Try a different search term' : 'Save episodes to access them later'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
              {episodes.map((episode) => {
                const bookmarkCount = getBookmarks(episode.id).length;

                return (
                  <div
                    key={episode.id}
                    className="glass-card p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      onLoadEpisode(episode.data);
                      onClose();
                    }}
                  >
                    {/* Thumbnail */}
                    {episode.data.metadata?.thumbnail && (
                      <img
                        src={episode.data.metadata.thumbnail}
                        alt={episode.data.analysis?.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}

                    {/* Platform Badge */}
                    {episode.data.metadata?.platform && (
                      <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mb-2">
                        {episode.data.metadata.platform.icon} {episode.data.metadata.platform.name}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">
                      {episode.data.analysis?.title || 'Untitled Episode'}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {episode.data.analysis?.summary || 'No summary available'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {formatDuration(episode.data.duration || 0)}
                      </span>
                      {bookmarkCount > 0 && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          {bookmarkCount}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {episode.data.analysis?.tags && episode.data.analysis.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {episode.data.analysis.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadEpisode(episode.data);
                          onClose();
                        }}
                        className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(episode.id);
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      Saved {new Date(episode.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
