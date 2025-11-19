import fetch from 'node-fetch';

/**
 * Analyze transcript using Ollama (local LLM)
 * @param {string} transcript - The podcast transcript
 * @param {Array} sentences - Array of sentences with timestamps from AssemblyAI
 * @param {Array} utterances - Array of utterances with speaker labels from AssemblyAI
 * @param {string} model - Ollama model to use (default: llama3.3:70b)
 * @returns {Promise<Object>} - Analysis results with provider info
 */
export async function analyzeWithOllama(transcript, sentences = [], utterances = [], model = 'llama3.3:70b') {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

  try {
    console.log(`Analyzing transcript with Ollama (${model})...`);

    const startTime = Date.now();

    const prompt = `You are an expert podcast analyst. Analyze the following podcast transcript and provide a comprehensive summary.

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

Ensure your response is valid JSON that can be parsed.`;

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.response;

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

    console.log(`Ollama analysis completed in ${processingTime}ms`);

    return {
      analysis,
      provider: 'ollama',
      model: model,
      processingTime,
      usage: {
        promptTokens: data.prompt_eval_count || Math.ceil(transcript.length / 4),
        completionTokens: data.eval_count || Math.ceil(responseText.length / 4),
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
    };
  } catch (error) {
    console.error('Ollama analysis error:', error.message);

    // Check if Ollama is not running
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      throw new Error('Ollama is not running. Please start Ollama with: ollama serve');
    }

    // If JSON parsing failed
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse Ollama response as JSON');
    }

    throw new Error(`Failed to analyze transcript with Ollama: ${error.message}`);
  }
}

/**
 * Check if Ollama is available
 * @param {string} ollamaUrl - Ollama server URL
 * @returns {Promise<boolean>} - True if Ollama is available
 */
export async function checkOllamaAvailability(ollamaUrl = 'http://localhost:11434') {
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get available Ollama models
 * @param {string} ollamaUrl - Ollama server URL
 * @returns {Promise<Array>} - List of available models
 */
export async function getOllamaModels(ollamaUrl = 'http://localhost:11434') {
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Failed to get Ollama models:', error.message);
    return [];
  }
}

/**
 * Calculate cost for Ollama (local processing)
 * @returns {number} - Cost is always $0 for local processing
 */
export function calculateOllamaCost() {
  return 0; // Ollama is free (local processing)
}
