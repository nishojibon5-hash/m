import { Link, useLocation } from "react-router-dom";
import { Search, Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  showNavTabs?: boolean;
  navTabs?: NavTab[];
  onNavTabChange?: (tab: string) => void;
  activeTab?: string;
  hideBottomNav?: boolean;
}

interface NavTab {
  id: string;
  label: string;
}

const defaultTabs: NavTab[] = [
  { id: "following", label: "Following" },
  { id: "foryou", label: "For You" },
  { id: "anime", label: "Anime" },
  { id: "post", label: "Post" },
  { id: "plaza", label: "Plaza" },
];

export default function MainLayout({
  children,
  showNavTabs = true,
  navTabs = defaultTabs,
  onNavTabChange,
  activeTab = "foryou",
  hideBottomNav = false,
}: MainLayoutProps) {
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "discover", label: "Discover", icon: Compass, href: "/discover" },
    { id: "upload", label: "Upload", icon: Plus, href: "/upload" },
    { id: "chats", label: "Chats", icon: MessageCircle, href: "/chats" },
    { id: "me", label: "Me", icon: User, href: "/me" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-full px-4 py-4 md:py-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search Anime | Video | Creator"
                className="w-full bg-card text-foreground placeholder-muted-foreground px-4 py-3 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        {showNavTabs && (
          <div className="border-t border-border overflow-x-auto">
            <div className="flex px-4 min-w-min gap-8">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onNavTabChange?.(tab.id)}
                  className={`py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Flex grow to push nav to bottom */}
      <div className="flex-1 w-full overflow-y-auto pb-24 md:pb-20">
        {children}
      </div>

      {/* Bottom Navigation - Mobile (Fixed overlay) */}
      {!hideBottomNav && (
        <>
          {/* Mobile Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-border z-50 safe-area-inset-bottom">
            <div className="flex items-center justify-around h-20 px-2">
              {navItems.map(({ id, label, icon: Icon, href }) => {
                const isActive = location.pathname === href;
                return (
                  <Link
                    key={id}
                    to={href}
                    className={`flex flex-col items-center justify-center flex-1 h-20 transition-colors rounded-lg ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {id === "upload" ? (
                      <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    ) : (
                      <>
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-semibold">{label}</span>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Desktop Navigation - Bottom Bar */}
          <nav className="hidden md:block fixed left-0 right-0 bottom-0 bg-background border-t border-border z-50">
            <div className="flex items-center justify-around h-16 px-4">
              {navItems.map(({ id, label, icon: Icon, href }) => {
                const isActive = location.pathname === href;
                return (
                  <Link
                    key={id}
                    to={href}
                    className={`flex items-center gap-2 px-6 h-16 transition-colors rounded-lg ${
                      isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {id === "upload" ? (
                      <div className="rounded-full bg-primary px-4 py-2 flex items-center gap-2 shadow-lg">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                        <span className="text-sm font-medium text-primary-foreground">{label}</span>
                      </div>
                    ) : (
                      <>
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{label}</span>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Desktop content padding */}
          <div className="hidden md:block h-16" />
        </>
      )}
    </div>
  );
}
