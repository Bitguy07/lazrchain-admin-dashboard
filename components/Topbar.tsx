import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface TopbarProps {
  activeTab: string;
  toggleSidebar: () => void;
  adminEmail?: string;
  onProfileClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  toggleSidebar,
  adminEmail,
  onProfileClick,
}) => {
  return (
    <div className="bg-card shadow-sm border-b border-border px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            className="lg:hidden p-2 hover:bg-muted"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </Button>
          <h1 className="text-lg sm:text-xl pl-3 font-bold text-foreground">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "referral" && "Referral Program"}
            {activeTab === "rewards" && "Rewards"}
            {activeTab === "wallet" && "Wallet"}
             {activeTab === "settings" && "Settings"}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-2 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
            onClick={onProfileClick}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-sm">{adminEmail?.charAt(0)?.toUpperCase() || "U"}</span>
            </div>
            <span className="text-foreground font-medium text-sm truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
              {adminEmail || 'guest@email.com'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
