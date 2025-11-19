import { extractTranscript } from './transcriptService.js';
import { analyzeWithProvider, analyzeTranscriptMultiProvider, generateMockAnalysis, calculateLLMCost } from './llmService.js';
import { detectPlatform, extractYouTubeId, getYouTubeThumbnail, generateChapterVTT } from './platformDetector.js';

/**
 * Process a podcast URL: extract transcript and analyze with LLM
 * @param {string} podcastUrl - URL of the podcast
 * @param {string} llmProvider - LLM provider to use ('auto', 'groq', 'claude', 'gemini', 'ollama')
 * @param {string} ollamaModel - Ollama model to use (optional)
 * @returns {Promise<Object>} - Complete analysis results
 */
export async function processPodcast(podcastUrl, llmProvider = 'auto', ollamaModel = 'llama3.3:70b') {
  try {
    const startTime = Date.now();

    // Detect platform and extract metadata
    const platformInfo = detectPlatform(podcastUrl);
    console.log(`Detected platform: ${platformInfo.name}`);

    // Extract metadata based on platform
    const metadata = {
      platform: platformInfo,
      thumbnail: null,
      title: null,
      author: null,
    };

    // For YouTube, extract video ID and thumbnail
    if (platformInfo.platform === 'youtube') {
      const videoId = extractYouTubeId(podcastUrl);
      if (videoId) {
        metadata.thumbnail = getYouTubeThumbnail(videoId);
        metadata.videoId = videoId;
      }
    }

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
        transcriptData = {
          text: transcript,
          chapters: [],
          sentences: [],
          utterances: [],
          speakerStats: [],
          sentimentAnalysis: [],
          sentimentStats: { positive: 0, negative: 0, neutral: 0 },
          duration: 0
        };
      } else {
        throw error;
      }
    }

    if (!transcript || transcript.length < 50) {
      throw new Error('Transcript is too short or empty');
    }

    console.log(`Transcript extracted: ${transcript.length} characters`);

    // Step 2: Analyze with LLM
    console.log(`Step 2: Analyzing transcript with AI (provider: ${llmProvider})...`);
    let analysisResult;
    let usedProvider = 'unknown';
    let usedModel = 'unknown';
    let llmUsage = {};
    let llmCost = 0;

    try {
      analysisResult = await analyzeWithProvider(
        llmProvider,
        transcript,
        transcriptData.sentences || [],
        transcriptData.utterances || [],
        ollamaModel
      );

      // Extract provider info
      usedProvider = analysisResult.provider;
      usedModel = analysisResult.model;
      llmUsage = analysisResult.usage;
      llmCost = calculateLLMCost(usedProvider, llmUsage);

    } catch (error) {
      console.error('LLM analysis failed:', error.message);

      // For demo purposes, if APIs are not configured, use mock analysis
      if (error.message.includes('not configured') || error.message.includes('not running')) {
        console.log('Using mock analysis for demo purposes...');
        analysisResult = {
          analysis: generateMockAnalysis(transcript),
          provider: 'mock',
          model: 'mock',
          usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        };
        usedProvider = 'mock';
        usedModel = 'mock';
      } else {
        throw error;
      }
    }

    const endTime = Date.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`Processing completed in ${processingTime} seconds`);
    console.log(`LLM Provider: ${usedProvider} (${usedModel})`);
    console.log(`LLM Cost: $${llmCost.toFixed(6)}`);

    // Extract analysis from result
    const analysis = analysisResult.analysis;

    // Update metadata with analysis title if available
    if (analysis && analysis.title) {
      metadata.title = analysis.title;
    }

    // Generate chapter VTT for audio player
    const chapterVTT = generateChapterVTT(transcriptData.chapters || []);

    // Return complete results
    return {
      success: true,
      podcastUrl,
      audioUrl: podcastUrl, // Include for audio player
      duration: transcriptData.duration || 0,
      transcript: transcript.substring(0, 1000) + (transcript.length > 1000 ? '...' : ''), // First 1000 chars
      transcriptLength: transcript.length,
      chapters: transcriptData.chapters || [],
      chapterVTT: chapterVTT,
      sentences: transcriptData.sentences || [], // Include for search functionality
      utterances: transcriptData.utterances || [],
      speakerStats: transcriptData.speakerStats || [],
      sentimentAnalysis: transcriptData.sentimentAnalysis || [],
      sentimentStats: transcriptData.sentimentStats || { positive: 0, negative: 0, neutral: 0 },
      metadata: metadata,
      analysis,
      llmProvider: {
        provider: usedProvider,
        model: usedModel,
        usage: llmUsage,
        cost: llmCost,
      },
      processingTime: `${processingTime}s`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Podcast processing error:', error);
    throw error;
  }
}
