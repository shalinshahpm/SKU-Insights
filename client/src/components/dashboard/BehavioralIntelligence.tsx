import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, AlertTriangle, Calendar, TrendingUp, TrendingDown, BarChart } from "lucide-react";
import { BehavioralMetricsData, BehavioralMetricsResponse, BehavioralTableData } from "@/lib/types";
import { BehavioralChart } from "./BehavioralChart";
import { format } from "date-fns";

interface BehavioralIntelligenceProps {
  behavioralData: BehavioralMetricsData[];
  behavioralSummary?: BehavioralMetricsResponse['summary'];
  onViewAllMetrics: () => void;
  onInvestigate: (metric: string) => void;
}

export function BehavioralIntelligence({
  behavioralData,
  behavioralSummary,
  onViewAllMetrics,
  onInvestigate,
}: BehavioralIntelligenceProps) {
  const [anomalyCount] = useState(() => {
    return behavioralSummary?.totals?.anomalyCount || 
      behavioralData.filter(metric => metric.status === "anomaly").length;
  });

  // Create table data from the most recent metrics
  const latestMetrics = behavioralData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 1)[0];

  const previousDayMetrics = behavioralData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(1, 2)[0];

  // Calculate daily changes
  const tableData: BehavioralTableData[] = [];
  
  // Use executive insights if available, otherwise calculate from raw data
  if (behavioralSummary?.executiveInsights?.dailyChange && latestMetrics) {
    const { dailyChange } = behavioralSummary.executiveInsights;
    
    // Page Views with executive insights
    tableData.push({
      metric: "Page Views",
      current: latestMetrics.pageViews.toLocaleString(),
      dailyChange: dailyChange.pageViews?.percentage || 0,
      status: latestMetrics.status
    });

    // Add to Cart with executive insights
    tableData.push({
      metric: "Add-to-Cart",
      current: latestMetrics.addToCart.toLocaleString(),
      dailyChange: dailyChange.addToCart?.percentage || 0, 
      status: latestMetrics.status === "anomaly" ? "anomaly" : "normal"
    });

    // Add Conversion Rate as an executive metric
    if (dailyChange.conversionRate) {
      tableData.push({
        metric: "Conversion Rate",
        current: `${dailyChange.conversionRate.current.toFixed(1)}%`,
        dailyChange: dailyChange.conversionRate.change,
        status: Math.abs(dailyChange.conversionRate.change) > 5 ? "watch" : "normal"
      });
    }

    // Review Volume with executive insights
    tableData.push({
      metric: "Review Volume",
      current: latestMetrics.reviewVolume.toLocaleString(),
      dailyChange: dailyChange.reviewVolume?.percentage || 0,
      status: "normal"
    });

    // Average Rating with executive insights
    tableData.push({
      metric: "Average Rating",
      current: `${latestMetrics.averageRating.toFixed(1)} / 5`,
      dailyChange: dailyChange.rating?.percentage || 0,
      status: Math.abs(dailyChange.rating?.value || 0) >= 0.3 ? "watch" : "normal"
    });
  } else if (latestMetrics && previousDayMetrics) {
    // Fallback to manual calculation if executive insights aren't available
    
    // Page Views
    const pageViewsChange = ((latestMetrics.pageViews - previousDayMetrics.pageViews) / previousDayMetrics.pageViews) * 100;
    tableData.push({
      metric: "Page Views",
      current: latestMetrics.pageViews.toLocaleString(),
      dailyChange: pageViewsChange,
      status: latestMetrics.status
    });

    // Add to Cart
    const addToCartChange = ((latestMetrics.addToCart - previousDayMetrics.addToCart) / previousDayMetrics.addToCart) * 100;
    tableData.push({
      metric: "Add-to-Cart",
      current: latestMetrics.addToCart.toLocaleString(),
      dailyChange: addToCartChange,
      status: latestMetrics.status === "anomaly" && Math.abs(addToCartChange) > 30 ? "anomaly" : "normal"
    });

    // Calculate conversion rate
    const currentConversion = (latestMetrics.addToCart / latestMetrics.pageViews) * 100;
    const previousConversion = (previousDayMetrics.addToCart / previousDayMetrics.pageViews) * 100;
    const conversionChange = currentConversion - previousConversion;
    
    tableData.push({
      metric: "Conversion Rate",
      current: `${currentConversion.toFixed(1)}%`,
      dailyChange: (conversionChange / previousConversion) * 100,
      status: Math.abs(conversionChange) > 1 ? "watch" : "normal"
    });

    // Review Volume
    const reviewVolumeChange = ((latestMetrics.reviewVolume - previousDayMetrics.reviewVolume) / previousDayMetrics.reviewVolume) * 100;
    tableData.push({
      metric: "Review Volume",
      current: latestMetrics.reviewVolume.toLocaleString(),
      dailyChange: reviewVolumeChange,
      status: "normal"
    });

    // Average Rating
    const ratingChange = latestMetrics.averageRating - previousDayMetrics.averageRating;
    const ratingPercentChange = (ratingChange / previousDayMetrics.averageRating) * 100;
    tableData.push({
      metric: "Average Rating",
      current: `${latestMetrics.averageRating.toFixed(1)} / 5`,
      dailyChange: ratingPercentChange,
      status: Math.abs(ratingChange) >= 0.3 ? "watch" : "normal"
    });
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Real-Time Behavioral Intelligence</CardTitle>
          <div className="flex items-center space-x-2">
            {anomalyCount > 0 && (
              <Badge variant="outline" className="bg-warning bg-opacity-10 text-warning border-warning">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {anomalyCount} {anomalyCount === 1 ? 'Anomaly' : 'Anomalies'}
              </Badge>
            )}
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Monitoring key behavioral metrics across platforms
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <BehavioralChart data={behavioralData} />
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Daily Change</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell className="text-right font-mono">{row.current}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${row.dailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {row.dailyChange >= 0 ? '+' : ''}{row.dailyChange.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                      row.status === "normal" 
                        ? "outline" 
                        : row.status === "anomaly" 
                          ? "destructive" 
                          : "secondary"
                    }
                    className={
                      row.status === "normal" 
                        ? "bg-muted/50" 
                        : row.status === "anomaly" 
                          ? "bg-destructive/10 text-destructive border-destructive" 
                          : "bg-warning/10 text-warning border-warning"
                    }>
                      {row.status === "normal" ? "Normal" : row.status === "anomaly" ? "Anomaly" : "Watch"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="link" 
                      onClick={() => row.status === "anomaly" 
                        ? onInvestigate(row.metric) 
                        : onViewAllMetrics()
                      }
                      className={row.status === "anomaly" ? "text-accent" : "text-primary"}
                    >
                      {row.status === "anomaly" ? "Investigate" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/10 py-3 border-t justify-end">
        <Button 
          variant="default" 
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={onViewAllMetrics}
        >
          View All Metrics
        </Button>
      </CardFooter>
    </Card>
  );
}
