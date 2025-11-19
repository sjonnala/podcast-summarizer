/**
 * Cost calculation service for API usage tracking
 * Pricing as of 2024/2025 - may need updates
 */

// Pricing constants (USD)
const PRICING = {
  // AssemblyAI pricing (per second of audio)
  assemblyai: {
    transcription: 0.00025, // $0.00025/second = $0.015/minute
    // Speaker diarization, sentiment, chapters included in base price
  },

  // Anthropic Claude pricing (per million tokens)
  claude: {
    'claude-3-5-sonnet-20241022': {
      input: 3.00,   // $3 per million input tokens
      output: 15.00, // $15 per million output tokens
    },
    'claude-3-haiku-20240307': {
      input: 0.25,   // $0.25 per million input tokens
      output: 1.25,  // $1.25 per million output tokens
    },
  },

  // Groq pricing (per million tokens) - Llama 3.3 70B
  groq: {
    'llama-3.3-70b-versatile': {
      input: 0.59,   // $0.59 per million input tokens
      output: 0.79,  // $0.79 per million output tokens
    },
    'llama-3.1-70b-versatile': {
      input: 0.59,
      output: 0.79,
    },
  },

  // Gemini pricing (per million tokens) - Gemini 2.0 Flash
  gemini: {
    'gemini-2.0-flash-exp': {
      input: 0.075,  // $0.075 per million input tokens (over 128K)
      output: 0.30,  // $0.30 per million output tokens (over 128K)
      freeLimit: 128000, // FREE up to 128K tokens
    },
  },

  // Ollama - Local processing (always free)
  ollama: {
    cost: 0, // Free
  },
};

/**
 * Calculate AssemblyAI transcription cost
 * @param {number} durationSeconds - Audio duration in seconds
 * @returns {Object} - Cost breakdown
 */
export function calculateTranscriptionCost(durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) {
    return { cost: 0, details: 'No audio processed' };
  }

  const cost = durationSeconds * PRICING.assemblyai.transcription;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);

  return {
    cost: cost,
    formatted: `$${cost.toFixed(4)}`,
    duration: `${minutes}m ${seconds}s`,
    details: `${durationSeconds.toFixed(0)} seconds at $${PRICING.assemblyai.transcription}/second`,
    features: ['Transcription', 'Speaker Diarization', 'Sentiment Analysis', 'Auto Chapters'],
  };
}

/**
 * Calculate LLM cost from actual usage data (if available from backend)
 * @param {Object} llmProvider - LLM provider info from backend
 * @returns {Object} - Cost breakdown
 */
export function calculateLLMCostFromUsage(llmProvider) {
  if (!llmProvider || !llmProvider.provider || !llmProvider.usage) {
    return { cost: 0, details: 'No LLM data available', estimated: true };
  }

  const { provider, model, usage } = llmProvider;
  const { promptTokens, completionTokens, totalTokens } = usage;

  let pricing, totalCost;

  if (provider === 'groq') {
    pricing = PRICING.groq[model] || PRICING.groq['llama-3.3-70b-versatile'];
    const inputCost = (promptTokens / 1_000_000) * pricing.input;
    const outputCost = (completionTokens / 1_000_000) * pricing.output;
    totalCost = inputCost + outputCost;
  } else if (provider === 'claude') {
    pricing = PRICING.claude[model] || PRICING.claude['claude-3-5-sonnet-20241022'];
    const inputCost = (promptTokens / 1_000_000) * pricing.input;
    const outputCost = (completionTokens / 1_000_000) * pricing.output;
    totalCost = inputCost + outputCost;
  } else if (provider === 'gemini') {
    pricing = PRICING.gemini[model] || PRICING.gemini['gemini-2.0-flash-exp'];
    // Gemini is FREE up to 128K tokens
    if (totalTokens < pricing.freeLimit) {
      totalCost = 0;
    } else {
      const inputCost = (promptTokens / 1_000_000) * pricing.input;
      const outputCost = (completionTokens / 1_000_000) * pricing.output;
      totalCost = inputCost + outputCost;
    }
  } else if (provider === 'ollama') {
    totalCost = 0; // Ollama is always free
  } else {
    return { cost: 0, details: 'Unknown provider', estimated: true };
  }

  return {
    cost: totalCost,
    formatted: `$${totalCost.toFixed(6)}`,
    inputTokens: promptTokens,
    outputTokens: completionTokens,
    details: totalCost === 0 && (provider === 'gemini' || provider === 'ollama')
      ? `${promptTokens.toLocaleString()} input + ${completionTokens.toLocaleString()} output tokens (FREE)`
      : `${promptTokens.toLocaleString()} input + ${completionTokens.toLocaleString()} output tokens`,
    model: model,
    provider: provider,
    estimated: false,
  };
}

/**
 * Estimate Claude AI cost based on transcript length (fallback)
 * @param {number} transcriptLength - Character length of transcript
 * @param {string} model - Model name
 * @returns {Object} - Cost breakdown
 */
