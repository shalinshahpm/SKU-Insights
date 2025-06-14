import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkflowHeader } from "@/components/workflow/WorkflowHeader";
import { CollapsibleSidebar } from "@/components/layout/CollapsibleSidebar";
import { SKU } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Target,
  Zap,
  Brain,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function PostLaunchOptimization() {
  const [selectedSku, setSelectedSku] = useState("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ["/api/skus"] 
  });

  // Smart Triggers Configuration
  const smartTriggers = [
    {
      id: 1,
      name: "Cart Abandonment Alert",
      metric: "Cart Abandonment Rate",
      threshold: "15%",
      currentValue: "18.2%",
      status: "triggered",
      lastTriggered: "2 hours ago",
      action: "Launch Exit-Intent Survey"
    },
    {
      id: 2,
      name: "Low Purchase Intent",
      metric: "Purchase Intent Score",
      threshold: "< 65",
      currentValue: "62",
      status: "triggered",
      lastTriggered: "4 hours ago",
      action: "Send Price Sensitivity Survey"
    },
    {
      id: 3,
      name: "Negative Sentiment Spike",
      metric: "Net Sentiment",
      threshold: "< -10%",
      currentValue: "-8%",
      status: "warning",
      lastTriggered: "Never",
      action: "Launch Product Feedback Survey"
    },
    {
      id: 4,
      name: "Conversion Drop",
      metric: "Conversion Rate",
      threshold: "< 2.5%",
      currentValue: "3.1%",
      status: "normal",
      lastTriggered: "3 days ago",
      action: "Review Product Positioning"
    }
  ];

  // Automated Survey Responses
  const automatedSurveys = [
    {
      id: 1,
      name: "Exit-Intent Survey",
      trigger: "Cart Abandonment > 15%",
      responses: 127,
      completionRate: "68%",
      status: "active",
      launched: "2 hours ago",
      insights: "Price concerns (45%), Product confusion (32%)"
    },
    {
      id: 2,
      name: "Price Sensitivity Study",
      trigger: "Purchase Intent < 65",
      responses: 89,
      completionRate: "74%",
      status: "active",
      launched: "4 hours ago",
      insights: "Optimal price point: $12-14 range"
    },
    {
      id: 3,
      name: "Product Usage Feedback",
      trigger: "Manual Launch",
      responses: 203,
      completionRate: "82%",
      status: "completed",
      launched: "1 day ago",
      insights: "Packaging issues (23%), Taste satisfaction (91%)"
    }
  ];

  // Sentiment Analysis Results
  const sentimentBreakdown = [
    { category: "Product Quality", positive: 78, negative: 22, total: 245, keywords: ["fresh", "delicious", "premium"] },
    { category: "Pricing", positive: 62, negative: 38, total: 189, keywords: ["expensive", "value", "worth it"] },
    { category: "Packaging", positive: 85, negative: 15, total: 167, keywords: ["convenient", "attractive", "eco-friendly"] },
    { category: "Availability", positive: 71, negative: 29, total: 134, keywords: ["in stock", "hard to find", "delivery"] }
  ];

  const sentimentOverview = [
    { name: "Positive", value: 68, color: "#22c55e" },
    { name: "Neutral", value: 24, color: "#94a3b8" },
    { name: "Negative", value: 8, color: "#ef4444" }
  ];

  // Product Adjustments Log
  const productAdjustments = [
    {
      id: 1,
      date: "2024-06-12",
      trigger: "Cart Abandonment > 15%",
      adjustment: "Reduced price by 8% to $13.99",
      outcome: "Cart abandonment decreased to 12.3%",
      status: "implemented",
      impact: "positive"
    },
    {
      id: 2,
      date: "2024-06-10",
      trigger: "Negative packaging feedback",
      adjustment: "Updated product description to highlight eco-friendly packaging",
      outcome: "Packaging sentiment improved by 15%",
      status: "implemented",
      impact: "positive"
    },
    {
      id: 3,
      date: "2024-06-08",
      trigger: "Low purchase intent score",
      adjustment: "Added 'limited time offer' messaging",
      outcome: "Purchase intent increased from 62 to 71",
      status: "implemented",
      impact: "positive"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "triggered":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "triggered" ? "destructive" : status === "warning" ? "secondary" : "default";
    return <Badge variant={variant}>{status}</Badge>;
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
        <WorkflowHeader 
          currentPhase="post-launch"
          completedSteps={3}
          totalSteps={5}
          skuName="KitKat Original"
        />

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6 max-w-7xl">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">Trigger Feedback & Optimization</h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Collect targeted feedback and take rapid actions based on live data
                </p>
              </div>
              
              <Select value={selectedSku} onValueChange={setSelectedSku}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Select SKU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SKUs</SelectItem>
                  {skus.map((sku) => (
                    <SelectItem key={sku.id} value={sku.id.toString()}>
                      {sku.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Active Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">currently triggered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-500" />
                Survey Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">419</div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-purple-500" />
                Sentiment Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">positive sentiment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Impact Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+18%</div>
              <p className="text-xs text-muted-foreground">revenue improvement</p>
            </CardContent>
          </Card>
        </div>

            <Tabs defaultValue="triggers" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1">
                <TabsTrigger value="triggers" className="text-xs lg:text-sm">Smart Triggers</TabsTrigger>
                <TabsTrigger value="surveys" className="text-xs lg:text-sm">Follow-up Surveys</TabsTrigger>
                <TabsTrigger value="sentiment" className="text-xs lg:text-sm">Sentiment Analysis</TabsTrigger>
                <TabsTrigger value="adjustments" className="text-xs lg:text-sm">Product Adjustments</TabsTrigger>
              </TabsList>
          
          <TabsContent value="triggers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Smart Triggers Configuration</CardTitle>
                <CardDescription>
                  Automated triggers that launch surveys when performance signals dip
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartTriggers.map((trigger) => (
                    <div key={trigger.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(trigger.status)}
                        <div>
                          <h4 className="font-medium">{trigger.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {trigger.metric}: {trigger.threshold} (Current: {trigger.currentValue})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(trigger.status)}
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          {trigger.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="surveys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Automated Survey Responses</CardTitle>
                <CardDescription>
                  Follow-up surveys launched automatically based on trigger conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automatedSurveys.map((survey) => (
                    <div key={survey.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{survey.name}</h4>
                        <Badge variant={survey.status === "active" ? "default" : "secondary"}>
                          {survey.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Triggered by: {survey.trigger} • Launched: {survey.launched}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Responses:</span> {survey.responses}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Completion Rate:</span> {survey.completionRate}
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-muted/30 rounded">
                        <span className="text-sm font-medium">Key Insights: </span>
                        <span className="text-sm">{survey.insights}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Sentiment</CardTitle>
                  <CardDescription>Customer sentiment breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sentimentOverview}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {sentimentOverview.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {sentimentOverview.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Keyword Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Keyword & Intent Analysis</CardTitle>
                  <CardDescription>Top keywords by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sentimentBreakdown.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.positive}% positive
                          </span>
                        </div>
                        {item.keywords && (
                          <div className="flex flex-wrap gap-1">
                            {item.keywords.map((keyword) => (
                              <Badge key={keyword} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="adjustments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Adjustments Log</CardTitle>
                <CardDescription>
                  Review actions taken and their outcomes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productAdjustments.map((adjustment) => (
                    <div key={adjustment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-muted-foreground">{adjustment.date}</span>
                            <Badge variant="outline">{adjustment.status}</Badge>
                          </div>
                          <h4 className="font-medium mb-1">Trigger: {adjustment.trigger}</h4>
                          <p className="text-sm mb-2">{adjustment.adjustment}</p>
                          <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                            <strong>Outcome:</strong> {adjustment.outcome}
                          </p>
                        </div>
                        <div className="ml-4">
                          {adjustment.impact === "positive" ? (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}