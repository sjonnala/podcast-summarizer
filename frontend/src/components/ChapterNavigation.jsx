export default function ChapterNavigation({ chapters, onChapterClick }) {
  // If no chapters available, don't render anything
  if (!chapters || chapters.length === 0) {
    return null;
  }

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

  return (
    <div className="section-card">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
        <h3 className="text-2xl font-bold text-slate-800">Chapters</h3>
        <span className="ml-3 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
          {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
        </span>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const startTime = formatTime(chapter.start);
          const endTime = formatTime(chapter.end);
          const durationSecs = Math.floor((chapter.end - chapter.start) / 1000);
          const durationMins = Math.floor(durationSecs / 60);
          const startSeconds = Math.floor(chapter.start / 1000);

          return (
            <button
              key={index}
              onClick={() => onChapterClick(startSeconds)}
              className="w-full text-left p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 hover:from-indigo-100 hover:to-blue-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-indigo-900 text-lg group-hover:text-indigo-700 transition-colors">
                      {chapter.headline}
                    </h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed ml-11">
                    {chapter.summary}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 ml-11 text-xs text-slate-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {startTime} - {endTime}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      {durationMins} {durationMins === 1 ? 'minute' : 'minutes'}
                    </span>
                  </div>
                </div>
                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700 flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Click on any chapter to jump to that section in the audio player.</span>
        </p>
      </div>
    </div>
  );
}
