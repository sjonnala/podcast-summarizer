import { useState } from 'react';

export default function SentimentTimeline({ sentimentAnalysis, sentimentStats, duration, onTimestampClick }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // If no sentiment data available, don't render anything
  if (!sentimentAnalysis || sentimentAnalysis.length === 0) {
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

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return {
          bg: 'bg-green-500',
          light: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-300',
          icon: '😊',
          label: 'Positive'
        };
      case 'NEGATIVE':
        return {
          bg: 'bg-red-500',
          light: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-300',
          icon: '😟',
          label: 'Negative'
        };
      case 'NEUTRAL':
        return {
          bg: 'bg-slate-400',
          light: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-300',
          icon: '😐',
          label: 'Neutral'
        };
      default:
        return {
          bg: 'bg-slate-400',
          light: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-300',
          icon: '😐',
          label: 'Unknown'
        };
    }
  };

  // Calculate total segments
  const totalSegments = sentimentStats.positive + sentimentStats.negative + sentimentStats.neutral;

  // Calculate percentages
  const positivePercent = totalSegments > 0 ? ((sentimentStats.positive / totalSegments) * 100).toFixed(1) : 0;
  const negativePercent = totalSegments > 0 ? ((sentimentStats.negative / totalSegments) * 100).toFixed(1) : 0;
  const neutralPercent = totalSegments > 0 ? ((sentimentStats.neutral / totalSegments) * 100).toFixed(1) : 0;

  // Overall sentiment
  const getOverallSentiment = () => {
    if (sentimentStats.positive > sentimentStats.negative && sentimentStats.positive > sentimentStats.neutral) {
      return { label: 'Positive', color: 'text-green-600', bg: 'bg-green-100', icon: '😊' };
    } else if (sentimentStats.negative > sentimentStats.positive && sentimentStats.negative > sentimentStats.neutral) {
      return { label: 'Negative', color: 'text-red-600', bg: 'bg-red-100', icon: '😟' };
    } else {
      return { label: 'Neutral', color: 'text-slate-600', bg: 'bg-slate-100', icon: '😐' };
    }
  };

  const overallSentiment = getOverallSentiment();

  return (
    <div className="section-card">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <h3 className="text-2xl font-bold text-slate-800">Sentiment Analysis</h3>
        <span className={`ml-3 px-3 py-1 ${overallSentiment.bg} ${overallSentiment.color} rounded-full text-sm font-medium flex items-center`}>
          <span className="mr-1">{overallSentiment.icon}</span>
          Overall: {overallSentiment.label}
        </span>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">😊</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">{positivePercent}%</div>
              <div className="text-xs text-green-600">Positive</div>
            </div>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${positivePercent}%` }} />
          </div>
          <div className="text-xs text-green-600 mt-1">{sentimentStats.positive} segments</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">😐</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-700">{neutralPercent}%</div>
              <div className="text-xs text-slate-600">Neutral</div>
            </div>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-slate-400 transition-all" style={{ width: `${neutralPercent}%` }} />
          </div>
          <div className="text-xs text-slate-600 mt-1">{sentimentStats.neutral} segments</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">😟</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-700">{negativePercent}%</div>
              <div className="text-xs text-red-600">Negative</div>
            </div>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all" style={{ width: `${negativePercent}%` }} />
          </div>
          <div className="text-xs text-red-600 mt-1">{sentimentStats.negative} segments</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Emotional Timeline</h4>
        <div className="relative h-16 bg-slate-100 rounded-lg overflow-hidden">
          {sentimentAnalysis.map((segment, index) => {
            const colors = getSentimentColor(segment.sentiment);
            const startPercent = (segment.start / duration) * 100;
            const widthPercent = ((segment.end - segment.start) / duration) * 100;

            return (
              <button
                key={index}
                className={`absolute top-0 h-full ${colors.bg} hover:opacity-80 transition-opacity cursor-pointer border-r border-white`}
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`
                }}
                onClick={() => onTimestampClick && onTimestampClick(Math.floor(segment.start / 1000))}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                title={`${colors.label}: ${segment.text.substring(0, 100)}...`}
              />
            );
          })}
        </div>
        {hoveredSegment !== null && sentimentAnalysis[hoveredSegment] && (
          <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className={`font-semibold ${getSentimentColor(sentimentAnalysis[hoveredSegment].sentiment).text}`}>
                {getSentimentColor(sentimentAnalysis[hoveredSegment].sentiment).icon}{' '}
                {getSentimentColor(sentimentAnalysis[hoveredSegment].sentiment).label}
              </span>
              <span className="text-slate-500 text-xs">
                {formatTime(sentimentAnalysis[hoveredSegment].start)} - {formatTime(sentimentAnalysis[hoveredSegment].end)}
              </span>
            </div>
            <p className="text-slate-700">{sentimentAnalysis[hoveredSegment].text}</p>
          </div>
        )}
      </div>

      {/* Sentiment Flow Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Sentiment Distribution</h4>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {sentimentStats.positive > 0 && (
            <div
              className="bg-green-500 h-full transition-all"
              style={{ width: `${positivePercent}%` }}
              title={`Positive: ${positivePercent}%`}
            />
          )}
          {sentimentStats.neutral > 0 && (
            <div
              className="bg-slate-400 h-full transition-all"
              style={{ width: `${neutralPercent}%` }}
              title={`Neutral: ${neutralPercent}%`}
            />
          )}
          {sentimentStats.negative > 0 && (
            <div
              className="bg-red-500 h-full transition-all"
              style={{ width: `${negativePercent}%` }}
              title={`Negative: ${negativePercent}%`}
            />
          )}
        </div>
      </div>

      {/* Recent Sentiment Moments */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Key Emotional Moments</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sentimentAnalysis
            .filter(s => s.sentiment !== 'NEUTRAL')
            .slice(0, 10)
            .map((segment, index) => {
              const colors = getSentimentColor(segment.sentiment);
              return (
                <button
                  key={index}
                  onClick={() => onTimestampClick && onTimestampClick(Math.floor(segment.start / 1000))}
                  className={`w-full text-left p-3 ${colors.light} rounded-lg border ${colors.border} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`flex items-center ${colors.text} font-medium text-sm`}>
                      <span className="text-lg mr-2">{colors.icon}</span>
                      {colors.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatTime(segment.start)}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm line-clamp-2">{segment.text}</p>
                </button>
              );
            })}
        </div>
      </div>

      {/* Info box */}
      <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
        <p className="text-sm text-pink-700 flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            Sentiment is automatically detected using AI. Hover over the timeline to see details, or click any segment to jump to that moment.
          </span>
        </p>
      </div>
    </div>
  );
}
