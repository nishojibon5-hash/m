import MainLayout from "@/components/MainLayout";
import { User, LogOut } from "lucide-react";

export default function Me() {
  return (
    <MainLayout>
      <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://i.pravatar.cc/80?img=0"
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">Your Account</h1>
              <p className="text-muted-foreground">Device-tracked authentication enabled</p>
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
