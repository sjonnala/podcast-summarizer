/**
 * Shared LLM prompt template for podcast analysis
 * Includes TL;DR, categorization, and enhanced analysis
 */

export function generateAnalysisPrompt(transcript) {
  return `You are an expert podcast analyst helping busy professionals extract maximum value from podcast content. Analyze the following podcast transcript and provide a comprehensive analysis optimized for quick consumption.

Transcript:
${transcript}

Please provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):

{
  "title": "A suggested title for this podcast episode based on the content",
  "summary": "A brief 2-3 sentence overview of the podcast",
  "tldr": {
    "quickSummary": "One compelling paragraph (3-4 sentences) that captures the essence - what's the main point and why should someone care?",
    "keyInsights": [
      {
        "insight": "First critical insight or takeaway",
        "snippet": "A short exact quote from the transcript",
        "timestamp": "00:00:00"
      },
      {
        "insight": "Second critical insight or takeaway",
        "snippet": "A short exact quote from the transcript",
        "timestamp": "00:00:00"
      },
      {
        "insight": "Third critical insight or takeaway",
        "snippet": "A short exact quote from the transcript",
        "timestamp": "00:00:00"
      }
    ],
    "worthListening": {
      "verdict": "highly_recommended|recommended|conditional|skip",
      "reason": "Brief explanation of why this is or isn't worth the full listen",
      "bestFor": "Who would benefit most from listening to this (e.g., 'Tech leaders', 'Startup founders', 'Finance professionals')"
    },
    "readingTime": 5
  },
  "categories": {
    "primary": "technology|business|finance|personal_development|health|science|education|entertainment",
    "secondary": ["AI", "Leadership", "Investing", "Productivity"],
    "industry": "tech|finance|healthcare|education|general",
    "topics": ["specific topic 1", "specific topic 2", "specific topic 3"]
  },
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

Important guidelines:
- For tldr.quickSummary: Make it compelling and actionable - answer "What's in it for me?"
- For tldr.keyInsights: Pick the 3 MOST valuable insights that busy professionals should know
- For tldr.worthListening.verdict: Be honest - "highly_recommended" only for truly exceptional content
- For categories: Be specific and accurate - this helps professionals find relevant content quickly
- Ensure all timestamps in tldr.keyInsights are placeholder "00:00:00" - they will be mapped later
- Ensure your response is valid JSON that can be parsed`;
}
