import Anthropic from '@anthropic-ai/sdk';

/**
 * Analyze transcript using Claude AI
 * @param {string} transcript - The podcast transcript
 * @returns {Promise<Object>} - Analysis results
 */
export async function analyzeTranscript(transcript) {
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
    "First key highlight or memorable moment",
    "Second key highlight or memorable moment",
    "Third key highlight or memorable moment",
    "Fourth key highlight or memorable moment",
    "Fifth key highlight or memorable moment"
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
      'Opening discussion sets the context for the main topic',
      'In-depth exploration of key concepts and ideas',
      'Expert insights and personal experiences shared',
      'Practical examples and real-world applications',
      'Concluding thoughts and recommendations',
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
