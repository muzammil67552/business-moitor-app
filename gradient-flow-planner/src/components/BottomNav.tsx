import { Home, Calendar, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNav = ({ activeTab = "home", onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto gradient-primary px-6 py-4 rounded-t-3xl shadow-elevated">
        <div className="flex items-center justify-between relative">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <div key={tab.id} className="flex-1 flex justify-center">
                {index === 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-full bg-white text-primary hover:bg-white/90 shadow-elevated animate-press"
                      onClick={() => onTabChange?.("add")}
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                )}
                <button
                  onClick={() => onTabChange?.(tab.id)}
                  className={`flex flex-col items-center gap-1 transition-all animate-press ${
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
                  }`}
                  aria-label={tab.label}
                >
                  <Icon className="h-5 w-5 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
