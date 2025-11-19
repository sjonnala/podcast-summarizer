import { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import ChapterNavigation from './ChapterNavigation';
import SpeakerStats from './SpeakerStats';
import TranscriptSearch from './TranscriptSearch';
import SentimentTimeline from './SentimentTimeline';
import PodcastMetadata from './PodcastMetadata';

export default function Results({ data, onReset }) {
  const { analysis, processingTime, audioUrl, chapters, utterances, speakerStats, sentences, sentimentAnalysis, sentimentStats, duration, metadata } = data;
  const [seekToTime, setSeekToTime] = useState(null);

  const handleTimestampClick = (seconds) => {
    setSeekToTime(seconds);
    // Reset after a moment to allow re-clicking same timestamp
    setTimeout(() => setSeekToTime(null), 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Podcast Metadata - show platform and artwork */}
      <PodcastMetadata metadata={metadata} analysis={analysis} />

      {/* Audio Player - only show if we have a valid audio URL */}
      {audioUrl && (
        <AudioPlayer audioUrl={audioUrl} currentTime={seekToTime} chapters={chapters} />
      )}

      {/* Chapter Navigation - only show if chapters are available */}
      <ChapterNavigation chapters={chapters} onChapterClick={handleTimestampClick} />

      {/* Speaker Statistics - only show if speaker data is available */}
      <SpeakerStats speakerStats={speakerStats} utterances={utterances} />

      {/* Transcript Search - only show if sentences are available */}
      <TranscriptSearch sentences={sentences} onTimestampClick={handleTimestampClick} />

      {/* Sentiment Analysis - only show if sentiment data is available */}
      <SentimentTimeline
        sentimentAnalysis={sentimentAnalysis}
        sentimentStats={sentimentStats}
        duration={duration}
        onTimestampClick={handleTimestampClick}
      />

      {/* Header with title and reset button */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {analysis.title}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {analysis.summary}
            </p>
            <div className="flex items-center space-x-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Processed in {processingTime}
              </span>
              {analysis.tags && (
                <div className="flex items-center space-x-2">
                  {analysis.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onReset}
            className="ml-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="section-card">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">Highlights</h3>
        </div>
        <ul className="space-y-3">
          {analysis.highlights.map((highlight, index) => {
            // Handle both old string format and new object format
            const highlightText = typeof highlight === 'string' ? highlight : highlight.text;
            const timestamp = typeof highlight === 'object' ? highlight.timestamp : null;
            const timestampSeconds = typeof highlight === 'object' ? highlight.timestampSeconds : null;
            const speaker = typeof highlight === 'object' ? highlight.speaker : null;

            // Speaker colors (same as SpeakerStats)
            const speakerColors = {
              'A': { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500' },
              'B': { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-500' },
              'C': { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' },
              'D': { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500' },
              'E': { bg: 'bg-pink-100', text: 'text-pink-700', badge: 'bg-pink-500' },
              'F': { bg: 'bg-teal-100', text: 'text-teal-700', badge: 'bg-teal-500' },
            };
            const colors = speaker ? speakerColors[speaker] : null;

            return (
              <li key={index} className="flex items-start group">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-3 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-slate-700 leading-relaxed pt-1">{highlightText}</p>
                  <div className="mt-2 flex items-center space-x-2 flex-wrap">
                    {speaker && colors && (
                      <span className={`inline-flex items-center px-2 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-medium`}>
                        <span className={`w-4 h-4 ${colors.badge} text-white rounded-full flex items-center justify-center text-xs mr-1`}>
                          {speaker}
                        </span>
                        Speaker {speaker}
                      </span>
                    )}
                    {timestamp && (
                      <button
                        onClick={() => handleTimestampClick(timestampSeconds)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Jump to {timestamp}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Key Takeaways Section */}
      <div className="section-card">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">Key Takeaways</h3>
        </div>
        <ul className="space-y-3">
          {analysis.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-slate-700 leading-relaxed">{takeaway}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Similar Topics Section */}
      <div className="section-card">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">Related Topics</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.similarTopics.map((topic, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center">
                <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs mr-2">
                  {index + 1}
                </span>
                {topic.topic}
              </h4>
              <p className="text-purple-700 text-sm">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-ups Section */}
      <div className="section-card">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">Follow-Up Questions</h3>
        </div>
        <ul className="space-y-2">
          {analysis.followUps.map((followUp, index) => (
            <li key={index} className="flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-blue-600 font-bold mr-3 text-lg">?</span>
              <p className="text-slate-700 leading-relaxed">{followUp}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
