import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Lightbulb, 
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  HelpCircle
} from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SKU, BrandHealthMetricsData } from "@/lib/types";

interface SimplifiedDashboardProps {
  onShowFullDashboard: () => void;
  isNewUser?: boolean;
}

export function SimplifiedDashboard({ onShowFullDashboard, isNewUser = false }: SimplifiedDashboardProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showDetails, setShowDetails] = useState(false);

  // Fetch data
  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ["/api/skus"] 
  });

  // Mock brand health data - in real app would come from API
  const brandHealthData = {
    brandLiftScore: 73,
    purchaseIntent: 68,
    netSentiment: 82,
    activeSurveys: 3
  };

  // Determine the primary focus metric and status
  const getPrimaryMetric = () => {
    const metrics = [
      { name: "Brand Lift Score", value: brandHealthData.brandLiftScore, target: 70, priority: 1 },
      { name: "Purchase Intent", value: brandHealthData.purchaseIntent, target: 70, priority: 2 },
      { name: "Net Sentiment", value: brandHealthData.netSentiment, target: 75, priority: 3 }
    ];

    // Find the metric that needs most attention (below target)
    const needsAttention = metrics.find(m => m.value < m.target);
    const primaryMetric = needsAttention || metrics[0];

    const status = primaryMetric.value >= primaryMetric.target ? "good" : 
                   primaryMetric.value >= primaryMetric.target * 0.9 ? "warning" : "critical";

    return { ...primaryMetric, status };
  };

  const primaryMetric = getPrimaryMetric();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical": return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecommendedAction = () => {
    if (primaryMetric.name === "Brand Lift Score" && primaryMetric.status !== "good") {
      return {
        title: "Boost Brand Awareness",
        description: "Your brand lift score is below target. Launch a brand awareness survey to understand perception gaps.",
        action: "Create Brand Survey",
        path: "/survey-builder"
      };
    }
    if (primaryMetric.name === "Purchase Intent" && primaryMetric.status !== "good") {
      return {
        title: "Improve Purchase Intent",
        description: "Customers aren't ready to buy. Focus on value proposition and competitive positioning.",
        action: "Analyze Performance",
        path: "/behavioral"
      };
    }
    if (primaryMetric.name === "Net Sentiment" && primaryMetric.status !== "good") {
      return {
        title: "Address Sentiment Issues",
        description: "Customer sentiment needs attention. Review feedback and identify improvement areas.",
        action: "View Brand Health",
        path: "/brand-health"
      };
    }
    return {
      title: "Continue Monitoring",
      description: "Your metrics look good! Keep monitoring performance and optimize where needed.",
      action: "View Timeline",
      path: "/insights-timeline"
    };
  };

  const recommendedAction = getRecommendedAction();

  const handleTakeAction = () => {
    navigate(recommendedAction.path);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner for New Users */}
      {isNewUser && (
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Welcome to SKU Insights!</strong> We've simplified your dashboard to show what matters most. 
            Your primary focus right now is <strong>{primaryMetric.name}</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* Primary Metric Focus Card */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(primaryMetric.status)}
              <div>
                <CardTitle className="text-lg">Focus Area: {primaryMetric.name}</CardTitle>
                <CardDescription>Your most important metric right now</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Metric Display */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${getStatusColor(primaryMetric.status)}`}>
                    {primaryMetric.value}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Target: {primaryMetric.target}%
                  </span>
                </div>
                <Badge 
                  variant={primaryMetric.status === "good" ? "default" : 
                           primaryMetric.status === "warning" ? "secondary" : "destructive"}
                  className="mt-1"
                >
                  {primaryMetric.status === "good" ? "On Track" : 
                   primaryMetric.status === "warning" ? "Needs Attention" : "Critical"}
                </Badge>
              </div>
              
              <div className="text-right">
                {primaryMetric.value >= primaryMetric.target ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600" />
                )}
              </div>
            </div>

            {/* Additional Details */}
            {showDetails && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-600">{brandHealthData.brandLiftScore}%</div>
                  <div className="text-sm text-muted-foreground">Brand Lift Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-blue-600">{brandHealthData.purchaseIntent}%</div>
                  <div className="text-sm text-muted-foreground">Purchase Intent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-purple-600">{brandHealthData.netSentiment}%</div>
                  <div className="text-sm text-muted-foreground">Net Sentiment</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Action Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Recommended Next Step
          </CardTitle>
          <CardDescription>Based on your current performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{recommendedAction.title}</h4>
              <p className="text-sm text-muted-foreground">{recommendedAction.description}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={handleTakeAction} className="flex items-center gap-2">
                {recommendedAction.action}
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onShowFullDashboard}
                className="flex items-center gap-2"
              >
                View Full Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Overview</CardTitle>
            <CardDescription>Your current portfolio status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-semibold">{skus.length}</div>
                <div className="text-sm text-muted-foreground">Active SKUs</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">{brandHealthData.activeSurveys}</div>
                <div className="text-sm text-muted-foreground">Running Surveys</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">2</div>
                <div className="text-sm text-muted-foreground">Active Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">7</div>
                <div className="text-sm text-muted-foreground">Days to Launch</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Need help getting started?</p>
              <p className="text-sm text-muted-foreground">
                This simplified view focuses on your most important metric. Use the recommended actions to improve performance, 
                or switch to the full dashboard for detailed analytics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}