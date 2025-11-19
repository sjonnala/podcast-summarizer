import { useState, useEffect } from 'react';
import { saveBookmark, getBookmarks, deleteBookmark, updateBookmark } from '../utils/storageService';

export default function BookmarkManager({ episodeId, currentTime, onJumpToTime }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ note: '', type: 'general' });
  const [editingId, setEditingId] = useState(null);

  // Load bookmarks
  useEffect(() => {
    if (episodeId) {
      loadBookmarks();
    }
  }, [episodeId]);

  const loadBookmarks = () => {
    const saved = getBookmarks(episodeId);
    setBookmarks(saved.sort((a, b) => a.timestampSeconds - b.timestampSeconds));
  };

  const handleAddBookmark = () => {
    if (!currentTime) {
      alert('Please play the audio first to set a timestamp');
      return;
    }

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const bookmark = {
      timestamp: formatTime(currentTime),
      timestampSeconds: currentTime,
      note: newBookmark.note,
      type: newBookmark.type,
    };

    if (saveBookmark(episodeId, bookmark)) {
      loadBookmarks();
      setNewBookmark({ note: '', type: 'general' });
      setShowAddForm(false);
    }
  };

  const handleDeleteBookmark = (id) => {
    if (confirm('Delete this bookmark?')) {
      if (deleteBookmark(id)) {
        loadBookmarks();
      }
    }
  };

  const handleUpdateBookmark = (id, updates) => {
    if (updateBookmark(id, updates)) {
      loadBookmarks();
      setEditingId(null);
    }
  };

  const bookmarkTypes = {
    general: { icon: '📌', label: 'General', color: 'blue' },
    insight: { icon: '💡', label: 'Insight', color: 'yellow' },
    question: { icon: '❓', label: 'Question', color: 'purple' },
    action: { icon: '✅', label: 'Action Item', color: 'green' },
  };

  const getTypeColors = (type) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      green: 'bg-green-50 border-green-200 text-green-700',
    };
    return colors[bookmarkTypes[type]?.color] || colors.blue;
  };

  if (!episodeId) {
    return null;
  }

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-rose-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">My Bookmarks</h3>
          {bookmarks.length > 0 && (
            <span className="ml-3 px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
              {bookmarks.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Bookmark
        </button>
      </div>

      {/* Add Bookmark Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-rose-50 rounded-lg border border-rose-200 animate-fade-in">
          <h4 className="font-semibold text-rose-900 mb-3">New Bookmark at {currentTime ? `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}` : '0:00'}</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(bookmarkTypes).map(([key, { icon, label }]) => (
                  <button
                    key={key}
                    onClick={() => setNewBookmark({ ...newBookmark, type: key })}
                    className={`p-2 rounded-lg border-2 transition-all text-sm ${
                      newBookmark.type === key
                        ? 'border-rose-500 bg-rose-100'
                        : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{icon}</div>
                    <div className="text-xs">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Note</label>
              <textarea
                value={newBookmark.note}
                onChange={(e) => setNewBookmark({ ...newBookmark, note: e.target.value })}
                placeholder="Add your note here..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
                rows="3"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddBookmark}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
              >
                Save Bookmark
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewBookmark({ note: '', type: 'general' });
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-slate-600 font-medium">No bookmarks yet</p>
          <p className="text-slate-500 text-sm mt-1">Add bookmarks to save your favorite moments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => {
            const typeInfo = bookmarkTypes[bookmark.type] || bookmarkTypes.general;
            const isEditing = editingId === bookmark.id;

            return (
              <div
                key={bookmark.id}
                className={`p-4 rounded-lg border ${getTypeColors(bookmark.type)} transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <button
                      onClick={() => onJumpToTime(bookmark.timestampSeconds)}
                      className="px-3 py-1 bg-white border border-slate-300 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      {bookmark.timestamp}
                    </button>
                    <span className="px-2 py-1 bg-white rounded-full text-xs font-medium">
                      {typeInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingId(isEditing ? null : bookmark.id)}
                      className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      defaultValue={bookmark.note}
                      onBlur={(e) => handleUpdateBookmark(bookmark.id, { note: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
                      rows="2"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 ml-10">{bookmark.note || 'No note added'}</p>
                )}

                <p className="text-xs text-slate-500 mt-2 ml-10">
                  Added {new Date(bookmark.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-200">
        <p className="text-sm text-rose-700 flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            Add bookmarks at any moment while listening. Mark insights, questions, or action items. Your bookmarks are saved locally and included in exports.
          </span>
        </p>
      </div>
    </div>
  );
}
