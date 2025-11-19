import { extractTranscript } from './transcriptService.js';
import { analyzeTranscript, generateMockAnalysis } from './llmService.js';

/**
 * Process a podcast URL: extract transcript and analyze with LLM
 * @param {string} podcastUrl - URL of the podcast
 * @returns {Promise<Object>} - Complete analysis results
 */
export async function processPodcast(podcastUrl) {
  try {
    const startTime = Date.now();

    // Step 1: Extract transcript
    console.log('Step 1: Extracting transcript...');
    let transcriptData;
    let transcript;

    try {
      transcriptData = await extractTranscript(podcastUrl);
      transcript = transcriptData.text;
    } catch (error) {
      console.error('Transcript extraction failed:', error.message);

      // For demo purposes, if AssemblyAI is not configured, use a mock transcript
      if (error.message.includes('not configured')) {
        console.log('Using mock transcript for demo purposes...');
        transcript =
          'This is a demo transcript. In production, this would contain the actual podcast transcript extracted from the audio file. The transcript would include all spoken words from the podcast episode.';
        transcriptData = { text: transcript, chapters: [], sentences: [], utterances: [], speakerStats: [], duration: 0 };
      } else {
        throw error;
      }
    }

    if (!transcript || transcript.length < 50) {
      throw new Error('Transcript is too short or empty');
    }

    console.log(`Transcript extracted: ${transcript.length} characters`);

    // Step 2: Analyze with LLM
    console.log('Step 2: Analyzing transcript with AI...');
    let analysis;

    try {
      analysis = await analyzeTranscript(
        transcript,
        transcriptData.sentences || [],
        transcriptData.utterances || []
      );
    } catch (error) {
      console.error('LLM analysis failed:', error.message);

      // For demo purposes, if Anthropic API is not configured, use mock analysis
      if (error.message.includes('not configured')) {
        console.log('Using mock analysis for demo purposes...');
        analysis = generateMockAnalysis(transcript);
      } else {
        throw error;
      }
    }

    const endTime = Date.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`Processing completed in ${processingTime} seconds`);

    // Return complete results
    return {
      success: true,
      podcastUrl,
      audioUrl: podcastUrl, // Include for audio player
      duration: transcriptData.duration || 0,
      transcript: transcript.substring(0, 1000) + (transcript.length > 1000 ? '...' : ''), // First 1000 chars
      transcriptLength: transcript.length,
      chapters: transcriptData.chapters || [],
      sentences: transcriptData.sentences || [], // Include for search functionality
      utterances: transcriptData.utterances || [],
      speakerStats: transcriptData.speakerStats || [],
      analysis,
      processingTime: `${processingTime}s`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Podcast processing error:', error);
    throw error;
  }
}
