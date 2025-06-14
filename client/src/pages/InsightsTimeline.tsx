import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { TimelineEvent, SKU } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  FileText,
  Activity,
  ShoppingBag,
  LineChart,
  Filter,
  Download,
  FileDown,
  Calendar,
  AtSign,
  AlertTriangle,
  Bell,
  Tag,
  Megaphone,
  BarChart,
  Users,
  Clock,
  ExternalLink,
  ChevronDown,
  Eye,
  Layers,
  MonitorCheck,
  PieChart
} from "lucide-react";
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

export default function InsightsTimeline() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
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

  // Updated functions for enhanced timeline
  const getCategoryColor = (type: string) => {
    switch (type) {
      case "sku_added":
        return "border-blue-400 dark:border-blue-600";
      case "anomaly_detected":
        return "border-red-400 dark:border-red-600";
      case "survey_launched":
        return "border-emerald-400 dark:border-emerald-600";
      case "survey_completed":
        return "border-teal-400 dark:border-teal-600";
      case "report_generated":
        return "border-purple-400 dark:border-purple-600";
      default:
        return "border-gray-300 dark:border-gray-700";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "sku_added":
        return <ShoppingBag className="h-4 w-4" />;
      case "anomaly_detected":
        return <AlertTriangle className="h-4 w-4" />;
      case "survey_launched":
        return <FileText className="h-4 w-4" />;
      case "survey_completed":
        return <Users className="h-4 w-4" />;
      case "report_generated":
        return <BarChart className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case "sku_added":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100">Launch Action</Badge>;
      case "anomaly_detected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100">Performance Alert</Badge>;
      case "survey_launched":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 hover:bg-emerald-100">Survey Deployment</Badge>;
      case "survey_completed":
        return <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 hover:bg-teal-100">Market Feedback</Badge>;
      case "report_generated":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-100">Insights Drop</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  // Grouping events by date
  const getDateLabel = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isThisWeek(date)) {
      return "This Week";
    } else if (isThisMonth(date)) {
      return "This Month";
    } else {
      return format(date, "MMMM yyyy");
    }
  };

  // Group events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const date = new Date(event.timestamp);
    const dateLabel = getDateLabel(date);
    
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    
    acc[dateLabel].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  // Sort dates in reverse chronological order
  const sortedDateLabels = Object.keys(eventsByDate).sort((a, b) => {
    // Put "Today" and "Yesterday" at the top
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Yesterday") return -1;
    if (b === "Yesterday") return 1;
    
    // Put "This Week" next
    if (a === "This Week") return -1;
    if (b === "This Week") return 1;
    
    // Put "This Month" next
    if (a === "This Month") return -1;
    if (b === "This Month") return 1;
    
    // For other months, sort chronologically
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const mockStakeholders = [
    { id: 1, name: "Rohan Mehta", role: "Brand Manager", initials: "RM" },
    { id: 2, name: "Sarah Williams", role: "Regional Lead", initials: "SW" },
    { id: 3, name: "David Chen", role: "Marketing Executive", initials: "DC" },
    { id: 4, name: "Priya Sharma", role: "Insights Analyst", initials: "PS" },
  ];

  const getEventStakeholders = (event: TimelineEvent) => {
    // For demonstration, assign different stakeholders by event type
    if (event.type === "survey_launched" || event.type === "survey_completed") {
      return [mockStakeholders[0], mockStakeholders[3]];
    } else if (event.type === "anomaly_detected") {
      return [mockStakeholders[0], mockStakeholders[1]];
    } else if (event.type === "report_generated") {
      return [mockStakeholders[2], mockStakeholders[3]];
    }
    return [mockStakeholders[0]];
  };

  const getTimelineRoadmap = () => {
    // Sample upcoming milestones
    return [
      { date: "Apr 30, 2025", title: "KitKat Ruby global campaign launch", type: "media" },
      { date: "May 5, 2025", title: "Q2 Performance Review", type: "meeting" },
      { date: "May 15, 2025", title: "Sentiment analysis model update", type: "system" },
      { date: "Jun 1, 2025", title: "Competitor monitor integration", type: "system" },
    ];
  };

  return (
    <MainLayout
      pageTitle="Insights Timeline"
      pageDescription="Your operational GTM asset for tracking SKU performance and activities"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
            <Tabs defaultValue="timeline" className="w-full">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <TabsList className="grid grid-cols-3 w-auto">
                  <TabsTrigger value="timeline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Timeline</span>
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="gap-2">
                    <Megaphone className="h-4 w-4" />
                    <span className="hidden sm:inline">Campaigns</span>
                  </TabsTrigger>
                  <TabsTrigger value="roadmap" className="gap-2">
                    <Layers className="h-4 w-4" />
                    <span className="hidden sm:inline">Coming Up</span>
                  </TabsTrigger>
                </TabsList>
                <Button onClick={handleExport} size="sm" variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>

              <TabsContent value="timeline" className="pt-0 px-0 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-muted/10 border-b">
                  <Select value={selectedSKU} onValueChange={setSelectedSKU}>
                    <SelectTrigger className="w-full sm:w-[180px]">
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
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="sku_added">Launch Actions</SelectItem>
                      <SelectItem value="anomaly_detected">Performance Alerts</SelectItem>
                      <SelectItem value="survey_launched">Survey Deployments</SelectItem>
                      <SelectItem value="survey_completed">Market Feedback</SelectItem>
                      <SelectItem value="report_generated">Insights Drops</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
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
                    {sortedDateLabels.map((dateLabel) => (
                      <div key={dateLabel} className="mb-6">
                        <div className="px-6 pt-6 pb-2">
                          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {dateLabel}
                          </h3>
                        </div>
                        <ul className="px-6">
                          {eventsByDate[dateLabel].map((event, index) => {
                            const relatedSku = event.skuId
                              ? skus.find((sku) => sku.id === event.skuId)
                              : null;
                            
                            const stakeholders = getEventStakeholders(event);
                            const hasCriticalFlag = event.type === "anomaly_detected";
                            const hasDelay = event.data?.details?.includes("delay");

                            return (
                              <li key={event.id}>
                                <div className="relative pb-8">
                                  {index !== eventsByDate[dateLabel].length - 1 && (
                                    <span
                                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-muted"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <div className="relative flex items-start space-x-3">
                                    <div className="relative">
                                      <div
                                        className={`h-10 w-10 rounded-full ${getEventIconBackground(event.type)} flex items-center justify-center ring-8 ring-white dark:ring-gray-800 border-l-4 ${getCategoryColor(event.type)}`}
                                      >
                                        {getEventIcon(event.type)}
                                      </div>
                                      {hasCriticalFlag && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5">
                                      <div>
                                        <div className="flex items-center flex-wrap gap-2">
                                          <p className="font-medium text-foreground">{event.title}</p>
                                          {getCategoryBadge(event.type)}
                                          {hasDelay && (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                              <Clock className="h-3 w-3 mr-1" />
                                              Delayed
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                          {event.description}
                                          {relatedSku && (
                                            <Badge variant="outline" className="ml-2 text-xs">
                                              {relatedSku.name}
                                              <span className="text-muted-foreground ml-1">{relatedSku.region}</span>
                                            </Badge>
                                          )}
                                        </p>
                                      </div>
                                      
                                      {event.data?.details && (
                                        <div className="mt-2 text-sm">
                                          <p>{event.data.details}</p>
                                        </div>
                                      )}
                                      
                                      <div className="mt-2 flex items-center flex-wrap gap-2">
                                        <div className="flex -space-x-2 mr-2">
                                          {stakeholders.map((stakeholder) => (
                                            <TooltipProvider key={stakeholder.id}>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Avatar className="h-6 w-6 border-2 border-background">
                                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                      {stakeholder.initials}
                                                    </AvatarFallback>
                                                  </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>{stakeholder.name}</p>
                                                  <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          ))}
                                          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                                            <AtSign className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        
                                        {event.data?.reportUrl && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => handleViewReport(event)}
                                          >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View Report
                                          </Button>
                                        )}
                                        
                                        {event.type === "anomaly_detected" && (
                                          <>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-7 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                              onClick={() => handleInvestigate(event)}
                                            >
                                              <Activity className="h-3 w-3 mr-1" />
                                              Investigate
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-7 text-xs"
                                              onClick={() => navigate("/survey-builder")}
                                            >
                                              <FileText className="h-3 w-3 mr-1" />
                                              Launch Survey
                                            </Button>
                                          </>
                                        )}
                                        
                                        {event.type === "survey_completed" && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                            onClick={() => navigate("/behavioral")}
                                          >
                                            <BarChart className="h-3 w-3 mr-1" />
                                            Analyze Results
                                          </Button>
                                        )}
                                        
                                        {event.type === "sku_added" && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                            onClick={() => navigate("/brand-health")}
                                          >
                                            <MonitorCheck className="h-3 w-3 mr-1" />
                                            Monitor Performance
                                          </Button>
                                        )}
                                        
                                        {event.type === "report_generated" && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-xs bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                                            onClick={() => navigate("/insights-timeline")}
                                          >
                                            <PieChart className="h-3 w-3 mr-1" />
                                            View Insights
                                          </Button>
                                        )}
                                      </div>
                                      
                                      <div className="mt-2 text-xs text-muted-foreground flex items-center">
                                        <Clock className="h-3 w-3 mr-1 inline" />
                                        {format(
                                          new Date(event.timestamp),
                                          "MMMM d, yyyy 'at' h:mm a"
                                        )}{" "}
                                        <span className="ml-1 text-muted-foreground/70">({getTimeAgo(event.timestamp)} ago)</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="campaigns" className="p-4">
                <div className="text-center py-8">
                  <Megaphone className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Campaign Attribution</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                    Connect your media calendar to automatically tag SKU behavior spikes to marketing campaigns.
                  </p>
                  <Button className="mt-4" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Media Calendar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="roadmap" className="p-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Upcoming Milestones
                  </h3>
                  
                  <ul className="space-y-3">
                    {getTimelineRoadmap().map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 border rounded-md bg-muted/5">
                        <div className="bg-blue-50 text-blue-700 rounded-md p-2">
                          {item.type === "media" ? (
                            <Megaphone className="h-5 w-5" />
                          ) : item.type === "meeting" ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            <MonitorCheck className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.date}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Timeline Categories
              </CardTitle>
              <CardDescription>
                Color-coded event classifications
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-0">
              <ul className="space-y-3 pb-4">
                <li className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm">Launch Actions</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">4</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-red-400 rounded-full mr-2"></div>
                    <span className="text-sm">Performance Alerts</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">2</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-emerald-400 rounded-full mr-2"></div>
                    <span className="text-sm">Survey Deployments</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">3</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-teal-400 rounded-full mr-2"></div>
                    <span className="text-sm">Market Feedback</span>
                  </div>
                  <Badge className="bg-teal-100 text-teal-800">5</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-purple-400 rounded-full mr-2"></div>
                    <span className="text-sm">Insights Drops</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">2</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Insights Stats
              </CardTitle>
              <CardDescription>
                Current timeline metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-4 py-3 border-b">
                <div className="text-sm font-medium">Total Events</div>
                <div className="text-2xl font-bold mt-1">{filteredEvents.length}</div>
              </div>
              <div className="px-4 py-3 border-b">
                <div className="text-sm font-medium">Anomalies Detected</div>
                <div className="text-2xl font-bold mt-1">
                  {filteredEvents.filter(e => e.type === "anomaly_detected").length}
                </div>
              </div>
              <div className="px-4 py-3 border-b">
                <div className="text-sm font-medium">Active SKUs</div>
                <div className="text-2xl font-bold mt-1">
                  {new Set(filteredEvents.map(e => e.skuId).filter(Boolean)).size}
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="text-sm font-medium">Time Period</div>
                <div className="font-medium text-muted-foreground mt-1">
                  {timeRange === "7days" ? "Last 7 days" : 
                   timeRange === "30days" ? "Last 30 days" : 
                   timeRange === "90days" ? "Last 90 days" : "All time"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
