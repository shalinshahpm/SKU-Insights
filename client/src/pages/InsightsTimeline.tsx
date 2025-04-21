import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { TimelineEvent, SKU } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Activity,
  ShoppingBag,
  LineChart,
  Filter,
  Download,
  FileDown,
  Calendar,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function InsightsTimeline() {
  const { toast } = useToast();
  const [selectedSKU, setSelectedSKU] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30days");

  // Fetch timeline events
  const { data: events = [], isLoading } = useQuery<TimelineEvent[]>({
    queryKey: [
      "/api/timeline-events",
      selectedSKU !== "all" ? `?skuId=${selectedSKU}` : "",
    ],
  });

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({
    queryKey: ["/api/skus"],
  });

  // Filter events based on selected filters
  const filteredEvents = events.filter((event) => {
    if (filterType !== "all" && event.type !== filterType) {
      return false;
    }
    
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case "survey_completed":
        return <FileText className="h-4 w-4 text-primary" />;
      case "anomaly_detected":
        return <Activity className="h-4 w-4 text-accent" />;
      case "sku_added":
        return <ShoppingBag className="h-4 w-4 text-success" />;
      case "report_generated":
        return <LineChart className="h-4 w-4 text-secondary" />;
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const getEventIconBackground = (type: string) => {
    switch (type) {
      case "survey_completed":
        return "bg-primary/10";
      case "anomaly_detected":
        return "bg-accent/10";
      case "sku_added":
        return "bg-success/10";
      case "report_generated":
        return "bg-secondary/10";
      default:
        return "bg-primary/10";
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case "survey_completed":
        return "Survey Completed";
      case "anomaly_detected":
        return "Anomaly Detected";
      case "sku_added":
        return "SKU Added";
      case "survey_launched":
        return "Survey Launched";
      case "report_generated":
        return "Report Generated";
      default:
        return type.replace("_", " ");
    }
  };

  const getTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: false });
    } catch (error) {
      return "recently";
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your insights timeline is being prepared for download.",
    });
  };

  const handleViewReport = (event: TimelineEvent) => {
    if (event.data?.reportUrl) {
      toast({
        title: "Report Viewer",
        description: `Opening report: ${event.title}`,
      });
    }
  };

  const handleInvestigate = (event: TimelineEvent) => {
    if (event.type === "anomaly_detected") {
      toast({
        title: "Investigation Started",
        description: `Investigating: ${event.description}`,
      });
    }
  };

  return (
    <MainLayout
      pageTitle="Insights Timeline"
      pageDescription="Track events and activities related to your SKUs and campaigns"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select value={selectedSKU} onValueChange={setSelectedSKU}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select SKU" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SKUs</SelectItem>
              {skus.map((sku) => (
                <SelectItem key={sku.id} value={sku.id.toString()}>
                  {sku.name} ({sku.region})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Event Types</SelectItem>
              <SelectItem value="sku_added">SKU Added</SelectItem>
              <SelectItem value="anomaly_detected">Anomaly Detected</SelectItem>
              <SelectItem value="survey_launched">Survey Launched</SelectItem>
              <SelectItem value="survey_completed">Survey Completed</SelectItem>
              <SelectItem value="report_generated">Report Generated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Events Timeline
              </CardTitle>
              <CardDescription>
                Chronological record of all insights and activities
              </CardDescription>
            </div>
            <Badge className="self-start sm:self-auto mt-2 sm:mt-0">
              {filteredEvents.length} events
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Calendar className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm">Try adjusting your filters to see more events</p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="p-6">
                {filteredEvents.map((event, index) => {
                  // Find the related SKU
                  const relatedSku = event.skuId
                    ? skus.find((sku) => sku.id === event.skuId)
                    : null;

                  return (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {index !== filteredEvents.length - 1 && (
                          <span
                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-muted"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div
                              className={`h-10 w-10 rounded-full ${getEventIconBackground(
                                event.type
                              )} flex items-center justify-center ring-8 ring-white dark:ring-gray-800`}
                            >
                              {getEventIcon(event.type)}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{event.title}</p>
                                <Badge
                                  variant="outline"
                                  className="capitalize h-5 text-xs"
                                >
                                  {getEventTypeName(event.type)}
                                </Badge>
                              </div>
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {event.description}
                                {relatedSku && (
                                  <span className="ml-1">
                                    (SKU: {relatedSku.name}, {relatedSku.region})
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="mt-2 text-sm">
                              <p>{event.data?.details}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              {event.data?.reportUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleViewReport(event)}
                                >
                                  <FileDown className="h-3 w-3" />
                                  View Report
                                </Button>
                              )}
                              {event.type === "anomaly_detected" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleInvestigate(event)}
                                >
                                  <Activity className="h-3 w-3" />
                                  Investigate
                                </Button>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {format(
                                new Date(event.timestamp),
                                "MMMM d, yyyy 'at' h:mm a"
                              )}{" "}
                              ({getTimeAgo(event.timestamp)} ago)
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
