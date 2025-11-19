/**
 * LocalStorage service for managing saved episodes, bookmarks, and user data
 */

const STORAGE_KEYS = {
  EPISODES: 'podcast_summarizer_episodes',
  BOOKMARKS: 'podcast_summarizer_bookmarks',
  SETTINGS: 'podcast_summarizer_settings',
};

/**
 * Save episode to library
 * @param {Object} episodeData - Complete episode data
 * @returns {boolean} - Success status
 */
export function saveEpisode(episodeData) {
  try {
    const episodes = getSavedEpisodes();

    // Create episode object with metadata
    const episode = {
      id: generateEpisodeId(episodeData),
      savedAt: new Date().toISOString(),
      data: episodeData,
    };

    // Check if episode already exists
    const existingIndex = episodes.findIndex(ep => ep.id === episode.id);

    if (existingIndex >= 0) {
      // Update existing episode
      episodes[existingIndex] = episode;
    } else {
      // Add new episode
      episodes.unshift(episode); // Add to beginning
    }

    localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
    return true;
  } catch (error) {
    console.error('Failed to save episode:', error);
    return false;
  }
}

/**
 * Get all saved episodes
 * @returns {Array} - Array of saved episodes
 */
export function getSavedEpisodes() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EPISODES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get saved episodes:', error);
    return [];
  }
}

/**
 * Delete episode from library
 * @param {string} episodeId - Episode ID
 * @returns {boolean} - Success status
 */
export function deleteEpisode(episodeId) {
  try {
    const episodes = getSavedEpisodes();
    const filtered = episodes.filter(ep => ep.id !== episodeId);
    localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(filtered));

    // Also delete associated bookmarks
    const bookmarks = getBookmarks();
    const filteredBookmarks = bookmarks.filter(b => b.episodeId !== episodeId);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filteredBookmarks));

    return true;
  } catch (error) {
    console.error('Failed to delete episode:', error);
    return false;
  }
}

/**
 * Generate unique episode ID
 * @param {Object} episodeData - Episode data
 * @returns {string} - Unique ID
 */
function generateEpisodeId(episodeData) {
  // Use URL or title + timestamp
  const base = episodeData.podcastUrl || episodeData.analysis?.title || '';
  return btoa(base).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
}

/**
 * Save bookmark
 * @param {string} episodeId - Episode ID
 * @param {Object} bookmark - Bookmark data
 * @returns {boolean} - Success status
 */
export function saveBookmark(episodeId, bookmark) {
  try {
    const bookmarks = getBookmarks();

    const newBookmark = {
      id: Date.now().toString(),
      episodeId: episodeId,
      timestamp: bookmark.timestamp,
      timestampSeconds: bookmark.timestampSeconds,
      note: bookmark.note || '',
      type: bookmark.type || 'general', // general, insight, question, action
      speaker: bookmark.speaker || null,
      chapter: bookmark.chapter || null,
      text: bookmark.text || '',
      createdAt: new Date().toISOString(),
    };

    bookmarks.push(newBookmark);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error('Failed to save bookmark:', error);
    return false;
  }
}

/**
 * Get all bookmarks or bookmarks for specific episode
 * @param {string} episodeId - Optional episode ID
 * @returns {Array} - Array of bookmarks
 */
export function getBookmarks(episodeId = null) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    const allBookmarks = data ? JSON.parse(data) : [];

    if (episodeId) {
      return allBookmarks.filter(b => b.episodeId === episodeId);
    }

    return allBookmarks;
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
}

/**
 * Update bookmark
 * @param {string} bookmarkId - Bookmark ID
 * @param {Object} updates - Updates to apply
 * @returns {boolean} - Success status
 */
export function updateBookmark(bookmarkId, updates) {
  try {
    const bookmarks = getBookmarks();
    const index = bookmarks.findIndex(b => b.id === bookmarkId);

    if (index >= 0) {
      bookmarks[index] = { ...bookmarks[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to update bookmark:', error);
    return false;
  }
}

/**
 * Delete bookmark
 * @param {string} bookmarkId - Bookmark ID
 * @returns {boolean} - Success status
 */
export function deleteBookmark(bookmarkId) {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== bookmarkId);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    return false;
  }
}

/**
 * Get library statistics
 * @returns {Object} - Statistics
 */
export function getLibraryStats() {
  const episodes = getSavedEpisodes();
  const bookmarks = getBookmarks();

  let totalDuration = 0;
  let totalCost = 0;
  const platforms = {};

  episodes.forEach(ep => {
    if (ep.data.duration) {
      totalDuration += ep.data.duration;
    }

    const platform = ep.data.metadata?.platform?.name || 'Unknown';
    platforms[platform] = (platforms[platform] || 0) + 1;
  });

  return {
    totalEpisodes: episodes.length,
    totalBookmarks: bookmarks.length,
    totalDuration: totalDuration,
    totalDurationFormatted: formatDuration(totalDuration),
    platforms: platforms,
    avgBookmarksPerEpisode: episodes.length > 0 ? (bookmarks.length / episodes.length).toFixed(1) : 0,
  };
}

/**
 * Format duration in seconds to readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Search episodes by query
 * @param {string} query - Search query
 * @returns {Array} - Filtered episodes
 */
export function searchEpisodes(query) {
  const episodes = getSavedEpisodes();
  const lowerQuery = query.toLowerCase();

  return episodes.filter(ep => {
    const title = ep.data.analysis?.title?.toLowerCase() || '';
    const summary = ep.data.analysis?.summary?.toLowerCase() || '';
    const tags = ep.data.analysis?.tags?.join(' ').toLowerCase() || '';

    return title.includes(lowerQuery) ||
           summary.includes(lowerQuery) ||
           tags.includes(lowerQuery);
  });
}

/**
 * Clear all data (use with caution)
 */
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.EPISODES);
  localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
}
