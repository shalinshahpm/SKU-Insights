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
      description: "Your complete CPG product lifecycle platform",
      content: "We'll guide you through the 5-step process from concept validation to outcome tracking.",
      action: "Start Tour",
      nextStep: 1
    },
    {
      title: "Step 1: Upload Your SKUs & Concepts",
      description: "Get started by uploading your products and early ideas",
      content: "Start here by uploading the SKUs or concepts you want to validate, monitor, or optimize. Upload via CSV, connect APIs, or add concept descriptions and images.",
      action: "Go to SKU Management",
      path: "/sku-management",
      nextStep: 2
    },
    {
      title: "Step 2: Run Pre-Launch Validation",
      description: "Evaluate product appeal, uniqueness, and pricing before launch",
      content: "Test how real consumers respond to your product ideas before investing in a full launch. Launch A/B tests, concept tests, and price sensitivity studies.",
      action: "Start Validation",
      path: "https://survfast.xyz/",
      external: true,
      nextStep: 3
    },
    {
      title: "Step 3: Monitor SKU Performance in Market",
      description: "See how your SKUs are performing post-launch in real time",
      content: "After launch, monitor performance live to catch issues or scale winners quickly. Track sell-through, add-to-cart rates, and abandonment across platforms.",
      action: "View Performance",
      path: "/launch-execution",
      nextStep: 4
    },
    {
      title: "Step 4: Trigger Feedback & Optimization",
      description: "Collect targeted feedback and take rapid actions based on live data",
      content: "Trigger feedback automatically when signals dip, and improve with real insights. Set up smart triggers and launch follow-up surveys based on performance.",
      action: "Set Up Triggers",
      path: "/post-launch-optimization",
      nextStep: 5
    },
    {
      title: "Step 5: Review Recommendations & Outcomes",
      description: "Understand what worked, what didn't, and how to move forward",
      content: "Get a complete picture of each SKU from concept to outcome with export-ready summaries. View unified insights and recommendations for future launches.",
      action: "View Executive Summary",
      path: "/executive-summary",
      nextStep: -1
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleAction = () => {
    if (currentStepData.path) {
      // Advance to next step before navigating
      if (currentStepData.nextStep !== -1) {
        setCurrentStep(currentStepData.nextStep);
      }
      
      // Handle external links
      if (currentStepData.external) {
        window.open(currentStepData.path, '_blank');
      } else {
        navigate(currentStepData.path);
      }
    } else if (currentStepData.nextStep === -1) {
      onDismiss();
    } else {
      setCurrentStep(currentStepData.nextStep);
    }
  };

  const handleNextStep = () => {
    if (currentStepData.nextStep === -1) {
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
            
            {currentStep > 0 && currentStep < onboardingSteps.length - 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextStep}
                className="text-blue-600 border-blue-600"
              >
                Next Step
              </Button>
            )}
            
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