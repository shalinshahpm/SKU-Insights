import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkflowHeader } from "@/components/workflow/WorkflowHeader";
import { AutomationEngine } from "@/components/automation/AutomationEngine";
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
  Slack
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function PostLaunchOptimization() {
  const [selectedSku, setSelectedSku] = useState("all");

  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ["/api/skus"] 
  });

  // Mock feedback data
  const feedbackSummary = [
    { category: "Product Quality", positive: 78, negative: 22, total: 245 },
    { category: "Pricing", positive: 62, negative: 38, total: 189 },
    { category: "Packaging", positive: 85, negative: 15, total: 167 },
    { category: "Availability", positive: 71, negative: 29, total: 134 }
  ];

  const sentimentData = [
    { name: "Positive", value: 68, color: "#22c55e" },
    { name: "Neutral", value: 24, color: "#94a3b8" },
    { name: "Negative", value: 8, color: "#ef4444" }
  ];

  const microSurveys = [
    {
      id: 1,
      name: "Cart Abandonment Study",
      audience: "Cart abandoners (last 7 days)",
      responses: 324,
      completion: 78,
      status: "active",
      insights: "Top barrier: Shipping costs (43% mention)"
    },
    {
      id: 2,
      name: "Regional Performance Analysis",
      audience: "Northeast customers",
      responses: 156,
      completion: 67,
      status: "active", 
      insights: "Product awareness gap identified"
    },
    {
      id: 3,
      name: "Price Sensitivity Check",
      audience: "Price-conscious segment",
      responses: 89,
      completion: 45,
      status: "pending_approval",
      insights: "Pending completion"
    }
  ];

  const optimizationActions = [
    {
      id: 1,
      type: "pricing",
      title: "Implement Dynamic Pricing",
      description: "Adjust pricing based on regional performance data",
      impact: "8-12% revenue increase",
      effort: "Medium",
      timeframe: "2 weeks",
      status: "recommended"
    },
    {
      id: 2,
      type: "inventory",
      title: "Optimize Stock Levels",
      description: "Increase inventory in high-performing regions",
      impact: "15% reduction in stockouts",
      effort: "Low",
      timeframe: "1 week",
      status: "in_progress"
    },
    {
      id: 3,
      type: "marketing",
      title: "Launch Targeted Campaigns",
      description: "Focus marketing spend on high-conversion demographics",
      impact: "20% efficiency improvement",
      effort: "High",
      timeframe: "3 weeks",
      status: "planned"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-700 border-green-200";
      case "pending_approval": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case "recommended": return "bg-purple-50 text-purple-700 border-purple-200";
      case "in_progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "planned": return "bg-gray-50 text-gray-700 border-gray-200";
      case "completed": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader 
        currentPhase="post-launch"
        completedSteps={2}
        totalSteps={4}
        skuName={selectedSku === "all" ? "All SKUs" : skus.find(s => s.id.toString() === selectedSku)?.name}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-primary" />
              Post-Launch Optimization
            </h1>
            <p className="text-muted-foreground">Feedback-driven optimization and continuous improvement</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedSku} onValueChange={setSelectedSku}>
              <SelectTrigger className="w-48">
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
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Active Surveys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">569 total responses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+4% vs last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                Optimization Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 in progress</p>
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

        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
            <TabsTrigger value="surveys">Micro Surveys</TabsTrigger>
            <TabsTrigger value="optimization">Optimization Actions</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback" className="space-y-6">
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
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {sentimentData.map((item) => (
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

              {/* Feedback Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback by Category</CardTitle>
                  <CardDescription>Sentiment across key areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={feedbackSummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="positive" fill="#22c55e" />
                      <Bar dataKey="negative" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Customer Insights</CardTitle>
                <CardDescription>Key themes from customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Product Quality Praised</span>
                      <Badge className="bg-green-50 text-green-700 border-green-200">78% positive</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Excellent taste and texture" mentioned in 156 reviews. Quality consistency highly rated.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Pricing Concerns</span>
                      <Badge className="bg-red-50 text-red-700 border-red-200">38% negative</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Price sensitivity in key demographics. "Too expensive for family budget" recurring theme.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Availability Issues</span>
                      <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">29% negative</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Regional stockouts reported. Northeast showing consistent availability gaps.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Trigger-Based Micro Surveys
                </CardTitle>
                <CardDescription>
                  Targeted surveys automatically triggered by user behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {microSurveys.map((survey) => (
                    <div key={survey.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{survey.name}</h4>
                          <p className="text-sm text-muted-foreground">{survey.audience}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(survey.status)}>
                            {survey.status.replace('_', ' ')}
                          </Badge>
                          {survey.status === "pending_approval" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-7">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7">
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Responses</div>
                          <div className="font-medium">{survey.responses}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Completion</div>
                          <div className="font-medium">{survey.completion}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Status</div>
                          <div className="font-medium capitalize">{survey.status.replace('_', ' ')}</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm font-medium mb-1">Key Insight</div>
                        <div className="text-sm text-muted-foreground">{survey.insights}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Optimization Actions
                </CardTitle>
                <CardDescription>
                  Data-driven recommendations for performance improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getActionStatusColor(action.status)}>
                            {action.status.replace('_', ' ')}
                          </Badge>
                          {action.status === "recommended" && (
                            <Button size="sm">
                              Implement
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Expected Impact</div>
                          <div className="font-medium text-green-600">{action.impact}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Effort Required</div>
                          <div className="font-medium">{action.effort}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Timeframe</div>
                          <div className="font-medium">{action.timeframe}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <AutomationEngine skuId={selectedSku === "all" ? undefined : parseInt(selectedSku)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}