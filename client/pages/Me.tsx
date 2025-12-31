import MainLayout from "@/components/MainLayout";
import { User, LogOut, Edit2 } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { getVideosByCreator } from "@/lib/googleDriveIntegration";

export default function Me() {
  const { user, logout } = useAuth();
  const userVideos = user ? getVideosByCreator(user.id) : [];

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {user.username}
                </h1>
                <p className="text-muted-foreground text-sm mb-2">
                  Device ID: {user.deviceId.substring(0, 8)}...
                </p>
                <p className="text-muted-foreground text-sm">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button className="p-2 rounded-full bg-primary bg-opacity-10 text-primary hover:bg-opacity-20 transition-colors">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userVideos.length}</p>
              <p className="text-muted-foreground text-sm">Videos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {(userVideos.reduce((acc, v) => acc + v.views, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-muted-foreground text-sm">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {(userVideos.reduce((acc, v) => acc + v.likes, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-muted-foreground text-sm">Total Likes</p>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
            <p className="text-foreground font-medium">My Videos</p>
            <p className="text-muted-foreground text-sm">View and manage your uploaded content</p>
          </div>
          <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
            <p className="text-foreground font-medium">Following</p>
            <p className="text-muted-foreground text-sm">Creators you follow</p>
          </div>
          <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
            <p className="text-foreground font-medium">Liked Videos</p>
            <p className="text-muted-foreground text-sm">Videos you've liked</p>
          </div>
          <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
            <p className="text-foreground font-medium">Settings</p>
            <p className="text-muted-foreground text-sm">Account settings and preferences</p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full mt-8 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </MainLayout>
  );
}