export function estimateClaudeCost(transcriptLength, model = 'claude-3-5-sonnet-20241022') {
  if (!transcriptLength || transcriptLength <= 0) {
    return { cost: 0, details: 'No text analyzed' };
  }

  // Rough estimation: ~4 characters per token
  const estimatedInputTokens = Math.ceil(transcriptLength / 4);

  // Estimated output tokens (analysis is typically 10-20% of input)
  const estimatedOutputTokens = Math.ceil(estimatedInputTokens * 0.15);

  const pricing = PRICING.claude[model] || PRICING.claude['claude-3-5-sonnet-20241022'];

  const inputCost = (estimatedInputTokens / 1_000_000) * pricing.input;
  const outputCost = (estimatedOutputTokens / 1_000_000) * pricing.output;
  const totalCost = inputCost + outputCost;

  return {
    cost: totalCost,
    formatted: `$${totalCost.toFixed(4)}`,
    inputTokens: estimatedInputTokens,
    outputTokens: estimatedOutputTokens,
    details: `~${estimatedInputTokens.toLocaleString()} input + ~${estimatedOutputTokens.toLocaleString()} output tokens`,
    model: model,
    estimated: true,
  };
}

/**
 * Calculate total processing cost
 * @param {Object} data - Processing data
 * @returns {Object} - Complete cost breakdown
 */
export function calculateTotalCost(data) {
  const { duration, transcriptLength, llmProvider } = data;

  const transcriptionCost = calculateTranscriptionCost(duration);

  // Use actual LLM usage if available, otherwise estimate
  let aiCost;
  if (llmProvider && llmProvider.provider) {
    aiCost = calculateLLMCostFromUsage(llmProvider);
  } else {
    aiCost = estimateClaudeCost(transcriptLength);
  }

  const total = transcriptionCost.cost + aiCost.cost;

  return {
    total: total,
    totalFormatted: `$${total.toFixed(6)}`,
    transcription: transcriptionCost,
    ai: aiCost,
    breakdown: {
      transcriptionPercent: total > 0 ? ((transcriptionCost.cost / total) * 100).toFixed(1) : 0,
      aiPercent: total > 0 ? ((aiCost.cost / total) * 100).toFixed(1) : 0,
    },
  };
}

/**
 * Get cost-saving tips
 * @param {Object} costData - Cost data from calculation
 * @returns {Array} - Array of tips
 */
export function getCostSavingTips(costData) {
  const tips = [];

  // Suggest free options if using Claude or Groq
  if (costData.ai && costData.ai.provider === 'claude') {
    tips.push({
      icon: '⚡',
      title: 'Switch to Groq, Gemini, or Ollama',
      description: 'Try Groq (80-90% cheaper), Gemini (FREE tier), or Ollama (100% free & private). Select provider before processing.',
      savings: 'Save 80-100% on AI processing',
    });
  }

  // Celebrate free options
  if (costData.ai && (costData.ai.provider === 'gemini' || costData.ai.provider === 'ollama')) {
    tips.push({
      icon: '🎉',
      title: `You're using ${costData.ai.provider === 'gemini' ? 'Gemini' : 'Ollama'} - zero cost!`,
      description: costData.ai.provider === 'gemini'
        ? 'Gemini offers a generous free tier. You\'re saving 100% on AI costs!'
        : 'Ollama runs locally with complete privacy. You\'re saving 100% on AI costs!',
      savings: 'Currently at ZERO cost for AI',
    });
  }

  // Already using Groq - celebrate!
  if (costData.ai && costData.ai.provider === 'groq') {
    tips.push({
      icon: '✅',
      title: 'You\'re using Groq - great choice!',
      description: 'You\'re saving 80-90% on AI costs compared to Claude. For zero cost, try Gemini (free tier) or Ollama (local).',
      savings: 'Currently saving 80-90% on AI costs',
    });
  }

  // High AI cost tips (for other cases)
  if (costData.ai && costData.ai.cost > 0.01 && costData.ai.provider !== 'groq') {
    tips.push({
      icon: '💡',
      title: 'Use Claude Haiku for simpler analysis',
      description: 'Claude Haiku is 12x cheaper and great for basic summaries. Switch models in settings to save ~80% on AI costs.',
      savings: 'Save up to 80% on AI processing',
    });
  }

  // Long audio tips
  if (costData.transcription && costData.transcription.cost > 0.05) {
    tips.push({
      icon: '✂️',
      title: 'Process shorter segments',
      description: 'If you only need specific parts, trim the audio before uploading to reduce transcription costs.',
      savings: 'Pay only for what you need',
    });
  }

  // General optimization
  tips.push({
    icon: '🔄',
    title: 'Cache results for re-analysis',
    description: 'Save the JSON export to avoid re-transcribing the same podcast. Re-import for different AI analyses.',
    savings: 'Free re-analysis of saved transcripts',
  });

  // Local processing option
  if (costData.total > 0.10) {
    tips.push({
      icon: '🏠',
      title: 'Consider local Whisper deployment',
      description: 'For high-volume use, running Whisper locally eliminates transcription costs. Only pay for AI analysis.',
      savings: 'Save ~50% on total costs',
    });
  }

  return tips;
}

/**
 * Calculate monthly cost projection
 * @param {number} costPerEpisode - Cost per episode
 * @param {number} episodesPerMonth - Number of episodes per month
 * @returns {Object} - Monthly projection
 */
export function calculateMonthlyProjection(costPerEpisode, episodesPerMonth) {
  const monthly = costPerEpisode * episodesPerMonth;
  const yearly = monthly * 12;

  return {
    monthly: monthly,
    monthlyFormatted: `$${monthly.toFixed(2)}`,
    yearly: yearly,
    yearlyFormatted: `$${yearly.toFixed(2)}`,
    perEpisode: costPerEpisode,
    perEpisodeFormatted: `$${costPerEpisode.toFixed(4)}`,
    episodes: episodesPerMonth,
  };
}
