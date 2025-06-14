import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  ArrowRight, 
  X
} from "lucide-react";
import { useLocation } from "wouter";

interface WelcomeBannerProps {
  onDismiss: () => void;
  userName?: string;
}

export function WelcomeBanner({ onDismiss, userName = "there" }: WelcomeBannerProps) {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: "Welcome to SKU Insights",
      description: "Your CPG product launch management platform",
      content: "We'll guide you through setting up your first product and understanding key features.",
      action: "Get Started",
      nextStep: 1
    },
    {
      title: "Step 1: Add Your Products",
      description: "Upload your SKU data to begin tracking performance",
      content: "Start by adding your products in SKU Management. You can upload via CSV or add them individually.",
      action: "Go to SKU Management",
      path: "/sku-management",
      nextStep: 2
    },
    {
      title: "Step 2: Monitor Performance",
      description: "Track brand health and consumer behavior",
      content: "Once you have SKUs, monitor key metrics like Brand Lift Score, Purchase Intent, and sentiment data.",
      action: "View Analytics",
      path: "/behavioral",
      nextStep: 3
    },
    {
      title: "Step 3: Create Surveys",
      description: "Gather consumer insights with targeted surveys",
      content: "Build custom surveys to understand consumer preferences and optimize your product strategy.",
      action: "Build Survey",
      path: "/survey-builder",
      nextStep: 4
    },
    {
      title: "You're All Set!",
      description: "Your workspace is ready for product success",
      content: "Explore the platform and use the workflow navigation to guide your product launch journey.",
      action: "Start Exploring",
      nextStep: -1
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleAction = () => {
    if (currentStepData.path) {
      navigate(currentStepData.path);
      onDismiss();
    } else if (currentStepData.nextStep === -1) {
      onDismiss();
    } else {
      setCurrentStep(currentStepData.nextStep);
    }
  };

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">{currentStepData.title}</h3>
            <Badge variant="outline" className="text-xs">
              {currentStep + 1} of {onboardingSteps.length}
            </Badge>
          </div>
          
          <p className="text-sm text-blue-800 mb-2">
            {currentStepData.description}
          </p>
          
          <AlertDescription className="text-blue-700 mb-3">
            {currentStepData.content}
          </AlertDescription>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={handleAction}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStepData.action}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            
            {currentStep < onboardingSteps.length - 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDismiss}
                className="text-blue-600"
              >
                Skip Tour
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1 mt-3">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-blue-200'
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}