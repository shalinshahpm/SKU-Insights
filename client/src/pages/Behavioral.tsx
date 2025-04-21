import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { SKU, BehavioralMetricsData, FilterOptions } from "@/lib/types";
import { SKUFilter } from "@/components/dashboard/SKUFilter";
import { BehavioralChart } from "@/components/dashboard/BehavioralChart";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function Behavioral() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    selectedSku: "all",
    selectedMarket: "all",
    selectedRegion: "all",
  });
  const [timeRange, setTimeRange] = useState("7days");

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({
    queryKey: ["/api/skus"],
  });

  // Fetch behavioral metrics for the selected SKU or all SKUs
  const { data: behavioralMetrics = [], isLoading } = useQuery<BehavioralMetricsData[]>({
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

  const handleInvestigate = (metricId: number) => {
    toast({
      title: "Investigation Initiated",
      description: `Detailed analysis of metric ID ${metricId} would be shown here.`,
    });
  };

  const handleDetectAnomalies = async () => {
    try {
      toast({
        title: "Anomaly Detection",
        description: "Detecting anomalies in the behavioral data...",
      });
      
      // This would call the anomaly detection API
      await fetch("/api/detect-anomalies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threshold: 30.0 }),
      });
      
      // Refresh the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Anomaly Detection Complete",
        description: "All metrics have been analyzed for anomalies.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to detect anomalies. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Sort metrics by date
  const sortedMetrics = [...behavioralMetrics].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals
  const totalPageViews = sortedMetrics.reduce((sum, metric) => sum + metric.pageViews, 0);
  const totalAddToCart = sortedMetrics.reduce((sum, metric) => sum + metric.addToCart, 0);
  const totalReviewVolume = sortedMetrics.reduce((sum, metric) => sum + metric.reviewVolume, 0);
  const averageRating = sortedMetrics.length 
    ? sortedMetrics.reduce((sum, metric) => sum + metric.averageRating, 0) / sortedMetrics.length 
    : 0;

  // Calculate daily changes for a metric
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <MainLayout
      pageTitle="Behavioral Intelligence"
      pageDescription="Monitor product performance and detect anomalies in real-time"
    >
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
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last quarter</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleDetectAnomalies}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Detect Anomalies
          </Button>
        </div>
      </div>

      <SKUFilter 
        filterOptions={filterOptions} 
        onApplyFilters={handleApplyFilters} 
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Page Views</p>
              <p className="text-3xl font-bold">{totalPageViews.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Add to Cart</p>
              <p className="text-3xl font-bold">{totalAddToCart.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-3xl font-bold">{totalReviewVolume.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavioral Chart */}
      <div className="mb-6">
        <BehavioralChart data={behavioralMetrics} height={400} />
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>
            Detailed view of all behavioral metrics with daily changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Page Views</TableHead>
                    <TableHead className="text-right">Add to Cart</TableHead>
                    <TableHead className="text-right">Reviews</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMetrics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No behavioral data found for the selected filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedMetrics.map((metric, index) => {
                      const sku = skus.find((s) => s.id === metric.skuId);
                      const prevMetric = sortedMetrics[index + 1];
                      
                      // Calculate changes
                      const pageViewsChange = prevMetric
                        ? calculateChange(metric.pageViews, prevMetric.pageViews)
                        : 0;
                      const addToCartChange = prevMetric
                        ? calculateChange(metric.addToCart, prevMetric.addToCart)
                        : 0;
                      const reviewVolumeChange = prevMetric
                        ? calculateChange(metric.reviewVolume, prevMetric.reviewVolume)
                        : 0;
                      const ratingChange = prevMetric
                        ? calculateChange(metric.averageRating, prevMetric.averageRating)
                        : 0;
                      
                      return (
                        <TableRow key={metric.id}>
                          <TableCell>
                            {format(new Date(metric.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            {sku ? `${sku.name} (${sku.region})` : `SKU ID: ${metric.skuId}`}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-mono">{metric.pageViews.toLocaleString()}</div>
                            {prevMetric && (
                              <div className="text-xs flex items-center justify-end">
                                {pageViewsChange > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                                ) : pageViewsChange < 0 ? (
                                  <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                                ) : null}
                                <span
                                  className={
                                    pageViewsChange > 0
                                      ? "text-success"
                                      : pageViewsChange < 0
                                      ? "text-destructive"
                                      : ""
                                  }
                                >
                                  {pageViewsChange > 0 ? "+" : ""}
                                  {pageViewsChange.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-mono">{metric.addToCart.toLocaleString()}</div>
                            {prevMetric && (
                              <div className="text-xs flex items-center justify-end">
                                {addToCartChange > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                                ) : addToCartChange < 0 ? (
                                  <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                                ) : null}
                                <span
                                  className={
                                    addToCartChange > 0
                                      ? "text-success"
                                      : addToCartChange < 0
                                      ? "text-destructive"
                                      : ""
                                  }
                                >
                                  {addToCartChange > 0 ? "+" : ""}
                                  {addToCartChange.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-mono">{metric.reviewVolume.toLocaleString()}</div>
                            {prevMetric && (
                              <div className="text-xs flex items-center justify-end">
                                {reviewVolumeChange > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                                ) : reviewVolumeChange < 0 ? (
                                  <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                                ) : null}
                                <span
                                  className={
                                    reviewVolumeChange > 0
                                      ? "text-success"
                                      : reviewVolumeChange < 0
                                      ? "text-destructive"
                                      : ""
                                  }
                                >
                                  {reviewVolumeChange > 0 ? "+" : ""}
                                  {reviewVolumeChange.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-mono">{metric.averageRating.toFixed(1)}/5</div>
                            {prevMetric && (
                              <div className="text-xs flex items-center justify-end">
                                {ratingChange > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                                ) : ratingChange < 0 ? (
                                  <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                                ) : null}
                                <span
                                  className={
                                    ratingChange > 0
                                      ? "text-success"
                                      : ratingChange < 0
                                      ? "text-destructive"
                                      : ""
                                  }
                                >
                                  {ratingChange > 0 ? "+" : ""}
                                  {ratingChange.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={
                              metric.status === "normal" 
                                ? "outline" 
                                : metric.status === "anomaly" 
                                  ? "destructive" 
                                  : "secondary"
                            }
                            className={
                              metric.status === "normal" 
                                ? "bg-muted/50" 
                                : metric.status === "anomaly" 
                                  ? "bg-destructive/10 text-destructive border-destructive" 
                                  : "bg-warning/10 text-warning border-warning"
                            }>
                              {metric.status === "normal" ? "Normal" : metric.status === "anomaly" ? "Anomaly" : "Watch"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="link"
                              className={
                                metric.status === "anomaly"
                                  ? "text-accent"
                                  : "text-primary"
                              }
                              onClick={() => handleInvestigate(metric.id)}
                            >
                              {metric.status === "anomaly" ? "Investigate" : "View"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
