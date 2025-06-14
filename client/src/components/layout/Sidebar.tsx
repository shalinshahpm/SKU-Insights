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
  ChevronUp,
  BarChart3,
  Cog,
  Eye,
  Wrench,
  Rocket,
  RefreshCw,
  Menu,
  TestTube,
  CheckCircle
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ 
  user = defaultUser, 
  isMobile = false, 
  isOpen = true, 
  onClose,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const [location] = useLocation();

  // Role-based navigation configuration
  const getRoleBasedNavigation = (userRole: string) => {
    const baseOverview = [
      {
        title: "Dashboard",
        icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
        path: "/dashboard",
        isActive: location === "/dashboard"
      }
    ];

    switch (userRole) {
      case "Brand Manager":
        return {
          overview: [
            ...baseOverview,
            {
              title: "Campaign Timeline",
              icon: <Clock className="mr-3 h-5 w-5" />,
              path: "/insights-timeline",
              isActive: location === "/insights-timeline"
            }
          ],
          workflow: [
            {
              title: "Launch Execution",
              icon: <Rocket className="mr-3 h-5 w-5" />,
              path: "/launch-execution",
              isActive: location === "/launch-execution"
            },
            {
              title: "Post-Launch Optimization",
              icon: <RefreshCw className="mr-3 h-5 w-5" />,
              path: "/post-launch",
              isActive: location === "/post-launch"
            },
            {
              title: "Executive Summary",
              icon: <BarChart3 className="mr-3 h-5 w-5" />,
              path: "/executive-summary",
              isActive: location === "/executive-summary"
            }
          ],
          analytics: [
            {
              title: "Brand Health",
              icon: <Heart className="mr-3 h-5 w-5" />,
              path: "/brand-health",
              isActive: location === "/brand-health"
            },
            {
              title: "Performance Insights",
              icon: <Activity className="mr-3 h-5 w-5" />,
              path: "/behavioral",
              isActive: location === "/behavioral"
            }
          ],
          management: [
            {
              title: "SKU Portfolio",
              icon: <Store className="mr-3 h-5 w-5" />,
              path: "/sku-management",
              isActive: location === "/sku-management"
            },
            {
              title: "Survey Builder",
              icon: <FileText className="mr-3 h-5 w-5" />,
              path: "/survey-builder",
              isActive: location === "/survey-builder"
            }
          ]
        };
      
      case "Regional Insights Lead":
        return {
          overview: [
            ...baseOverview,
            {
              title: "Regional Timeline",
              icon: <Clock className="mr-3 h-5 w-5" />,
              path: "/insights-timeline",
              isActive: location === "/insights-timeline"
            }
          ],
          workflow: [
            {
              title: "Launch Execution",
              icon: <Rocket className="mr-3 h-5 w-5" />,
              path: "/launch-execution",
              isActive: location === "/launch-execution"
            },
            {
              title: "Post-Launch Optimization",
              icon: <RefreshCw className="mr-3 h-5 w-5" />,
              path: "/post-launch",
              isActive: location === "/post-launch"
            },
            {
              title: "Executive Summary",
              icon: <BarChart3 className="mr-3 h-5 w-5" />,
              path: "/executive-summary",
              isActive: location === "/executive-summary"
            }
          ],
          analytics: [
            {
              title: "Regional Performance",
              icon: <Activity className="mr-3 h-5 w-5" />,
              path: "/behavioral",
              isActive: location === "/behavioral"
            },
            {
              title: "Market Analysis",
              icon: <Heart className="mr-3 h-5 w-5" />,
              path: "/brand-health",
              isActive: location === "/brand-health"
            }
          ],
          management: [
            {
              title: "Research & Surveys",
              icon: <FileText className="mr-3 h-5 w-5" />,
              path: "/survey-builder",
              isActive: location === "/survey-builder"
            },
            {
              title: "Team Management",
              icon: <UserCog className="mr-3 h-5 w-5" />,
              path: "/user-management",
              isActive: location === "/user-management"
            }
          ]
        };

      case "Global Marketing Operations":
        return {
          overview: [
            ...baseOverview,
            {
              title: "Global Timeline",
              icon: <Clock className="mr-3 h-5 w-5" />,
              path: "/insights-timeline",
              isActive: location === "/insights-timeline"
            }
          ],
          workflow: [
            {
              title: "Launch Execution",
              icon: <Rocket className="mr-3 h-5 w-5" />,
              path: "/launch-execution",
              isActive: location === "/launch-execution"
            },
            {
              title: "Post-Launch Optimization",
              icon: <RefreshCw className="mr-3 h-5 w-5" />,
              path: "/post-launch",
              isActive: location === "/post-launch"
            },
            {
              title: "Executive Summary",
              icon: <BarChart3 className="mr-3 h-5 w-5" />,
              path: "/executive-summary",
              isActive: location === "/executive-summary"
            }
          ],
          analytics: [
            {
              title: "Global Performance",
              icon: <Activity className="mr-3 h-5 w-5" />,
              path: "/behavioral",
              isActive: location === "/behavioral"
            },
            {
              title: "Brand Health",
              icon: <Heart className="mr-3 h-5 w-5" />,
              path: "/brand-health",
              isActive: location === "/brand-health"
            }
          ],
          management: [
            {
              title: "SKU Operations",
              icon: <Store className="mr-3 h-5 w-5" />,
              path: "/sku-management",
              isActive: location === "/sku-management"
            },
            {
              title: "Survey Operations",
              icon: <FileText className="mr-3 h-5 w-5" />,
              path: "/survey-builder",
              isActive: location === "/survey-builder"
            },
            {
              title: "User Management",
              icon: <UserCog className="mr-3 h-5 w-5" />,
              path: "/user-management",
              isActive: location === "/user-management"
            }
          ]
        };

      default:
        return {
          overview: baseOverview,
          analytics: [
            {
              title: "Behavioral Intelligence",
              icon: <Activity className="mr-3 h-5 w-5" />,
              path: "/behavioral",
              isActive: location === "/behavioral"
            },
            {
              title: "Brand Health",
              icon: <Heart className="mr-3 h-5 w-5" />,
              path: "/brand-health",
              isActive: location === "/brand-health"
            }
          ],
          management: [
            {
              title: "SKU Management",
              icon: <Store className="mr-3 h-5 w-5" />,
              path: "/sku-management",
              isActive: location === "/sku-management"
            },
            {
              title: "Survey Builder",
              icon: <FileText className="mr-3 h-5 w-5" />,
              path: "/survey-builder",
              isActive: location === "/survey-builder"
            },
            {
              title: "User Management",
              icon: <UserCog className="mr-3 h-5 w-5" />,
              path: "/user-management",
              isActive: location === "/user-management"
            }
          ]
        };
    }
  };

  const navigation = getRoleBasedNavigation(user?.role || "");

  const settingsItems: SidebarItem[] = [
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
            <span className="text-lg font-semibold">SKU Insights</span>
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
          <SidebarSection title="Overview" items={navigation.overview} />
          {navigation.workflow && (
            <SidebarSection title="🚀 Product Lifecycle" items={navigation.workflow} />
          )}
          <SidebarSection title="📊 Analytics & Monitoring" items={navigation.analytics} />
          <SidebarSection title="⚙️ Management & Actions" items={navigation.management} />
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
