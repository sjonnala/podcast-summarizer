import { useState } from 'react';

export default function QuickDigest({ data, onSeekTo }) {
  const [expanded, setExpanded] = useState(true);

  if (!data || !data.analysis || !data.analysis.tldr) {
    return null;
  }

  const { tldr, categories } = data.analysis;
  const verdict = tldr.worthListening?.verdict || 'recommended';

  const verdictConfig = {
    highly_recommended: {
      label: 'Highly Recommended',
      icon: '⭐',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      badgeColor: 'bg-green-600',
    },
    recommended: {
      label: 'Recommended',
      icon: '👍',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800',
      badgeColor: 'bg-blue-600',
    },
    conditional: {
      label: 'Conditionally Recommended',
      icon: '🤔',
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-800',
      badgeColor: 'bg-amber-600',
    },
    skip: {
      label: 'Consider Skipping',
      icon: '⏭️',
      color: 'slate',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-300',
      textColor: 'text-slate-800',
      badgeColor: 'bg-slate-600',
    },
  };

  const config = verdictConfig[verdict] || verdictConfig.recommended;

  const getCategoryBadgeColor = (category) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700 border-blue-300',
      business: 'bg-purple-100 text-purple-700 border-purple-300',
      finance: 'bg-green-100 text-green-700 border-green-300',
      personal_development: 'bg-pink-100 text-pink-700 border-pink-300',
      health: 'bg-red-100 text-red-700 border-red-300',
      science: 'bg-cyan-100 text-cyan-700 border-cyan-300',
      education: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      entertainment: 'bg-amber-100 text-amber-700 border-amber-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="section-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">Quick Digest</h3>
          <span className="ml-3 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
            {tldr.readingTime} min read
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
        >
          {expanded ? (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Collapse
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Expand
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Categories */}
          {categories && (
            <div className="flex flex-wrap gap-2">
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded border ${getCategoryBadgeColor(categories.primary)}`}>
                {categories.primary?.replace('_', ' ').toUpperCase()}
              </span>
              {categories.secondary?.slice(0, 3).map((tag, i) => (
                <span key={i} className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Quick Summary */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
            <div className="flex items-start">
              <span className="text-3xl mr-3">💡</span>
              <div className="flex-1">
                <h4 className="font-bold text-indigo-900 mb-2">Bottom Line</h4>
                <p className="text-slate-700 leading-relaxed">{tldr.quickSummary}</p>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Top 3 Insights
            </h4>
            <div className="space-y-3">
              {tldr.keyInsights?.map((item, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-700 font-medium mb-1">{item.insight}</p>
                      {item.snippet && (
                        <blockquote className="text-sm text-slate-500 italic border-l-2 border-slate-300 pl-3 mt-2">
                          "{item.snippet}"
                        </blockquote>
                      )}
                      {item.timestampSeconds !== undefined && onSeekTo && (
                        <button
                          onClick={() => onSeekTo(item.timestampSeconds)}
                          className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Listen from here
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Worth Listening Verdict */}
          <div className={`p-4 rounded-lg border-2 ${config.bgColor} ${config.borderColor}`}>
            <div className="flex items-start">
              <span className="text-3xl mr-3">{config.icon}</span>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className={`font-bold ${config.textColor} mr-2`}>Worth Your Time?</h4>
                  <span className={`${config.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded`}>
                    {config.label}
                  </span>
                </div>
                <p className={`${config.textColor} mb-2`}>{tldr.worthListening?.reason}</p>
                {tldr.worthListening?.bestFor && (
                  <p className="text-sm text-slate-600">
                    <strong>Best for:</strong> {tldr.worthListening.bestFor}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              ⏱️ Saved you {Math.max(1, Math.round(data.duration / 60) - tldr.readingTime)} minutes
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setExpanded(false)}
                className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Got it
              </button>
              {/* Scroll to full analysis could be added here */}
            </div>
          </div>
        </div>
      )}

      {!expanded && (
        <div className="text-center py-2">
          <button
            onClick={() => setExpanded(true)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Show {tldr.readingTime}-minute summary with key insights →
          </button>
        </div>
      )}
    </div>
  );
}
