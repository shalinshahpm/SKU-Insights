import { useState } from "react";
import { CollapsibleSidebar } from "@/components/layout/CollapsibleSidebar";
import { useQuery } from "@tanstack/react-query";
import { SKU, BehavioralMetricsData, BrandHealthMetricsData, FilterOptions } from "@/lib/types";
import { SKUFilter } from "@/components/dashboard/SKUFilter";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { format } from "date-fns";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

// Sample brand health metrics data since we don't have a real API
const brandHealthData = [
  {
    date: "2023-08-01",
    regions: {
      "UK": { brandLiftScore: 75.2, purchaseIntent: 62.5, netSentiment: 38 },
      "India": { brandLiftScore: 70.1, purchaseIntent: 59.3, netSentiment: 32 },
      "Brazil": { brandLiftScore: 68.7, purchaseIntent: 57.8, netSentiment: 30 },
      "US": { brandLiftScore: 72.5, purchaseIntent: 61.1, netSentiment: 36 }
    }
  },
  {
    date: "2023-09-01",
    regions: {
      "UK": { brandLiftScore: 76.1, purchaseIntent: 63.0, netSentiment: 39 },
      "India": { brandLiftScore: 71.3, purchaseIntent: 60.1, netSentiment: 33 },
      "Brazil": { brandLiftScore: 69.2, purchaseIntent: 58.5, netSentiment: 31 },
      "US": { brandLiftScore: 73.8, purchaseIntent: 62.3, netSentiment: 38 }
    }
  },
  {
    date: "2023-10-01",
    regions: {
      "UK": { brandLiftScore: 77.2, purchaseIntent: 63.7, netSentiment: 40 },
      "India": { brandLiftScore: 72.5, purchaseIntent: 61.2, netSentiment: 34 },
      "Brazil": { brandLiftScore: 70.1, purchaseIntent: 59.3, netSentiment: 32 },
      "US": { brandLiftScore: 75.0, purchaseIntent: 63.0, netSentiment: 39 }
    }
  },
  {
    date: "2023-11-01",
    regions: {
      "UK": { brandLiftScore: 78.0, purchaseIntent: 64.5, netSentiment: 42 },
      "India": { brandLiftScore: 73.8, purchaseIntent: 62.0, netSentiment: 35 },
      "Brazil": { brandLiftScore: 71.2, purchaseIntent: 60.0, netSentiment: 33 },
      "US": { brandLiftScore: 76.3, purchaseIntent: 63.8, netSentiment: 40 }
    }
  }
];

// Sample brand attributes data
const brandAttributesData = [
  { attribute: "Quality", UK: 85, India: 80, Brazil: 75, US: 82 },
  { attribute: "Value", UK: 70, India: 75, Brazil: 80, US: 68 },
  { attribute: "Innovation", UK: 80, India: 72, Brazil: 68, US: 78 },
  { attribute: "Sustainability", UK: 75, India: 65, Brazil: 60, US: 72 },
  { attribute: "Trust", UK: 82, India: 78, Brazil: 75, US: 80 },
];

