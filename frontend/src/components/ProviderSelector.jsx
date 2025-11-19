import { useState, useEffect } from 'react';

export default function ProviderSelector({ selectedProvider, onProviderChange, disabled }) {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/providers');
      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-sm text-slate-600">Loading providers...</span>
      </div>
    );
  }

  if (!providers) {
    return null;
  }

  const providerKeys = ['auto', 'groq', 'gemini', 'ollama', 'claude'];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-slate-700">
          AI Provider
        </label>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Provider Selection Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {providerKeys.map(key => {
          const provider = providers[key];
          if (!provider) return null;

          const isSelected = selectedProvider === key;
          const isAvailable = provider.available;

          return (
            <button
              key={key}
              onClick={() => isAvailable && !disabled && onProviderChange(key)}
              disabled={!isAvailable || disabled}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : isAvailable
                  ? 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">{provider.icon}</span>
                {isSelected && (
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {!isAvailable && (
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-700 mb-1 line-clamp-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              <div className="text-xs text-slate-500 line-clamp-2">
                {showDetails ? provider.description : provider.cost}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Info Panel */}
      {showDetails && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-3">Provider Comparison</h4>
          <div className="space-y-2 text-sm">
            {providerKeys.map(key => {
              const provider = providers[key];
              if (!provider) return null;

              return (
                <div key={key} className="flex items-start">
                  <span className="text-lg mr-2">{provider.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-700">{provider.name}</div>
                    <div className="text-xs text-slate-600">{provider.description}</div>
                    <div className="text-xs text-slate-500 mt-1">Cost: {provider.cost}</div>
                    {key === 'ollama' && provider.models && provider.models.length > 0 && (
                      <div className="text-xs text-slate-500 mt-1">
                        Available models: {provider.models.map(m => m.name).slice(0, 3).join(', ')}
                        {provider.models.length > 3 && ` +${provider.models.length - 3} more`}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    provider.available
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {provider.available ? 'Available' : 'Not configured'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Setup Instructions */}
          <div className="mt-4 pt-4 border-t border-slate-300">
            <p className="text-xs text-slate-600 mb-2">
              <strong>Setup:</strong> Configure providers in <code className="bg-slate-200 px-1 rounded">backend/.env</code>
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>• Groq: Free tier at console.groq.com</div>
              <div>• Gemini: Free at aistudio.google.com/app/apikey</div>
              <div>• Ollama: Install from ollama.com/download (local, free)</div>
              <div>• Claude: Get key at console.anthropic.com (premium)</div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for unavailable provider */}
      {!providers[selectedProvider]?.available && selectedProvider !== 'auto' && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <div className="font-semibold text-amber-800">Provider not configured</div>
              <div className="text-amber-700 mt-1">
                The selected provider is not available. Configure it in backend/.env or choose "Auto" to use available providers automatically.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
