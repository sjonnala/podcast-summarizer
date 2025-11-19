import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateAnalysisPrompt } from './promptTemplate.js';

/**
 * Analyze transcript using Google Gemini (2.5 Flash)
 * @param {string} transcript - The podcast transcript
 * @param {Array} sentences - Array of sentences with timestamps from AssemblyAI
 * @param {Array} utterances - Array of utterances with speaker labels from AssemblyAI
 * @returns {Promise<Object>} - Analysis results with provider info
 */
export async function analyzeWithGemini(transcript, sentences = [], utterances = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  try {
    console.log('Analyzing transcript with Gemini 2.0 Flash...');

    const startTime = Date.now();

    const result = await model.generateContent(generateAnalysisPrompt(transcript));
    const response = await result.response;
    const responseText = response.text();

    const processingTime = Date.now() - startTime;

    // Parse the JSON response
    const analysis = JSON.parse(responseText);

    // Import helper functions from llmService
    const { findTimestampForText, findSpeakerAtTimestamp } = await import('./llmService.js');

    // Add timestamps and speaker labels to highlights if sentences are available
    if (sentences && sentences.length > 0) {
      analysis.highlights = analysis.highlights.map(highlight => {
        const timestamp = findTimestampForText(highlight.snippet || highlight.text, sentences);
        const timestampMs = timestamp.seconds * 1000;
        const speaker = findSpeakerAtTimestamp(timestampMs, utterances);

        return {
          ...highlight,
          timestamp: timestamp.formatted,
          timestampSeconds: timestamp.seconds,
          speaker: speaker,
        };
      });
    }

    console.log(`Gemini analysis completed in ${processingTime}ms`);

    // Gemini doesn't provide token counts directly in the same way
    // Estimate based on text length
    const estimatedPromptTokens = Math.ceil(transcript.length / 4);
    const estimatedCompletionTokens = Math.ceil(responseText.length / 4);

    return {
      analysis,
      provider: 'gemini',
      model: 'gemini-2.0-flash-exp',
      processingTime,
      usage: {
        promptTokens: estimatedPromptTokens,
        completionTokens: estimatedCompletionTokens,
        totalTokens: estimatedPromptTokens + estimatedCompletionTokens,
      },
    };
  } catch (error) {
    console.error('Gemini analysis error:', error.message);

    // If JSON parsing failed
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse Gemini response as JSON');
    }

    throw new Error(`Failed to analyze transcript with Gemini: ${error.message}`);
  }
}

/**
 * Calculate cost for Gemini API usage
 * Gemini 2.0 Flash pricing (as of 2025):
 * FREE tier: 10 RPM, 250K TPM, 250 RPD
 * - Under 128K tokens: FREE
 * - Over 128K tokens: $0.075 per 1M input, $0.30 per 1M output
 * @param {Object} usage - Usage object with token counts
 * @returns {number} - Cost in USD
 */
export function calculateGeminiCost(usage) {
  const totalTokens = usage.totalTokens || 0;

  // Free tier covers up to 250K tokens per minute
  // For most podcast episodes, this will be free
  if (totalTokens < 128000) {
    return 0; // Free tier
  }

  const inputCostPer1M = 0.075;
  const outputCostPer1M = 0.30;

  const inputCost = (usage.promptTokens / 1_000_000) * inputCostPer1M;
  const outputCost = (usage.completionTokens / 1_000_000) * outputCostPer1M;

  return inputCost + outputCost;
}
