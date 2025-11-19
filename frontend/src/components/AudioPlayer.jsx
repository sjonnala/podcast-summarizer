import { useRef, useState, useEffect } from 'react';

export default function AudioPlayer({ audioUrl, currentTime, onTimeUpdate, chapters }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(null);

  // Seek to specific time when currentTime prop changes
  useEffect(() => {
    if (audioRef.current && currentTime !== null && currentTime !== undefined) {
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTime]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentPlayTime(time);

      // Find current chapter based on playback time
      if (chapters && chapters.length > 0) {
        const timeMs = time * 1000;
        const chapter = chapters.find(ch => timeMs >= ch.start && timeMs < ch.end);
        setCurrentChapter(chapter);
      }

      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentPlayTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div
            className="h-2 bg-slate-200 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all"
              style={{ width: `${duration ? (currentPlayTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{formatTime(currentPlayTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Current Chapter Display */}
      {currentChapter && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-start">
            <svg className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-0.5">Now Playing</p>
              <p className="text-sm font-medium text-slate-700">{currentChapter.headline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  );
}
