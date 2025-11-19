import { useState, useEffect, useRef } from 'react';

export default function TranscriptSearch({ sentences, onTimestampClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchInputRef = useRef(null);

  // Format milliseconds to MM:SS or HH:MM:SS
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  // Highlight search term in text
  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Search through sentences
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    if (!sentences || sentences.length === 0) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    sentences.forEach((sentence, index) => {
      if (sentence.text.toLowerCase().includes(query)) {
        // Get context (previous and next sentence)
        const prevSentence = index > 0 ? sentences[index - 1].text : '';
        const nextSentence = index < sentences.length - 1 ? sentences[index + 1].text : '';

        results.push({
          sentence: sentence.text,
          prevContext: prevSentence,
          nextContext: nextSentence,
          timestamp: sentence.start,
          timestampFormatted: formatTime(sentence.start),
          timestampSeconds: Math.floor(sentence.start / 1000),
          speaker: sentence.speaker || null,
        });
      }
    });

    setSearchResults(results);
  }, [searchQuery, sentences]);

  // Keyboard shortcut (Ctrl/Cmd + K to focus search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsExpanded(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!sentences || sentences.length === 0) {
    return null;
  }

  return (
    <div className="section-card">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-2xl font-bold text-slate-800">Search Transcript</h3>
        {searchResults.length > 0 && (
          <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Search through the transcript... (Ctrl+K)"
          className="w-full px-4 py-3 pl-12 pr-12 text-slate-700 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && searchQuery.length >= 2 && (
        <div className="space-y-3">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-600 font-medium">No results found</p>
              <p className="text-slate-500 text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      {result.speaker && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          Speaker {result.speaker}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onTimestampClick(result.timestampSeconds)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      {result.timestampFormatted}
                    </button>
                  </div>

                  {/* Context and highlighted text */}
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {result.prevContext && (
                      <span className="text-slate-400 italic">...{result.prevContext.slice(-50)} </span>
                    )}
                    <span className="text-slate-700 font-medium">
                      {highlightText(result.sentence, searchQuery)}
                    </span>
                    {result.nextContext && (
                      <span className="text-slate-400 italic"> {result.nextContext.slice(0, 50)}...</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info box */}
      {!searchQuery && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Search through the entire podcast transcript. Use <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">Ctrl+K</kbd> or <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">⌘K</kbd> to quickly focus the search box.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
