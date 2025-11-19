import Groq from 'groq-sdk';

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
          content: `You are an expert podcast analyst. Analyze the following podcast transcript and provide a comprehensive summary.

Transcript:
${transcript}

Please provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):

{
  "title": "A suggested title for this podcast episode based on the content",
  "summary": "A brief 2-3 sentence overview of the podcast",
  "highlights": [
    {
      "text": "First key highlight or memorable moment",
      "snippet": "A short exact quote or phrase from the transcript that represents this highlight"
    },
    {
      "text": "Second key highlight or memorable moment",
      "snippet": "A short exact quote or phrase from the transcript that represents this highlight"
    },
    {
      "text": "Third key highlight or memorable moment",
      "snippet": "A short exact quote or phrase from the transcript that represents this highlight"
    },
    {
      "text": "Fourth key highlight or memorable moment",
      "snippet": "A short exact quote or phrase from the transcript that represents this highlight"
    },
    {
      "text": "Fifth key highlight or memorable moment",
      "snippet": "A short exact quote or phrase from the transcript that represents this highlight"
    }
  ],
  "keyTakeaways": [
    "First actionable insight or important point",
    "Second actionable insight or important point",
    "Third actionable insight or important point",
    "Fourth actionable insight or important point",
    "Fifth actionable insight or important point"
  ],
  "similarTopics": [
    {
      "topic": "Related topic or concept",
      "description": "Brief explanation of how it relates"
    },
    {
      "topic": "Another related topic",
      "description": "Brief explanation of how it relates"
    },
    {
      "topic": "Third related topic",
      "description": "Brief explanation of how it relates"
    }
  ],
  "followUps": [
    "Suggested question or topic to explore further",
    "Another question or area for deeper investigation",
    "Third suggestion for continued learning"
  ],
  "tags": ["topic1", "topic2", "topic3", "topic4", "topic5"]
}

Ensure your response is valid JSON that can be parsed.`,
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
