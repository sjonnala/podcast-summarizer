export default function PodcastMetadata({ metadata, analysis }) {
  if (!metadata) {
    return null;
  }

  const { platform, thumbnail, title } = metadata;

  // Platform color schemes
  const platformColors = {
    youtube: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-500' },
    spotify: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-500' },
    apple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-500' },
    soundcloud: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-500' },
    audio: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-500' },
    other: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-500' },
  };

  const colors = platformColors[platform.platform] || platformColors.other;

  return (
    <div className={`glass-card p-4 ${colors.bg} border ${colors.border}`}>
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        {thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={thumbnail}
              alt={title || 'Podcast thumbnail'}
              className="w-24 h-24 rounded-lg object-cover shadow-md border-2 border-white"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Metadata Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-3 py-1 ${colors.badge} text-white rounded-full text-sm font-medium`}>
              <span className="mr-1.5">{platform.icon}</span>
              {platform.name}
            </span>
          </div>

          {title && (
            <h3 className={`text-lg font-semibold ${colors.text} mb-1 line-clamp-2`}>
              {title}
            </h3>
          )}

          {analysis && analysis.summary && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {analysis.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
