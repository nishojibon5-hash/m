import MainLayout from "@/components/MainLayout";
import { User, LogOut, Edit2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
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
              <p className="text-2xl font-bold text-primary">
                {userVideos.length}
              </p>
              <p className="text-muted-foreground text-sm">Videos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {(
                  userVideos.reduce((acc, v) => acc + v.views, 0) / 1000
                ).toFixed(0)}
                K
              </p>
              <p className="text-muted-foreground text-sm">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {(
                  userVideos.reduce((acc, v) => acc + v.likes, 0) / 1000
                ).toFixed(0)}
                K
              </p>
              <p className="text-muted-foreground text-sm">Total Likes</p>
            </div>
          </div>
        </div>

        {/* My Videos Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">My Videos</h2>
          {userVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-card rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.format === "long" && "Long"}
                      {video.format === "short" && "Short"}
                      {video.format === "photo_text" && "Photo+Text"}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{(video.views / 1000).toFixed(0)}K views</span>
                      <span>{(video.likes / 1000).toFixed(0)}K likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No videos uploaded yet</p>
              <p className="text-muted-foreground text-sm mt-2">
                Start sharing your content by uploading your first video
              </p>
            </div>
          )}
        </div>

        {/* Settings Sections */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Account Settings
          </h2>
          <div className="space-y-3">
            <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
              <p className="text-foreground font-medium">Edit Profile</p>
              <p className="text-muted-foreground text-sm">
                Update your username and avatar
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
              <p className="text-foreground font-medium">Privacy Settings</p>
              <p className="text-muted-foreground text-sm">
                Control who can see your profile and videos
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
              <p className="text-foreground font-medium">Notifications</p>
              <p className="text-muted-foreground text-sm">
                Manage notification preferences
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 hover:bg-opacity-80 cursor-pointer transition-colors">
              <p className="text-foreground font-medium">Device Management</p>
              <p className="text-muted-foreground text-sm">
                Manage devices and login history
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </MainLayout>
  );
}
