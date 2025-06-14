import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkflowHeader } from "@/components/workflow/WorkflowHeader";
import { WorkflowDashboard } from "@/components/workflow/WorkflowDashboard";
import { SKUFilter } from "@/components/dashboard/SKUFilter";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BehavioralIntelligence } from "@/components/dashboard/BehavioralIntelligence";
import { SurveyTrigger } from "@/components/dashboard/SurveyTrigger";
import { InsightsTimeline } from "@/components/dashboard/InsightsTimeline";
import { CollapsibleSidebar } from "@/components/layout/CollapsibleSidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, 
  ShoppingCart, 
  SmilePlus, 
  FileText,
  Download,
  Filter,
  Plus
} from "lucide-react";
import { FilterOptions, SKU, BehavioralMetricsData, BehavioralMetricsResponse, TimelineEvent, BrandHealthMetricsData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState("7days");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    selectedSku: "all",
    selectedRetailers: [] as string[],
    selectedRegion: "all"
  });

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ["/api/skus"] 
  });

  // Use a default SKU id if none is selected
  const defaultSkuId = skus.length > 0 ? skus[0].id : null;
  
  // Fetch behavioral metrics for the selected SKU or default SKU
  const { data: behavioralResponse } = useQuery<BehavioralMetricsResponse>({
    queryKey: [
      "/api/behavioral-metrics", 
      `?skuId=${filters.selectedSku !== "all" ? filters.selectedSku : defaultSkuId}`
    ],
    enabled: !!defaultSkuId
  });

  // Fetch timeline events
  const { data: timelineEvents = [] } = useQuery<TimelineEvent[]>({ 
    queryKey: ["/api/timeline-events"] 
  });

  // Fetch brand health metrics (mock data structure for now)
  const { data: brandHealthData = {
    brandLiftScore: 73,
    purchaseIntent: 68,
    netSentiment: 82,
    activeSurveys: 3
  } } = useQuery<BrandHealthMetricsData>({
    queryKey: ["/api/brand-health-metrics"],
    enabled: false // Disable until we have real API
  });

  const behavioralData = behavioralResponse?.metrics || [];
  const summaryData = behavioralResponse?.summary;

  const handleExportReport = async () => {
    toast({
      title: "Export Started",
      description: "Your report is being prepared for download.",
    });
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      selectedSku: "all",
      selectedRetailers: [],
      selectedRegion: "all"
    });
  };

  const handleCreateSurvey = async (surveyType: string, targetAudience?: string) => {
    try {
      const response = await apiRequest("POST", "/api/surveys", {
        name: `${surveyType} Survey - ${new Date().toLocaleDateString()}`,
        description: `Automated ${surveyType.toLowerCase()} survey created from dashboard`,
        questions: [],
        targetAudience: targetAudience || "general",
        skuId: filters.selectedSku !== "all" ? parseInt(filters.selectedSku) : defaultSkuId,
        status: "draft"
      });

      if (response.ok) {
        toast({
          title: "Survey Created",
          description: "Your survey has been created. Continue in the Survey Builder.",
        });
        navigate("/survey-builder");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewAllTimeline = () => {
    navigate("/insights-timeline");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <CollapsibleSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        <WorkflowHeader 
          currentPhase="launch"
          completedSteps={0}
          totalSteps={4}
          skuName={filters.selectedSku === "all" ? "All SKUs" : skus.find(s => s.id.toString() === filters.selectedSku)?.name}
        />
        
        <div className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight mb-1">SKU Performance Dashboard</h1>
              <p className="text-muted-foreground">Monitor your product portfolio and identify optimization opportunities</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">Quick view:</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full sm:w-auto border-0 bg-transparent shadow-none h-8 px-2">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="quarter">Last quarter</SelectItem>
                    <SelectItem value="ytd">Year to date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="flex items-center gap-2 bg-primary/90 hover:bg-primary"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mb-6">
              <SKUFilter
                skus={skus}
                filters={filters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Brand Lift Score"
              value={brandHealthData.brandLiftScore}
              unit="%"
              trend={brandHealthData.brandLiftScore >= 70 ? "up" : "down"}
              trendValue={brandHealthData.brandLiftScore >= 70 ? 8 : -5}
              icon={<LineChart className="h-4 w-4" />}
              performanceLevel={brandHealthData.brandLiftScore >= 80 ? "excellent" : brandHealthData.brandLiftScore >= 70 ? "good" : brandHealthData.brandLiftScore >= 50 ? "average" : "poor"}
              benchmark="Industry avg: 65%"
              actionHint={brandHealthData.brandLiftScore >= 70 ? "Strong brand performance" : "Consider brand awareness campaigns"}
              quickAction={brandHealthData.brandLiftScore < 60 ? {
                label: "Launch Brand Survey",
                action: () => handleCreateSurvey("Brand Awareness", "brand-focused"),
                variant: "default"
              } : undefined}
            />

            <MetricCard
              title="Purchase Intent"
              value={brandHealthData.purchaseIntent}
              unit="%"
              trend={brandHealthData.purchaseIntent >= 65 ? "up" : "down"}
              trendValue={brandHealthData.purchaseIntent >= 65 ? 12 : -8}
              icon={<ShoppingCart className="h-4 w-4" />}
              performanceLevel={brandHealthData.purchaseIntent >= 75 ? "excellent" : brandHealthData.purchaseIntent >= 65 ? "good" : brandHealthData.purchaseIntent >= 45 ? "average" : "poor"}
              benchmark="Target: 70%+"
              actionHint={brandHealthData.purchaseIntent >= 65 ? "Good conversion potential" : "Focus on value proposition messaging"}
              quickAction={brandHealthData.purchaseIntent < 50 ? {
                label: "Create Intent Survey",
                action: () => handleCreateSurvey("Purchase Intent", "conversion-focused"),
                variant: "default"
              } : undefined}
            />

            <MetricCard
              title="Net Sentiment"
              value={brandHealthData.netSentiment}
              unit="%"
              trend={brandHealthData.netSentiment >= 75 ? "up" : "down"}
              trendValue={brandHealthData.netSentiment >= 75 ? 6 : -12}
              icon={<SmilePlus className="h-4 w-4" />}
              performanceLevel={brandHealthData.netSentiment >= 85 ? "excellent" : brandHealthData.netSentiment >= 75 ? "good" : brandHealthData.netSentiment >= 60 ? "average" : "poor"}
              benchmark="Healthy: 75%+"
              actionHint={brandHealthData.netSentiment >= 75 ? "Positive consumer sentiment" : "Address negative feedback themes"}
              quickAction={brandHealthData.netSentiment < 60 ? {
                label: "Sentiment Analysis",
                action: () => navigate("/brand-health"),
                variant: "outline"
              } : undefined}
            />

            <MetricCard
              title="Active Surveys"
              value={brandHealthData.activeSurveys}
              unit="surveys"
              trend="stable"
              trendValue={0}
              icon={<FileText className="h-4 w-4" />}
              performanceLevel={brandHealthData.activeSurveys >= 4 ? "excellent" : brandHealthData.activeSurveys >= 3 ? "good" : brandHealthData.activeSurveys >= 2 ? "average" : "poor"}
              benchmark="Target: 4-5 active"
              actionHint={brandHealthData.activeSurveys >= 4 ? "Good survey coverage" : "Launch additional surveys for better insights"}
              quickAction={brandHealthData.activeSurveys < 3 ? {
                label: "Create Survey",
                action: () => navigate("/survey-builder"),
                variant: "default"
              } : undefined}
            />
          </div>

          {/* Main Dashboard Content */}
          <WorkflowDashboard />
        </div>
      </div>
    </div>
  );
}