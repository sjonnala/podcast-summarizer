import { useState } from 'react';
import { calculateTotalCost, getCostSavingTips, calculateMonthlyProjection } from '../utils/costCalculator';

export default function CostBreakdown({ data }) {
  const [showDetails, setShowDetails] = useState(false);
  const [episodesPerMonth, setEpisodesPerMonth] = useState(10);

  if (!data || !data.duration) {
    return null;
  }

  const costData = calculateTotalCost({
    duration: data.duration,
    transcriptLength: data.transcriptLength || 0,
    llmProvider: data.llmProvider,
  });

  const tips = getCostSavingTips(costData);
  const projection = calculateMonthlyProjection(costData.total, episodesPerMonth);

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">Cost Analysis</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200 mb-4">
        <div className="text-center">
          <p className="text-sm text-amber-700 mb-2">Total Cost for This Analysis</p>
          <p className="text-5xl font-bold text-amber-900 mb-2">{costData.totalFormatted}</p>
          <p className="text-sm text-amber-600">
            💰 {costData.breakdown.transcriptionPercent}% Transcription + {costData.breakdown.aiPercent}% AI Analysis
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-4 animate-fade-in">
          {/* Cost Breakdown */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Transcription Cost */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-blue-900 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Transcription
                </h4>
                <span className="text-2xl font-bold text-blue-700">{costData.transcription.formatted}</span>
              </div>
              <p className="text-sm text-blue-600 mb-2">
                ⏱️ {costData.transcription.duration}
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <p className="font-semibold">Features included:</p>
                <ul className="list-disc list-inside pl-2">
                  {costData.transcription.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Analysis Cost */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-purple-900 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Analysis
                </h4>
                <span className="text-2xl font-bold text-purple-700">{costData.ai.formatted}</span>
              </div>
              {costData.ai.provider && (
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    costData.ai.provider === 'groq'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : costData.ai.provider === 'claude'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}>
                    {costData.ai.provider === 'groq' && '⚡ Groq'}
                    {costData.ai.provider === 'claude' && '🧠 Claude'}
                    {!['groq', 'claude'].includes(costData.ai.provider) && costData.ai.provider}
                  </span>
                  {costData.ai.estimated && (
                    <span className="ml-2 text-xs text-purple-500">(estimated)</span>
                  )}
                </div>
              )}
              <p className="text-sm text-purple-600 mb-2">
                🤖 {costData.ai.model ? (
                  costData.ai.provider === 'groq'
                    ? 'Llama 3.3 70B'
                    : costData.ai.model.includes('claude')
                      ? 'Claude 3.5 Sonnet'
                      : costData.ai.model
                ) : 'AI Model'}
              </p>
              <p className="text-xs text-purple-600">
                {costData.ai.details}
              </p>
            </div>
          </div>

          {/* Monthly Projection */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Cost Projection
            </h4>
            <div className="flex items-center space-x-3 mb-3">
              <label className="text-sm text-green-700">Episodes per month:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={episodesPerMonth}
                onChange={(e) => setEpisodesPerMonth(parseInt(e.target.value) || 10)}
                className="w-20 px-3 py-1 border border-green-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-green-600 mb-1">Per Episode</p>
                <p className="text-lg font-bold text-green-800">{projection.perEpisodeFormatted}</p>
              </div>
              <div>
                <p className="text-xs text-green-600 mb-1">Monthly</p>
                <p className="text-lg font-bold text-green-800">{projection.monthlyFormatted}</p>
              </div>
              <div>
                <p className="text-xs text-green-600 mb-1">Yearly</p>
                <p className="text-lg font-bold text-green-800">{projection.yearlyFormatted}</p>
              </div>
            </div>
          </div>

          {/* Cost-Saving Tips */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              💡 Cost-Saving Tips
            </h4>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{tip.icon}</span>
                    <div className="flex-1">
                      <h5 className="font-semibold text-emerald-900 mb-1">{tip.title}</h5>
                      <p className="text-sm text-emerald-700 mb-2">{tip.description}</p>
                      <span className="inline-block px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                        {tip.savings}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!showDetails && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-700 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              View detailed cost breakdown, monthly projections, and money-saving tips. All costs are estimates based on current API pricing.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
