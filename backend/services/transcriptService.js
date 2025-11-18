import axios from 'axios';

/**
 * Extract transcript from podcast using AssemblyAI
 * @param {string} audioUrl - URL of the podcast audio file
 * @returns {Promise<string>} - Transcript text
 */
export async function extractTranscript(audioUrl) {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    throw new Error('AssemblyAI API key is not configured');
  }

  try {
    console.log('Submitting audio for transcription...');

    // Submit audio for transcription
    const transcriptResponse = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: audioUrl,
        auto_chapters: true, // Get chapter information for better structure
        punctuate: true,
        format_text: true,
      },
      {
        headers: {
          authorization: apiKey,
          'content-type': 'application/json',
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;
    console.log(`Transcription started with ID: ${transcriptId}`);

    // Poll for completion
    let transcript;
    let attempts = 0;
    const maxAttempts = 300; // 5 minutes timeout (1 second intervals)

    while (attempts < maxAttempts) {
      const pollingResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: apiKey,
          },
        }
      );

      transcript = pollingResponse.data;

      if (transcript.status === 'completed') {
        console.log('Transcription completed successfully');

        // Get sentences with timestamps from the completed transcript
        const sentencesResponse = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}/sentences`,
          {
            headers: {
              authorization: apiKey,
            },
          }
        );

        return {
          text: transcript.text,
          chapters: transcript.chapters || [],
          sentences: sentencesResponse.data.sentences || [],
          duration: transcript.audio_duration || 0,
        };
      } else if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }

      // Wait 1 second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;

      if (attempts % 10 === 0) {
        console.log(`Still transcribing... (${attempts} seconds elapsed)`);
      }
    }

    throw new Error('Transcription timed out');
  } catch (error) {
    console.error('Transcription error:', error.message);
    throw new Error(`Failed to extract transcript: ${error.message}`);
  }
}
