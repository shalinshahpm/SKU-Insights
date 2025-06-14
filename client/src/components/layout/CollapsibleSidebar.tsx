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
  ChevronDown,
  ChevronUp,
  BarChart3,
  Rocket,
  RefreshCw,
  Menu,
  TestTube,
  CheckCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { User } from "@/lib/types";

// Mock user data for now
const defaultUser: User = {
  id: 1,
  username: "brand_manager",
  fullName: "Sam Johnson",
  role: "brand_manager"
};

interface WorkflowStep {
  phase: number;
  title: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  isCompleted: boolean;
  isExternal?: boolean;
  description: string;
}

interface CollapsibleSidebarProps {
  user?: User;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function WorkflowStepItem({ step }: { step: WorkflowStep }) {
  const handleClick = () => {
    if (step.isExternal) {
      window.open(step.path, '_blank');
    }
  };

  const StepContent = () => (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
      step.isActive 
        ? 'bg-primary/10 border-primary/20 text-primary' 
        : step.isCompleted
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-muted/30 border-border hover:bg-muted/50'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step.isCompleted 
            ? 'bg-green-100 text-green-600' 
            : step.isActive
            ? 'bg-primary/20 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}>
          {step.isCompleted ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <span className="text-sm font-semibold">{step.phase}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {step.icon}
            <span className="font-medium text-sm">{step.title}</span>
            {step.isExternal && <ExternalLink className="h-3 w-3 opacity-60" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 opacity-40" />
    </div>
  );

  if (step.isExternal) {
    return (
      <button onClick={handleClick} className="w-full text-left">
        <StepContent />
      </button>
    );
  }

  return (
    <Link href={step.path}>
      <StepContent />
    </Link>
  );
}

function QuickAccessSection({ title, items, isExpanded, onToggle }: {
  title: string;
  items: Array<{
    title: string;
    icon: React.ReactNode;
    path: string;
    isActive: boolean;
  }>;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-4">
      <button 
        className="flex justify-between items-center w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        onClick={onToggle}
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <nav className="space-y-1">
          {items.map((item, index) => (
            <Link key={index} href={item.path}>
              <div className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                item.isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>
                {item.icon}
                <span className="truncate">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export function CollapsibleSidebar({ 
  user = defaultUser, 
  isCollapsed = false,
  onToggleCollapse
}: CollapsibleSidebarProps) {
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    analytics: false,
    management: false
  });

  // Sequential workflow steps
  const workflowSteps: WorkflowStep[] = [
    {
      phase: 1,
      title: "Pre-Launch Validation",
      icon: <TestTube className="h-4 w-4" />,
      path: "https://survfast.xyz/",
      isActive: false,
      isCompleted: true,
      isExternal: true,
      description: "Market research & concept testing"
    },
    {
      phase: 2,
      title: "Launch Execution",
      icon: <Rocket className="h-4 w-4" />,
      path: "/launch-execution",
      isActive: location === "/launch-execution",
      isCompleted: false,
      isExternal: false,
      description: "Real-time launch monitoring"
    },
    {
      phase: 3,
      title: "Post-Launch Optimization",
      icon: <RefreshCw className="h-4 w-4" />,
      path: "/post-launch",
      isActive: location === "/post-launch",
      isCompleted: false,
      isExternal: false,
      description: "Performance optimization"
    },
    {
      phase: 4,
      title: "Executive Summary",
      icon: <BarChart3 className="h-4 w-4" />,
      path: "/executive-summary",
      isActive: location === "/executive-summary",
      isCompleted: false,
      isExternal: false,
      description: "Strategic insights & decisions"
    }
  ];

  // Quick access navigation
  const overviewItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-3 h-4 w-4" />,
      path: "/dashboard",
      isActive: location === "/dashboard" || location === "/"
    },
    {
      title: "Insights Timeline",
      icon: <Clock className="mr-3 h-4 w-4" />,
      path: "/insights-timeline",
      isActive: location === "/insights-timeline"
    }
  ];

  const analyticsItems = [
    {
      title: "Brand Health",
      icon: <Heart className="mr-3 h-4 w-4" />,
      path: "/brand-health",
      isActive: location === "/brand-health"
    },
    {
      title: "Performance Insights",
      icon: <Activity className="mr-3 h-4 w-4" />,
      path: "/behavioral",
      isActive: location === "/behavioral"
    }
  ];

  const managementItems = [
    {
      title: "SKU Portfolio",
      icon: <Store className="mr-3 h-4 w-4" />,
      path: "/sku-management",
      isActive: location === "/sku-management"
    },
    {
      title: "Survey Builder",
      icon: <FileText className="mr-3 h-4 w-4" />,
      path: "/survey-builder",
      isActive: location === "/survey-builder"
    },
    {
      title: "User Management",
      icon: <UserCog className="mr-3 h-4 w-4" />,
      path: "/user-management",
      isActive: location === "/user-management"
    }
  ];

  const settingsItems = [
    {
      title: "Account Settings",
      icon: <Settings className="mr-3 h-4 w-4" />,
      path: "/account-settings",
      isActive: location === "/account-settings"
    }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 border-r border-border transition-all duration-300 ease-in-out h-full ${
      isCollapsed ? "w-16" : "w-80"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className={`flex items-center space-x-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && <span className="text-lg font-semibold">SKU Insights</span>}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Workflow Steps */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isCollapsed && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Product Lifecycle Workflow</h3>
              <div className="space-y-3">
                {workflowSteps.map((step) => (
                  <WorkflowStepItem key={step.phase} step={step} />
                ))}
              </div>
            </div>

            {/* Quick Access Sections */}
            <QuickAccessSection
              title="Overview"
              items={overviewItems}
              isExpanded={expandedSections.overview}
              onToggle={() => toggleSection('overview')}
            />

            <QuickAccessSection
              title="Analytics"
              items={analyticsItems}
              isExpanded={expandedSections.analytics}
              onToggle={() => toggleSection('analytics')}
            />

            <QuickAccessSection
              title="Management"
              items={managementItems}
              isExpanded={expandedSections.management}
              onToggle={() => toggleSection('management')}
            />

            <QuickAccessSection
              title="Settings"
              items={settingsItems}
              isExpanded={true}
              onToggle={() => {}}
            />
          </>
        )}

        {isCollapsed && (
          <div className="space-y-2">
            {/* Collapsed workflow indicators */}
            {workflowSteps.map((step) => (
              <div key={step.phase} className="flex justify-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.isCompleted 
                    ? 'bg-green-100 text-green-600' 
                    : step.isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-semibold">{step.phase}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* User Profile */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center">
            <UserAvatar user={user} />
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.fullName || "Brand Manager"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Brand Manager"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}