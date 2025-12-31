import { useParams } from "react-router-dom";
import { useState } from "react";
import { ThumbsUp, MessageCircle, Share2, MoreVertical } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import VideoPlayer from "@/components/VideoPlayer";
import VideoCard from "@/components/VideoCard";

// Sample video data
const VIDEOS_DB: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    creator: string;
    creatorAvatar: string;
    creatorId: string;
    views: number;
    likes: number;
    comments: number;
    uploadedAt: string;
    category: string;
  }
> = {
  "1": {
    id: "1",
    title: "Ghost Doctor S01 (Ep01-Ep08) hindi dubbed",
    description:
      "Watch the complete first season of Ghost Doctor with hindi dubbing. A thrilling medical drama with supernatural elements.",
    thumbnail:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    creator: "Drama Centre",
    creatorAvatar: "https://i.pravatar.cc/80?img=1",
    creatorId: "creator_1",
    views: 1200000,
    likes: 45000,
    comments: 12300,
    uploadedAt: "2 days ago",
    category: "Drama",
  },
  "2": {
    id: "2",
    title: "Best Anime Openings 2024 Compilation",
    description: "The best anime openings of 2024 compiled in one video.",
    thumbnail:
      "https://images.unsplash.com/photo-1540224652253-797f1d21f6b9?w=400&h=225&fit=crop",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    creator: "Anime Hub",
    creatorAvatar: "https://i.pravatar.cc/80?img=2",
    creatorId: "creator_2",
    views: 2500000,
    likes: 98000,
    comments: 32100,
    uploadedAt: "1 week ago",
    category: "Anime",
  },
};

const SAMPLE_COMMENTS = [
  {
    id: "1",
    author: "User 123",
    avatar: "https://i.pravatar.cc/40?img=1",
    text: "Amazing content! Love it 🔥",
    likes: 234,
    replies: 12,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    author: "Creative Writer",
    avatar: "https://i.pravatar.cc/40?img=2",
    text: "This deserves more views. Great production quality!",
    likes: 189,
    replies: 8,
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    author: "Fan Account",
    avatar: "https://i.pravatar.cc/40?img=3",
    text: "Best episode ever. Can't wait for more!",
    likes: 456,
    replies: 45,
    timestamp: "1 day ago",
  },
];

const RECOMMENDED_VIDEOS = [
  {
    id: "3",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
    title: "Latest Gaming Stream - Best Moments",
    creator: "Gaming Zone",
    creatorAvatar: "https://i.pravatar.cc/40?img=3",
    duration: "45:20",
    views: 890000,
  },
  {
    id: "4",
    thumbnail:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=225&fit=crop",
    title: "Music Video - Summer Vibes 2024",
    creator: "Music Channel",
    creatorAvatar: "https://i.pravatar.cc/40?img=4",
    duration: "03:45",
    views: 3200000,
  },
  {
    id: "5",
    thumbnail:
      "https://images.unsplash.com/photo-1489599849228-13a0735276ed?w=400&h=225&fit=crop",
    title: "Vlog: Exploring Tokyo Street Food",
    creator: "Travel Vlog",
    creatorAvatar: "https://i.pravatar.cc/40?img=5",
    duration: "18:30",
    views: 550000,
  },
  {
    id: "6",
    thumbnail:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=225&fit=crop",
    title: "Comedy Shorts - Funniest Moments",
    creator: "Laugh Out",
    creatorAvatar: "https://i.pravatar.cc/40?img=6",
    duration: "05:15",
    views: 4100000,
  },
];

export default function Watch() {
  const { videoId } = useParams<{ videoId: string }>();
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  const video = videoId ? VIDEOS_DB[videoId] : VIDEOS_DB["1"];

  if (!video) {
    return (
      <MainLayout showNavTabs={false}>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Video not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavTabs={false}>
      <div className="w-full">
        {/* Video Player */}
        <div className="w-full bg-black">
          <VideoPlayer src={video.videoUrl} title={video.title} />
        </div>

        {/* Video Info and Sidebar */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {video.title}
              </h1>

              {/* Creator Info */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <img
                    src={video.creatorAvatar}
                    alt={video.creator}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-foreground font-semibold">
                      {video.creator}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {(video.views / 1000000).toFixed(1)}M subscribers
                    </p>
                  </div>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                    Subscribe
                  </button>
                </div>

                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    liked
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {(video.likes / 1000).toFixed(0)}K
                  </span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-card text-foreground hover:bg-muted transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {(video.comments / 1000).toFixed(0)}K
                  </span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-card text-foreground hover:bg-muted transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* Description */}
              <div className="bg-card rounded-lg p-4 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">
                    {(video.views / 1000000).toFixed(1)}M views •{" "}
                    {video.uploadedAt}
                  </p>
                </div>
                <p className="text-foreground text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Comments Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Comments ({video.comments.toLocaleString()})
                </h2>

                {/* Comment Input */}
                <div className="flex gap-4 mb-6">
                  <img
                    src="https://i.pravatar.cc/40?img=0"
                    alt="You"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-card text-foreground placeholder-muted-foreground px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                      </button>
                      <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                        Comment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {SAMPLE_COMMENTS.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-foreground font-medium text-sm">
                            {comment.author}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-foreground text-sm mb-2">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground text-xs">
                          <button className="hover:text-primary transition-colors flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {comment.likes}
                          </button>
                          <button className="hover:text-primary transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Videos Sidebar */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Recommended
              </h2>
              <div className="space-y-4">
                {RECOMMENDED_VIDEOS.map((recVideo) => (
                  <VideoCard key={recVideo.id} {...recVideo} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
