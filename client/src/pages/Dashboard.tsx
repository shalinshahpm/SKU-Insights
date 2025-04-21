import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { SKUFilter } from "@/components/dashboard/SKUFilter";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BehavioralIntelligence } from "@/components/dashboard/BehavioralIntelligence";
import { SurveyTrigger } from "@/components/dashboard/SurveyTrigger";
import { InsightsTimeline } from "@/components/dashboard/InsightsTimeline";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, 
  ShoppingCart, 
  SmilePlus, 
  FileText,
  Download,
  Calendar
} from "lucide-react";
import { FilterOptions, SKU, BehavioralMetricsData, TimelineEvent, BrandHealthMetricsData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [timeRange, setTimeRange] = useState("7days");
  const [filters, setFilters] = useState({
    selectedSku: "all",
    selectedMarket: "all",
    selectedRegion: "all"
  });

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ["/api/skus"] 
  });

  // Use a default SKU id if none is selected
  const defaultSkuId = skus.length > 0 ? skus[0].id : null;
  
  // Fetch behavioral metrics for the selected SKU or default SKU
  const { data: behavioralMetrics = [] } = useQuery<BehavioralMetricsData[]>({
    queryKey: [
      "/api/behavioral-metrics", 
      `?skuId=${filters.selectedSku !== "all" ? filters.selectedSku : defaultSkuId}`
    ],
    enabled: skus.length > 0, // Only run query when SKUs are loaded
  });

  // Fetch brand health metrics
  const { data: brandHealthMetrics = [] } = useQuery<BrandHealthMetricsData[]>({
    queryKey: [
      "/api/brand-health-metrics", 
      `?skuId=${filters.selectedSku !== "all" ? filters.selectedSku : defaultSkuId}`
    ],
    enabled: skus.length > 0 && false // Disable this query since we don't have a specific SKU in the mock data
  });

  // Fetch timeline events
  const { data: timelineEvents = [] } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/timeline-events?limit=4"],
  });

  // Get latest brand health metrics (normally would come from the query)
  const brandHealthData = {
    brandLiftScore: 78.4,
    purchaseIntent: 64.2,
    netSentiment: 42,
    activeSurveys: 4
  };

  // Create filter options
  const filterOptions: FilterOptions = {
    skus: skus.map(sku => ({ 
      value: sku.id.toString(), 
      label: `${sku.name} (${sku.region})` 
    })),
    markets: Array.from(new Set(skus.map(sku => sku.market))).map(market => ({
      value: market,
      label: market
    })),
    regions: Array.from(new Set(skus.map(sku => sku.region))).map(region => ({
      value: region,
      label: region
    }))
  };

  // Find anomaly data for the survey trigger
  const anomalyData = behavioralMetrics.find(metric => metric.status === "anomaly");
  const anomalySKU = anomalyData ? skus.find(sku => sku.id === anomalyData.skuId) : undefined;

  const handleApplyFilters = (newFilters: {
    selectedSku: string;
    selectedMarket: string;
    selectedRegion: string;
  }) => {
    setFilters(newFilters);
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being prepared for download.",
    });
  };

  const handleViewAllMetrics = () => {
    navigate("/behavioral");
  };

  const handleInvestigateMetric = (metric: string) => {
    toast({
      title: `Investigating ${metric}`,
      description: "Detailed analysis tools would open here.",
    });
    navigate("/behavioral");
  };

  const handleLaunchSurvey = async (surveyConfig: {
    skuId: number;
    audience: string;
    surveyType: string;
  }) => {
    try {
      const sku = skus.find(s => s.id === surveyConfig.skuId);
      
      if (!sku) {
        throw new Error("SKU not found");
      }

      // Create a survey
      const response = await apiRequest("POST", "/api/surveys", {
        skuId: surveyConfig.skuId,
        title: `${sku.name} - ${surveyConfig.surveyType.replace('_', ' ')} Survey`,
        type: surveyConfig.surveyType,
        audience: surveyConfig.audience,
        status: "draft",
        sampleSize: 300,
        questions: [] // Will be populated in the survey builder
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
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex-1">
          {/* Title and description are already in MainLayout */}
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
        </div>
      </div>

      <SKUFilter 
        filterOptions={filterOptions}
        onApplyFilters={handleApplyFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Brand Lift Score"
          value={brandHealthData.brandLiftScore.toFixed(1)}
          change={3.2}
          icon={<LineChart className="h-5 w-5 text-primary" />}
          iconBgColor="bg-primary/10"
          iconTextColor="text-primary"
          detailsLink="/brand-health"
        />
        
        <MetricCard
          title="Purchase Intent"
          value={`${brandHealthData.purchaseIntent.toFixed(1)}%`}
          change={-1.8}
          icon={<ShoppingCart className="h-5 w-5 text-secondary" />}
          iconBgColor="bg-secondary/10"
          iconTextColor="text-secondary"
          detailsLink="/brand-health"
        />
        
        <MetricCard
          title="Net Sentiment"
          value={`+${brandHealthData.netSentiment}`}
          change={5}
          icon={<SmilePlus className="h-5 w-5 text-accent" />}
          iconBgColor="bg-accent/10"
          iconTextColor="text-accent"
          detailsLink="/brand-health"
        />
        
        <MetricCard
          title="Active Surveys"
          value={brandHealthData.activeSurveys}
          subtext="of 5 planned"
          icon={<FileText className="h-5 w-5 text-success" />}
          iconBgColor="bg-success/10"
          iconTextColor="text-success"
          detailsLink="/survey-builder"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BehavioralIntelligence
          behavioralData={behavioralMetrics}
          onViewAllMetrics={handleViewAllMetrics}
          onInvestigate={handleInvestigateMetric}
        />

        <div className="space-y-6">
          <SurveyTrigger
            anomalyData={anomalySKU && anomalyData ? {
              sku: anomalySKU,
              metric: anomalyData,
              detectedTime: "30 min ago"
            } : undefined}
            onLaunchSurvey={handleLaunchSurvey}
          />
          
          <InsightsTimeline
            events={timelineEvents}
            newCount={12}
            onViewAll={handleViewAllTimeline}
          />
        </div>
      </div>
    </MainLayout>
  );
}