export default function BrandHealth() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    selectedSku: "all",
    selectedMarket: "all",
    selectedRegion: "all",
  });
  const [timeRange, setTimeRange] = useState("quarter");
  const [compareRegion, setCompareRegion] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({
    queryKey: ["/api/skus"],
  });

  // Fetch behavioral metrics for correlation
  const { data: behavioralMetrics = [] } = useQuery<BehavioralMetricsData[]>({
    queryKey: [
      "/api/behavioral-metrics",
      filters.selectedSku !== "all" ? `?skuId=${filters.selectedSku}` : "",
    ],
  });

  // Create filter options
  const filterOptions: FilterOptions = {
    skus: skus.map((sku) => ({
      value: sku.id.toString(),
      label: `${sku.name} (${sku.region})`,
    })),
    markets: [...new Set(skus.map((sku) => sku.market))].map((market) => ({
      value: market,
      label: market,
    })),
    regions: [...new Set(skus.map((sku) => sku.region))].map((region) => ({
      value: region,
      label: region,
    })),
  };

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
      description: "Your brand health report is being prepared for download.",
    });
  };

  const handleCompareRegion = (region: string) => {
    setCompareRegion(region === compareRegion ? null : region);
  };

  // Format data for charts
  const formatBrandHealthData = () => {
    return brandHealthData.map((item) => ({
      date: format(new Date(item.date), "MMM yyyy"),
      ...Object.entries(item.regions).reduce((acc, [region, metrics]) => {
        if (filters.selectedRegion === "all" || filters.selectedRegion === region) {
          return {
            ...acc,
            [`${region}_brandLift`]: metrics.brandLiftScore,
            [`${region}_purchaseIntent`]: metrics.purchaseIntent,
            [`${region}_netSentiment`]: metrics.netSentiment,
          };
        }
        return acc;
      }, {}),
    }));
  };

  const brandHealthChartData = formatBrandHealthData();

  // Get the latest metrics for each region
  const getLatestMetrics = () => {
    const latest = brandHealthData[brandHealthData.length - 1];
    return Object.entries(latest.regions)
      .filter(([region]) => filters.selectedRegion === "all" || filters.selectedRegion === region)
      .map(([region, metrics]) => ({
        region,
        ...metrics,
      }));
  };

  const latestMetrics = getLatestMetrics();

  // Calculate trend percentages
  const getTrendPercentage = (metric: string, region: string) => {
    if (brandHealthData.length < 2) return 0;
    
    const latest = brandHealthData[brandHealthData.length - 1];
    const previous = brandHealthData[brandHealthData.length - 2];
    
    if (!latest.regions[region] || !previous.regions[region]) return 0;
    
    const latestValue = latest.regions[region][metric as keyof typeof latest.regions[region]];
    const previousValue = previous.regions[region][metric as keyof typeof previous.regions[region]];
    
    if (typeof latestValue === 'number' && typeof previousValue === 'number') {
      return ((latestValue - previousValue) / previousValue) * 100;
    }
    
    return 0;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <CollapsibleSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6 max-w-7xl">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl lg:text-2xl font-bold">Brand Health Dashboard</h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Monitor brand performance metrics and consumer sentiment
              </p>
            </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex-1">
          {/* Title and description already in MainLayout */}
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="quarter">Last quarter</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleExportReport}
            className="flex items-center gap-2"
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

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {latestMetrics.map((metric) => (
          <Card key={metric.region}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{metric.region}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Brand Lift</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">{metric.brandLiftScore.toFixed(1)}</p>
                    <div className="ml-2">
                      {getTrendPercentage("brandLiftScore", metric.region) > 0 ? (
                        <div className="flex items-center text-success">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {getTrendPercentage("brandLiftScore", metric.region).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-destructive">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {Math.abs(getTrendPercentage("brandLiftScore", metric.region)).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Intent</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">{metric.purchaseIntent.toFixed(1)}%</p>
                    <div className="ml-2">
                      {getTrendPercentage("purchaseIntent", metric.region) > 0 ? (
                        <div className="flex items-center text-success">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {getTrendPercentage("purchaseIntent", metric.region).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-destructive">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {Math.abs(getTrendPercentage("purchaseIntent", metric.region)).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Sentiment</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">+{metric.netSentiment}</p>
                    <div className="ml-2">
                      {getTrendPercentage("netSentiment", metric.region) > 0 ? (
                        <div className="flex items-center text-success">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {getTrendPercentage("netSentiment", metric.region).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-destructive">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {Math.abs(getTrendPercentage("netSentiment", metric.region)).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Brand Health Trends */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Health Trends</CardTitle>
            <CardDescription>
              Track key brand health metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="brandLift">
              <TabsList className="mb-4">
                <TabsTrigger value="brandLift">Brand Lift Score</TabsTrigger>
                <TabsTrigger value="purchaseIntent">Purchase Intent</TabsTrigger>
                <TabsTrigger value="netSentiment">Net Sentiment</TabsTrigger>
              </TabsList>

              <TabsContent value="brandLift">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={brandHealthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#e2e8f0" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        domain={[50, 100]}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#e2e8f0" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      {Object.keys(brandHealthChartData[0] || {})
                        .filter((key) => key.includes("_brandLift"))
                        .map((key, index) => {
                          const region = key.split("_")[0];
                          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                          return (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={`${region} Brand Lift`}
                              stroke={colors[index % colors.length]}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          );
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="purchaseIntent">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={brandHealthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#e2e8f0" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        domain={[40, 80]}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#e2e8f0" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      {Object.keys(brandHealthChartData[0] || {})
                        .filter((key) => key.includes("_purchaseIntent"))
                        .map((key, index) => {
                          const region = key.split("_")[0];
                          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                          return (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={`${region} Purchase Intent`}
                              stroke={colors[index % colors.length]}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          );
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="netSentiment">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={brandHealthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#e2e8f0" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        domain={[20, 50]}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#e2e8f0" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      {Object.keys(brandHealthChartData[0] || {})
                        .filter((key) => key.includes("_netSentiment"))
                        .map((key, index) => {
                          const region = key.split("_")[0];
                          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                          return (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={`${region} Net Sentiment`}
                              stroke={colors[index % colors.length]}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          );
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Brand Attributes and Market Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Attributes</CardTitle>
            <CardDescription>
              Key brand perception attributes across regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={brandAttributesData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="attribute" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  {latestMetrics.map((metric, index) => {
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                    return (
                      <Radar
                        key={metric.region}
                        name={metric.region}
                        dataKey={metric.region}
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
                        fillOpacity={0.2}
                      />
                    );
                  })}
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Market Comparison</CardTitle>
                <CardDescription>
                  Compare brand performance across different markets
                </CardDescription>
              </div>
              <div className="mt-2 sm:mt-0">
                <Select
                  value={compareRegion || ""}
                  onValueChange={handleCompareRegion}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select region to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {latestMetrics.map((metric) => (
                      <SelectItem key={metric.region} value={metric.region}>
                        {metric.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Brand Lift Score",
                      ...latestMetrics.reduce(
                        (acc, metric) => ({
                          ...acc,
                          [metric.region]: metric.brandLiftScore,
                        }),
                        {}
                      ),
                    },
                    {
                      name: "Purchase Intent",
                      ...latestMetrics.reduce(
                        (acc, metric) => ({
                          ...acc,
                          [metric.region]: metric.purchaseIntent,
                        }),
                        {}
                      ),
                    },
                    {
                      name: "Net Sentiment",
                      ...latestMetrics.reduce(
                        (acc, metric) => ({
                          ...acc,
                          [metric.region]: metric.netSentiment,
                        }),
                        {}
                      ),
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "#e2e8f0" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "#e2e8f0" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  {latestMetrics.map((metric, index) => {
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                    const isHighlighted = compareRegion === metric.region;
                    return (
                      <Bar
                        key={metric.region}
                        dataKey={metric.region}
                        name={metric.region}
                        fill={colors[index % colors.length]}
                        opacity={compareRegion ? (isHighlighted ? 1 : 0.4) : 1}
                        strokeWidth={isHighlighted ? 2 : 0}
                        stroke={isHighlighted ? colors[index % colors.length] : undefined}
                      />
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}
