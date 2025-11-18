import Anthropic from '@anthropic-ai/sdk';

/**
 * Helper function to find timestamp for a text snippet
 * @param {string} snippet - Text snippet to find
 * @param {Array} sentences - Array of sentences with timestamps
 * @returns {Object} - Timestamp object with formatted and seconds
 */
function findTimestampForText(snippet, sentences) {
  if (!snippet || !sentences || sentences.length === 0) {
    return { formatted: '00:00', seconds: 0 };
  }

  // Normalize the snippet for comparison
  const normalizedSnippet = snippet.toLowerCase().trim();

  // Try to find the sentence that contains this snippet
  let bestMatch = null;
  let bestScore = 0;

  for (const sentence of sentences) {
    const normalizedSentence = sentence.text.toLowerCase();

    // Check if sentence contains the snippet
    if (normalizedSentence.includes(normalizedSnippet)) {
      return formatTimestamp(sentence.start);
    }

    // Calculate similarity score (simple word overlap)
    const snippetWords = normalizedSnippet.split(/\s+/);
    const sentenceWords = normalizedSentence.split(/\s+/);
    const overlap = snippetWords.filter(word => sentenceWords.includes(word)).length;
    const score = overlap / snippetWords.length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = sentence;
    }
  }

  // Return best match if we found one with at least 30% overlap
  if (bestMatch && bestScore > 0.3) {
    return formatTimestamp(bestMatch.start);
  }

  // Default to start if no match found
  return { formatted: '00:00', seconds: 0 };
}

/**
 * Format milliseconds to MM:SS or HH:MM:SS
 * @param {number} ms - Milliseconds
 * @returns {Object} - Formatted timestamp
 */
function formatTimestamp(ms) {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let formatted;
  if (hours > 0) {
    formatted = `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else {
    formatted = `${minutes}:${String(secs).padStart(2, '0')}`;
  }

  return { formatted, seconds };
}

/**
 * Analyze transcript using Claude AI with timestamp mapping
 * @param {string} transcript - The podcast transcript
 * @param {Array} sentences - Array of sentences with timestamps from AssemblyAI
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeTranscript(transcript, sentences = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('Anthropic API key is not configured');
  }

  const client = new Anthropic({
    apiKey: apiKey,
  });

  try {
    console.log('Analyzing transcript with Claude AI...');

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
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
    });

    const responseText = message.content[0].text;

    // Parse the JSON response
    const analysis = JSON.parse(responseText);

    // Add timestamps to highlights if sentences are available
    if (sentences && sentences.length > 0) {
      analysis.highlights = analysis.highlights.map(highlight => {
        const timestamp = findTimestampForText(highlight.snippet || highlight.text, sentences);
        return {
          ...highlight,
          timestamp: timestamp.formatted,
          timestampSeconds: timestamp.seconds,
        };
      });
    }

    console.log('Analysis completed successfully');
    return analysis;
  } catch (error) {
    console.error('LLM analysis error:', error.message);

    // If JSON parsing failed, try to extract JSON from the response
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse LLM response as JSON');
    }

    throw new Error(`Failed to analyze transcript: ${error.message}`);
  }
}

/**
 * Generate a quick summary for testing (when APIs are not available)
 * @param {string} transcript - The podcast transcript
 * @returns {Object} - Mock analysis results
 */
export function generateMockAnalysis(transcript) {
  const wordCount = transcript.split(' ').length;
  const estimatedDuration = Math.round(wordCount / 150); // Assuming 150 words per minute

  return {
    title: 'Podcast Episode Analysis',
    summary: `This podcast episode covers various topics discussed over approximately ${estimatedDuration} minutes. The conversation explores multiple perspectives and insights on the subject matter.`,
    highlights: [
      {
        text: 'Opening discussion sets the context for the main topic',
        snippet: 'Opening discussion',
        timestamp: '0:00',
        timestampSeconds: 0,
      },
      {
        text: 'In-depth exploration of key concepts and ideas',
        snippet: 'key concepts',
        timestamp: '2:15',
        timestampSeconds: 135,
      },
      {
        text: 'Expert insights and personal experiences shared',
        snippet: 'personal experiences',
        timestamp: '5:30',
        timestampSeconds: 330,
      },
      {
        text: 'Practical examples and real-world applications',
        snippet: 'real-world applications',
        timestamp: '8:45',
        timestampSeconds: 525,
      },
      {
        text: 'Concluding thoughts and recommendations',
        snippet: 'recommendations',
        timestamp: '12:00',
        timestampSeconds: 720,
      },
    ],
    keyTakeaways: [
      'Understanding the fundamental principles discussed',
      'Practical applications for everyday situations',
      'Important considerations for implementation',
      'Common pitfalls to avoid',
      'Resources for further learning',
    ],
    similarTopics: [
      {
        topic: 'Related Field A',
        description: 'Shares similar methodologies and approaches',
      },
      {
        topic: 'Related Field B',
        description: 'Complementary perspectives on the subject',
      },
      {
        topic: 'Related Field C',
        description: 'Additional context and background information',
      },
    ],
    followUps: [
      'Explore advanced techniques in this area',
      'Research the historical development of these concepts',
      'Connect with experts in the field',
    ],
    tags: ['podcast', 'analysis', 'insights', 'learning', 'discussion'],
  };
}
