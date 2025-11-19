export default function SpeakerStats({ speakerStats, utterances, duration }) {
  // If no speaker data available, don't render anything
  if (!speakerStats || speakerStats.length === 0) {
    return null;
  }

  // Format milliseconds to minutes and seconds
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Calculate total speaking time across all speakers
  const totalSpeakingTime = speakerStats.reduce((sum, stat) => sum + stat.totalTime, 0);

  // Assign colors to speakers
  const speakerColors = [
    { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500', border: 'border-blue-300' },
    { bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500', border: 'border-purple-300' },
    { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500', border: 'border-green-300' },
    { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500', border: 'border-orange-300' },
    { bg: 'bg-pink-100', text: 'text-pink-700', bar: 'bg-pink-500', border: 'border-pink-300' },
    { bg: 'bg-teal-100', text: 'text-teal-700', bar: 'bg-teal-500', border: 'border-teal-300' },
  ];

  return (
    <div className="section-card">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <h3 className="text-2xl font-bold text-slate-800">Speakers</h3>
        <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          {speakerStats.length} {speakerStats.length === 1 ? 'speaker' : 'speakers'}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {speakerStats.map((stat, index) => {
          const colors = speakerColors[index % speakerColors.length];
          const percentage = ((stat.totalTime / totalSpeakingTime) * 100).toFixed(1);

          return (
            <div
              key={stat.speaker}
              className={`p-4 ${colors.bg} rounded-lg border ${colors.border} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${colors.bar} text-white flex items-center justify-center font-bold mr-3`}>
                    {stat.speaker}
                  </div>
                  <div>
                    <h4 className={`font-bold ${colors.text} text-lg`}>
                      Speaker {stat.speaker}
                    </h4>
                    <p className={`text-sm ${colors.text} opacity-75`}>
                      {stat.utteranceCount} {stat.utteranceCount === 1 ? 'segment' : 'segments'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colors.text}`}>{percentage}%</div>
                  <div className={`text-xs ${colors.text} opacity-75`}>of conversation</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Speaking time */}
              <div className="flex items-center justify-between text-sm">
                <span className={`${colors.text} opacity-75 flex items-center`}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {formatDuration(stat.totalTime)}
                </span>
                <span className={`${colors.text} opacity-75`}>
                  speaking time
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall stats */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-800">{speakerStats.length}</div>
            <div className="text-xs text-slate-600">Total Speakers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {speakerStats.reduce((sum, stat) => sum + stat.utteranceCount, 0)}
            </div>
            <div className="text-xs text-slate-600">Total Segments</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{formatDuration(totalSpeakingTime)}</div>
            <div className="text-xs text-slate-600">Total Speaking</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {(speakerStats.reduce((sum, stat) => sum + stat.utteranceCount, 0) / speakerStats.length).toFixed(0)}
            </div>
            <div className="text-xs text-slate-600">Avg Turns/Speaker</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-700 flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Speaker labels are automatically detected using AI. Speaker identities are labeled alphabetically (A, B, C, etc.) based on when they first appear in the conversation.</span>
        </p>
      </div>
    </div>
  );
}
