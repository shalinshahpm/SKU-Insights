import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ExternalLink,
  TestTube,
  Rocket,
  RefreshCw,
  BarChart3,
  Home
} from "lucide-react";
import { useLocation } from "wouter";

export type WorkflowPhase = "upload" | "pre-launch" | "launch" | "post-launch" | "executive";

export interface WorkflowStep {
  id: WorkflowPhase;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  isComplete: boolean;
  isActive: boolean;
  isExternal?: boolean;
  externalUrl?: string;
}

interface WorkflowHeaderProps {
  currentPhase: WorkflowPhase;
  completedSteps: number;
  totalSteps: number;
  skuName?: string;
}

export function WorkflowHeader({ 
  currentPhase, 
  completedSteps, 
  totalSteps, 
  skuName = "All SKUs" 
}: WorkflowHeaderProps) {
  const [, navigate] = useLocation();

  const workflowSteps: WorkflowStep[] = [
    {
      id: "upload",
      title: "Upload SKUs & Concepts",
      description: "Upload products and early ideas via CSV or API",
      icon: <TestTube className="h-4 w-4" />,
      path: "/sku-management",
      isComplete: currentPhase !== "upload",
      isActive: currentPhase === "upload"
    },
    {
      id: "pre-launch",
      title: "Pre-Launch Validation",
      description: "Evaluate appeal, uniqueness, and pricing before launch",
      icon: <TestTube className="h-4 w-4" />,
      path: "/pre-launch",
      isComplete: !["upload", "pre-launch"].includes(currentPhase),
      isActive: currentPhase === "pre-launch",
      isExternal: true,
      externalUrl: "https://survfast.xyz/"
    },
    {
      id: "launch",
      title: "Monitor Performance",
      description: "Real-time SKU performance across platforms",
      icon: <Rocket className="h-4 w-4" />,
      path: "/launch-execution",
      isComplete: ["post-launch", "executive"].includes(currentPhase),
      isActive: currentPhase === "launch"
    },
    {
      id: "post-launch",
      title: "Trigger Feedback & Optimization",
      description: "Automated triggers and targeted feedback collection",
      icon: <RefreshCw className="h-4 w-4" />,
      path: "/post-launch-optimization",
      isComplete: currentPhase === "executive",
      isActive: currentPhase === "post-launch"
    },
    {
      id: "executive",
      title: "Review Recommendations",
      description: "Complete lifecycle view with export-ready reports",
      icon: <BarChart3 className="h-4 w-4" />,
      path: "/executive-summary",
      isComplete: false,
      isActive: currentPhase === "executive"
    }
  ];

  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleStepClick = (step: WorkflowStep) => {
    if (step.isExternal && step.externalUrl) {
      window.open(step.externalUrl, '_blank');
    } else {
      navigate(step.path);
    }
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-2">
        {/* Header Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1 text-xs px-2 py-1 h-7"
            >
              <Home className="h-3 w-3" />
              Dashboard
            </Button>
            <div>
              <h2 className="text-base font-semibold">Product Lifecycle Workflow</h2>
              <p className="text-xs text-muted-foreground">
                Managing: <span className="font-medium">{skuName}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium">
              {completedSteps} of {totalSteps} complete
            </div>
            <Progress value={progressPercentage} className="w-24 h-1.5 mt-1" />
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="flex items-center justify-between gap-1">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Button */}
              <Button
                variant={step.isActive ? "default" : step.isComplete ? "secondary" : "outline"}
                className={`
                  flex items-center gap-1 px-2 py-1 h-8 text-xs
                  ${step.isActive ? "bg-primary text-primary-foreground" : ""}
                  ${step.isComplete ? "bg-green-50 text-green-700 border-green-200" : ""}
                  hover:scale-105 transition-transform
                `}
                onClick={() => handleStepClick(step)}
              >
                <div className="flex items-center gap-1">
                  {step.isComplete ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : step.isActive ? (
                    <Circle className="h-3 w-3 fill-current" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  
                  <div className="flex items-center gap-1">
                    {step.icon && <span className="[&>svg]:h-3 [&>svg]:w-3">{step.icon}</span>}
                    <span className="hidden xl:inline font-medium truncate max-w-24">
                      {step.title}
                    </span>
                    <span className="xl:hidden font-medium">
                      {index + 1}
                    </span>
                    {step.isExternal && (
                      <ExternalLink className="h-2 w-2 opacity-60" />
                    )}
                  </div>
                </div>
              </Button>

              {/* Arrow between steps */}
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="mx-1 h-3 w-3 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Description */}
        <div className="mt-2 p-2 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            {workflowSteps.find(s => s.isActive)?.icon}
            <span className="font-medium text-xs">
              Current Phase: {workflowSteps.find(s => s.isActive)?.title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {workflowSteps.find(s => s.isActive)?.description}
          </p>
        </div>
      </div>
    </div>
  );
}