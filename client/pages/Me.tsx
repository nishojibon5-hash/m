import MainLayout from "@/components/MainLayout";
import { User, LogOut, Edit2, Lock, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { getVideosByCreator } from "@/lib/googleDriveIntegration";

export default function Me() {
  const { user, logout, login } = useAuth();
  const userVideos = user ? getVideosByCreator(user.id) : [];
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    avatar: user?.avatar || "",
  });

  const handleEditOpen = () => {
    if (user) {
      setEditForm({
        username: user.username,
        avatar: user.avatar,
      });
      setEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (!user) return;

    if (editForm.username.trim() === "") {
      alert("Username cannot be empty");
      return;
    }

    const updatedUser = {
      ...user,
      username: editForm.username,
      avatar: editForm.avatar,
    };

    login(updatedUser);
    setEditModalOpen(false);
  };

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

        {/* Admin Access Guide */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Admin Access Guide
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  You have administrator privileges. Use this guide to navigate admin features.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <h3 className="text-foreground font-semibold text-sm mb-2">
                  Admin Dashboard
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Access the admin panel to manage the platform.
                </p>
                <Link
                  to="/admin"
                  className="inline-flex px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Go to Admin Panel →
                </Link>
              </div>

              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <h3 className="text-foreground font-semibold text-sm mb-2">
                  Key Admin Features
                </h3>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Content Moderation:</strong> Review and manage user-uploaded content
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>User Management:</strong> View user accounts, activity, and manage permissions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Analytics:</strong> View platform statistics, engagement metrics, and reports
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>System Settings:</strong> Configure platform features and policies
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Audit Logs:</strong> Monitor admin actions and system events
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <h3 className="text-foreground font-semibold text-sm mb-2">
                  Quick Tips
                </h3>
                <ul className="text-muted-foreground text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      Regularly review the audit logs to monitor platform activity
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      Use content filters to help identify policy violations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      Check analytics weekly to understand platform trends
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      Update system settings as needed to enforce platform policies
                    </span>
                  </li>
                </ul>
              </div>
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
