import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Store, 
  Activity, 
  FileText, 
  Heart, 
  Clock, 
  UserCog, 
  Settings,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { User, SidebarItem, SidebarSectionProps } from "@/lib/types";

// Mock user data for now
const defaultUser: User = {
  id: 1,
  username: "brand_manager",
  fullName: "Sam Johnson",
  role: "brand_manager"
};

function SidebarSection({ title, items }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-2">
      <div 
        className="flex justify-between items-center px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </div>
      
      {isExpanded && (
        <nav className="space-y-1">
          {items.map((item, index) => (
            <Link key={index} href={item.path}>
              <div
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  item.isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-foreground hover:bg-muted"
                } cursor-pointer`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

interface SidebarProps {
  user?: User;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ 
  user = defaultUser, 
  isMobile = false, 
  isOpen = true, 
  onClose 
}: SidebarProps) {
  const [location] = useLocation();

  const mainItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      path: "/",
      isActive: location === "/"
    },
    {
      title: "SKU Management",
      icon: <Store className="mr-3 h-5 w-5" />,
      path: "/sku-management",
      isActive: location === "/sku-management"
    },
    {
      title: "Behavioral Intelligence",
      icon: <Activity className="mr-3 h-5 w-5" />,
      path: "/behavioral",
      isActive: location === "/behavioral"
    },
    {
      title: "Survey Builder",
      icon: <FileText className="mr-3 h-5 w-5" />,
      path: "/survey-builder",
      isActive: location === "/survey-builder"
    },
    {
      title: "Brand Health",
      icon: <Heart className="mr-3 h-5 w-5" />,
      path: "/brand-health",
      isActive: location === "/brand-health"
    },
    {
      title: "Insights Timeline",
      icon: <Clock className="mr-3 h-5 w-5" />,
      path: "/insights-timeline",
      isActive: location === "/insights-timeline"
    }
  ];

  const settingsItems: SidebarItem[] = [
    {
      title: "User Management",
      icon: <UserCog className="mr-3 h-5 w-5" />,
      path: "/user-management",
      isActive: location === "/user-management"
    },
    {
      title: "Account Settings",
      icon: <Settings className="mr-3 h-5 w-5" />,
      path: "/account-settings",
      isActive: location === "/account-settings"
    }
  ];

  return (
    <div 
      className={`flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-border transition-transform duration-300 ease-in-out h-full ${
        isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
      } ${isMobile ? "fixed z-40" : "relative"}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">SKU Pulse</span>
          </div>
          {isMobile && (
            <button 
              onClick={onClose} 
              className="text-muted-foreground"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <SidebarSection title="Main" items={mainItems} />
          <SidebarSection title="Settings" items={settingsItems} />
        </div>
        
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center">
            <UserAvatar user={user} />
            <div className="ml-3">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
