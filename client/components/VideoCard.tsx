import { MoreVertical } from "lucide-react";

interface VideoCardProps {
  id: string;
  thumbnail: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  duration: string;
  views?: number;
  likes?: number;
}

export default function VideoCard({
  thumbnail,
  title,
  creator,
  creatorAvatar,
  duration,
  views,
  likes,
}: VideoCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-card mb-3">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200"
        />
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
          {duration}
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <div className="w-0 h-0 border-l-6 border-l-primary-foreground border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-3">
        {/* Creator Avatar */}
        <img
          src={creatorAvatar}
          alt={creator}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        {/* Title and Creator */}
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs mt-1">{creator}</p>
          {views && (
            <p className="text-muted-foreground text-xs mt-1">
              {views > 1000000 ? `${(views / 1000000).toFixed(1)}M views` : `${(views / 1000).toFixed(0)}K views`}
            </p>
          )}
        </div>

        {/* More Menu */}
        <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-8 w-8 flex items-center justify-center">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
