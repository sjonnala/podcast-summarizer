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
 * Estimate Claude AI cost based on transcript length
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
  };
}

/**
 * Calculate total processing cost
 * @param {Object} data - Processing data
 * @returns {Object} - Complete cost breakdown
 */
export function calculateTotalCost(data) {
  const { duration, transcriptLength } = data;

  const transcriptionCost = calculateTranscriptionCost(duration);
  const aiCost = estimateClaudeCost(transcriptLength);

  const total = transcriptionCost.cost + aiCost.cost;

  return {
    total: total,
    totalFormatted: `$${total.toFixed(4)}`,
    transcription: transcriptionCost,
    ai: aiCost,
    breakdown: {
      transcriptionPercent: ((transcriptionCost.cost / total) * 100).toFixed(1),
      aiPercent: ((aiCost.cost / total) * 100).toFixed(1),
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

  // High AI cost tips
  if (costData.ai && costData.ai.cost > 0.01) {
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
