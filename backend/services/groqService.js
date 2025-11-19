import Groq from 'groq-sdk';
import { generateAnalysisPrompt } from './promptTemplate.js';

/**
 * Analyze transcript using Groq AI (Llama 3.3 70B)
 * @param {string} transcript - The podcast transcript
 * @param {Array} sentences - Array of sentences with timestamps from AssemblyAI
 * @param {Array} utterances - Array of utterances with speaker labels from AssemblyAI
 * @returns {Promise<Object>} - Analysis results with provider info
 */
export async function analyzeWithGroq(transcript, sentences = [], utterances = []) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Groq API key is not configured');
  }

  const client = new Groq({
    apiKey: apiKey,
  });

  try {
    console.log('Analyzing transcript with Groq (Llama 3.3 70B)...');

    const startTime = Date.now();

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: generateAnalysisPrompt(transcript),
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const processingTime = Date.now() - startTime;
    const responseText = completion.choices[0].message.content;

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

    console.log(`Groq analysis completed in ${processingTime}ms`);

    return {
      analysis,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      processingTime,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    console.error('Groq analysis error:', error.message);

    // If JSON parsing failed, try to extract JSON from the response
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse Groq response as JSON');
    }

    throw new Error(`Failed to analyze transcript with Groq: ${error.message}`);
  }
}

/**
 * Calculate cost for Groq API usage
 * Groq pricing (as of 2025):
 * - Llama 3.3 70B: $0.59 per 1M input tokens, $0.79 per 1M output tokens
 * @param {Object} usage - Usage object with token counts
 * @returns {number} - Cost in USD
 */
export function calculateGroqCost(usage) {
  const inputCostPer1M = 0.59;
  const outputCostPer1M = 0.79;

  const inputCost = (usage.promptTokens / 1_000_000) * inputCostPer1M;
  const outputCost = (usage.completionTokens / 1_000_000) * outputCostPer1M;

  return inputCost + outputCost;
}
