import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  BarChart3,
  Users,
  Video,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  getAllVideoMetadata,
  getVideosByCreator,
} from "@/lib/googleDriveIntegration";
import { useAuth } from "@/lib/authContext";

type AdminTab = "overview" | "videos" | "users" | "settings" | "analytics";

interface DashboardStats {
  totalVideos: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
  avgVideoDuration: number;
}

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const allVideos = getAllVideoMetadata();

  // Check if user is admin (first user is admin)
  const adminUserId = localStorage.getItem("admin_user_id");
  const isAdmin = user?.id === adminUserId;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this admin panel.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats: DashboardStats = {
    totalVideos: allVideos.length,
    totalUsers: JSON.parse(localStorage.getItem("bilibili_users_list") || "[]")
      .length,
    totalViews: allVideos.reduce((acc, v) => acc + v.views, 0),
    totalLikes: allVideos.reduce((acc, v) => acc + v.likes, 0),
    avgVideoDuration:
      allVideos.length > 0
        ? allVideos.reduce((acc, v) => acc + v.duration, 0) / allVideos.length
        : 0,
  };

  const tabs: Array<{ id: AdminTab; label: string; icon: typeof Settings }> = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "videos", label: "Videos", icon: Video },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage videos, users, and app settings
              </p>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border sticky top-20 z-30 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Platform Statistics
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Total Videos
                </p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalVideos}
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  {stats.totalVideos === 0
                    ? "No videos yet"
                    : `${Math.round((stats.totalViews / stats.totalVideos / 1000) * 10) / 10}K avg views`}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalUsers}
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Active accounts
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Total Views
                </p>
                <p className="text-3xl font-bold text-primary">
                  {(stats.totalViews / 1000000).toFixed(1)}M
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  {stats.totalViews > 0
                    ? `${((stats.totalViews / stats.totalVideos) | 0).toLocaleString()} per video`
                    : "No views yet"}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Total Likes
                </p>
                <p className="text-3xl font-bold text-primary">
                  {(stats.totalLikes / 1000).toFixed(0)}K
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Engagement rate
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Avg Video Duration
                </p>
                <p className="text-3xl font-bold text-primary">
                  {Math.round(stats.avgVideoDuration / 60)}m
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  {stats.avgVideoDuration > 0 ? "minutes" : ""}
                </p>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Database Connection</span>
                  <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-500 text-xs rounded-full font-medium">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Device Tracking</span>
                  <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-500 text-xs rounded-full font-medium">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">
                    Google Drive Integration
                  </span>
                  <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-500 text-xs rounded-full font-medium">
                    Testing
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Video Player</span>
                  <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-500 text-xs rounded-full font-medium">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Video Management
            </h2>

            {allVideos.length === 0 ? (
              <div className="bg-card rounded-lg p-8 text-center border border-border">
                <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No videos uploaded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Creator
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Views
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Likes
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Format
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allVideos.map((video) => (
                      <tr
                        key={video.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
                          {video.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {video.creator}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {(video.views / 1000).toFixed(0)}K
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {(video.likes / 1000).toFixed(0)}K
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-primary bg-opacity-20 text-primary rounded text-xs font-medium">
                            {video.format === "long" && "Long"}
                            {video.format === "short" && "Short"}
                            {video.format === "photo_text" && "Photo+Text"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              video.status === "ready"
                                ? "bg-green-500 bg-opacity-20 text-green-500"
                                : "bg-yellow-500 bg-opacity-20 text-yellow-500"
                            }`}
                          >
                            {video.status === "ready"
                              ? "Published"
                              : "Processing"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              User Management
            </h2>

            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Device ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Videos
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(
                    localStorage.getItem("bilibili_users_list") || "[]",
                  ).map((userItem: any) => {
                    const userVideos = allVideos.filter(
                      (v) => v.creatorId === userItem.id,
                    );
                    return (
                      <tr
                        key={userItem.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-foreground">
                          {userItem.username}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono text-xs">
                          {userItem.deviceId?.substring(0, 12)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {userVideos.length}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {JSON.parse(localStorage.getItem("bilibili_users_list") || "[]")
                .length === 0 && (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No users yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              App Settings
            </h2>

            <div className="space-y-6">
              {/* General Settings */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  General Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      App Title
                    </label>
                    <input
                      type="text"
                      defaultValue="VideoShare"
                      className="w-full bg-muted text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max Upload Size (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue={5000}
                      className="w-full bg-muted text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Integration Settings */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Integrations
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        Google Drive API
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For video storage
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-500 text-xs rounded-full font-medium">
                      Not Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        Google Sheets API
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For metadata storage
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-500 text-xs rounded-full font-medium">
                      Not Connected
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
