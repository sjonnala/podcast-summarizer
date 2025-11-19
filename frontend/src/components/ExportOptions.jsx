import { useState } from 'react';
import {
  exportToMarkdown,
  exportToJSON,
  exportToShowNotes,
  exportToNotion,
  downloadFile,
  copyToClipboard
} from '../utils/exportService';

export default function ExportOptions({ data }) {
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (!data || !data.analysis) {
    return null;
  }

  const handleCopy = async (format) => {
    let content = '';
    switch (format) {
      case 'markdown':
        content = exportToMarkdown(data);
        break;
      case 'notion':
        content = exportToNotion(data);
        break;
      case 'shownotes':
        content = exportToShowNotes(data);
        break;
      case 'json':
        content = exportToJSON(data);
        break;
      default:
        return;
    }

    const success = await copyToClipboard(content);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  const handleDownload = (format) => {
    const title = data.analysis.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    switch (format) {
      case 'markdown':
        content = exportToMarkdown(data);
        filename = `${title}_${timestamp}.md`;
        mimeType = 'text/markdown';
        break;
      case 'notion':
        content = exportToNotion(data);
        filename = `${title}_notion_${timestamp}.md`;
        mimeType = 'text/markdown';
        break;
      case 'shownotes':
        content = exportToShowNotes(data);
        filename = `${title}_shownotes_${timestamp}.txt`;
        mimeType = 'text/plain';
        break;
      case 'json':
        content = exportToJSON(data);
        filename = `${title}_${timestamp}.json`;
        mimeType = 'application/json';
        break;
      default:
        return;
    }

    downloadFile(content, filename, mimeType);
    setShowExportMenu(false);
  };

  const exportOptions = [
    {
      id: 'markdown',
      name: 'Markdown',
      icon: '📝',
      description: 'Obsidian-compatible with [[backlinks]]',
      color: 'blue'
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: '📋',
      description: 'Formatted for Notion pages',
      color: 'purple'
    },
    {
      id: 'shownotes',
      name: 'Show Notes',
      icon: '📄',
      description: 'Plain text with chapters',
      color: 'green'
    },
    {
      id: 'json',
      name: 'JSON',
      icon: '{ }',
      description: 'Complete data export',
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    purple: {
      bg: 'bg-purple-50',
      hover: 'hover:bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    green: {
      bg: 'bg-green-50',
      hover: 'hover:bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      button: 'bg-green-600 hover:bg-green-700'
    },
    orange: {
      bg: 'bg-orange-50',
      hover: 'hover:bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700'
    }
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-800">Export & Share</h3>
        </div>
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {showExportMenu ? 'Close' : 'Export'}
        </button>
      </div>

      {showExportMenu && (
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
          {exportOptions.map(option => {
            const colors = colorClasses[option.color];
            return (
              <div
                key={option.id}
                className={`p-4 ${colors.bg} rounded-lg border ${colors.border} transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.icon}</span>
                    <div>
                      <h4 className={`font-bold ${colors.text} text-lg`}>{option.name}</h4>
                      <p className="text-sm text-slate-600">{option.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(option.id)}
                    className={`flex-1 px-3 py-2 bg-white border ${colors.border} ${colors.text} rounded-lg ${colors.hover} transition-colors text-sm font-medium flex items-center justify-center`}
                  >
                    {copiedFormat === option.id ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownload(option.id)}
                    className={`flex-1 px-3 py-2 ${colors.button} text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!showExportMenu && (
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-700 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Export this analysis to your favorite note-taking app. Choose from Markdown (Obsidian), Notion, Show Notes, or JSON format. Copy to clipboard or download as a file.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
