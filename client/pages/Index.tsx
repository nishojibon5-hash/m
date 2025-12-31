import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import VideoCard from "@/components/VideoCard";
import AdCard from "@/components/AdCard";

interface NavTab {
  id: string;
  label: string;
}

const SAMPLE_VIDEOS = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop",
    title: "Ghost Doctor S01 (Ep01-Ep08) hindi dubbed",
    creator: "Drama Centre",
    creatorAvatar: "https://i.pravatar.cc/40?img=1",
    duration: "08:31:36",
    views: 1200000,
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1540224652253-797f1d21f6b9?w=400&h=225&fit=crop",
    title: "Best Anime Openings 2024 Compilation",
    creator: "Anime Hub",
    creatorAvatar: "https://i.pravatar.cc/40?img=2",
    duration: "12:45",
    views: 2500000,
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
    title: "Latest Gaming Stream - Best Moments",
    creator: "Gaming Zone",
    creatorAvatar: "https://i.pravatar.cc/40?img=3",
    duration: "45:20",
    views: 890000,
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=225&fit=crop",
    title: "Music Video - Summer Vibes 2024",
    creator: "Music Channel",
    creatorAvatar: "https://i.pravatar.cc/40?img=4",
    duration: "03:45",
    views: 3200000,
  },
  {
    id: "5",
    thumbnail: "https://images.unsplash.com/photo-1489599849228-13a0735276ed?w=400&h=225&fit=crop",
    title: "Vlog: Exploring Tokyo Street Food",
    creator: "Travel Vlog",
    creatorAvatar: "https://i.pravatar.cc/40?img=5",
    duration: "18:30",
    views: 550000,
  },
  {
    id: "6",
    thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=225&fit=crop",
    title: "Comedy Shorts - Funniest Moments",
    creator: "Laugh Out",
    creatorAvatar: "https://i.pravatar.cc/40?img=6",
    duration: "05:15",
    views: 4100000,
  },
  {
    id: "7",
    thumbnail: "https://images.unsplash.com/photo-1516979187457-635ffe35c7ae?w=400&h=225&fit=crop",
    title: "Tech Review - New Smartphone 2024",
    creator: "Tech Review",
    creatorAvatar: "https://i.pravatar.cc/40?img=7",
    duration: "22:10",
    views: 1750000,
  },
  {
    id: "8",
    thumbnail: "https://images.unsplash.com/photo-1516738901601-2e1b62dc0c45?w=400&h=225&fit=crop",
    title: "Fitness Workout - Full Body Training",
    creator: "Fitness Pro",
    creatorAvatar: "https://i.pravatar.cc/40?img=8",
    duration: "31:50",
    views: 650000,
  },
  {
    id: "9",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    title: "Nature Documentary - Amazon Rainforest",
    creator: "Nature Films",
    creatorAvatar: "https://i.pravatar.cc/40?img=9",
    duration: "42:15",
    views: 2100000,
  },
];

const navTabs: NavTab[] = [
  { id: "following", label: "Following" },
  { id: "foryou", label: "For You" },
  { id: "anime", label: "Anime" },
  { id: "post", label: "Post" },
  { id: "plaza", label: "Plaza" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <MainLayout
      showNavTabs={true}
      navTabs={navTabs}
      activeTab={activeTab}
      onNavTabChange={setActiveTab}
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_VIDEOS.map((video, index) => (
            <div key={video.id}>
              <VideoCard {...video} />
              
              {/* Ad Card - Inserted after specific positions */}
              {index === 2 && (
                <div className="md:col-span-2 lg:col-span-4 mt-6 mb-6">
                  <AdCard
                    id="ad-1"
                    title="$1,000,000"
                    subtitle="MEXC Exclusive"
                    price="$1,000,000"
                    description="MEXC - Next generation crypto exchange"
                    backgroundColor="bg-gradient-to-r from-blue-900 to-blue-700"
                    ctaText="Join Now"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Ad Card */}
        <div className="mt-8 mb-6">
          <AdCard
            id="ad-2"
            title="ETHFI Euphoria"
            description="Unlock 0-fee trading with ETHFI Euphoria!"
            backgroundColor="bg-gradient-to-r from-purple-900 to-purple-700"
            ctaText="Learn More"
          />
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <button className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium">
            Load More Videos
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
