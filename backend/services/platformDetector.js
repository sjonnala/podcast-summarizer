/**
 * Detect podcast platform from URL
 * @param {string} url - Podcast URL
 * @returns {Object} - Platform info
 */
export function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return {
        platform: 'youtube',
        name: 'YouTube',
        icon: '▶️',
        color: 'red'
      };
    }

    // Spotify
    if (hostname.includes('spotify.com')) {
      return {
        platform: 'spotify',
        name: 'Spotify',
        icon: '🎵',
        color: 'green'
      };
    }

    // Apple Podcasts
    if (hostname.includes('podcasts.apple.com')) {
      return {
        platform: 'apple',
        name: 'Apple Podcasts',
        icon: '🎙️',
        color: 'purple'
      };
    }

    // SoundCloud
    if (hostname.includes('soundcloud.com')) {
      return {
        platform: 'soundcloud',
        name: 'SoundCloud',
        icon: '☁️',
        color: 'orange'
      };
    }

    // Generic audio file (MP3, etc.)
    if (url.match(/\.(mp3|wav|m4a|ogg|aac)$/i)) {
      return {
        platform: 'audio',
        name: 'Audio File',
        icon: '🔊',
        color: 'blue'
      };
    }

    // Default
    return {
      platform: 'other',
      name: 'Podcast',
      icon: '🎧',
      color: 'slate'
    };
  } catch (error) {
    return {
      platform: 'other',
      name: 'Podcast',
      icon: '🎧',
      color: 'slate'
    };
  }
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID
 */
export function extractYouTubeId(url) {
  try {
    const urlObj = new URL(url);

    // Handle youtu.be short URLs
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }

    // Handle youtube.com URLs
    const videoId = urlObj.searchParams.get('v');
    return videoId;
  } catch (error) {
    return null;
  }
}

/**
 * Get YouTube thumbnail URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Thumbnail URL
 */
export function getYouTubeThumbnail(videoId) {
  // Use maxresdefault for highest quality, fallback to hqdefault
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Generate VTT chapter file content from chapters array
 * @param {Array} chapters - Chapters from AssemblyAI
 * @returns {string} - VTT format content
 */
export function generateChapterVTT(chapters) {
  if (!chapters || chapters.length === 0) {
    return null;
  }

  let vtt = 'WEBVTT\n\n';

  chapters.forEach((chapter, index) => {
    const startTime = formatVTTTimestamp(chapter.start);
    const endTime = formatVTTTimestamp(chapter.end);

    vtt += `${index + 1}\n`;
    vtt += `${startTime} --> ${endTime}\n`;
    vtt += `${chapter.headline}\n\n`;
  });

  return vtt;
}

/**
 * Format milliseconds to VTT timestamp format (HH:MM:SS.mmm)
 * @param {number} ms - Milliseconds
 * @returns {string} - VTT timestamp
 */
function formatVTTTimestamp(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}
