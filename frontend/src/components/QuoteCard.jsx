import { useState, useRef, useEffect } from 'react';
import { copyToClipboard } from '../utils/exportService';

export default function QuoteCard({ highlight, episodeTitle, metadata, onClose }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const text = typeof highlight === 'string' ? highlight : highlight.text;
  const speaker = typeof highlight === 'object' ? highlight.speaker : null;
  const timestamp = typeof highlight === 'object' ? highlight.timestamp : null;

  const handleCopyText = async () => {
    const quoteText = `"${text}"\n\n— ${episodeTitle}${speaker ? ` (Speaker ${speaker})` : ''}${timestamp ? ` [${timestamp}]` : ''}`;

    const success = await copyToClipboard(quoteText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = () => {
    // Create a canvas to generate image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630; // Standard social media image size

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 100 + 50;
      ctx.fillRect(x, y, size, size);
    }

    // Content area
    const padding = 80;
    const contentWidth = canvas.width - (padding * 2);

    // Quote mark
    ctx.font = 'bold 120px serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('"', padding - 20, 180);

    // Quote text
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'left';

    // Word wrap
    const words = text.split(' ');
    let line = '';
    let y = 200;
    const lineHeight = 50;
    const maxLines = 6;
    let lineCount = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);

      if (metrics.width > contentWidth && i > 0) {
        ctx.fillText(line, padding, y);
        line = words[i] + ' ';
        y += lineHeight;
        lineCount++;

        if (lineCount >= maxLines) {
          line += '...';
          break;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, padding, y);

    // Attribution
    y += 100;
    ctx.font = 'bold 28px -apple-system, system-ui, sans-serif';
    ctx.fillStyle = '#f0f0f0';
    ctx.fillText(`— ${episodeTitle}`, padding, y);

    // Speaker and timestamp
    if (speaker || timestamp) {
      y += 40;
      ctx.font = '24px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const meta = [];
      if (speaker) meta.push(`Speaker ${speaker}`);
      if (timestamp) meta.push(timestamp);
      ctx.fillText(meta.join(' • '), padding, y);
    }

    // Platform badge (if available)
    if (metadata?.platform) {
      y += 60;
      ctx.font = '20px -apple-system, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(`via ${metadata.platform.name}`, padding, y);
    }

    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quote-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-bold">Share Quote</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-8">
          <div
            ref={cardRef}
            className="p-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl shadow-lg relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative z-10">
              {/* Quote mark */}
              <div className="text-white text-6xl font-serif mb-4 opacity-30">"</div>

              {/* Quote text */}
              <p className="text-white text-xl leading-relaxed mb-6 font-medium">
                {text}
              </p>

              {/* Attribution */}
              <div className="border-t border-white border-opacity-30 pt-4">
                <p className="text-white font-bold text-lg mb-1">— {episodeTitle}</p>
                <div className="flex items-center space-x-3 text-sm text-white text-opacity-80">
                  {speaker && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Speaker {speaker}
                    </span>
                  )}
                  {timestamp && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {timestamp}
                    </span>
                  )}
                  {metadata?.platform && (
                    <span>via {metadata.platform.name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center px-4 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Text
                </>
              )}
            </button>

            <button
              onClick={handleDownloadImage}
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            Share this quote on social media or save it for later
          </p>
        </div>
      </div>
    </div>
  );
}
