import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkflowHeader } from "@/components/workflow/WorkflowHeader";
import { AutomationEngine } from "@/components/automation/AutomationEngine";
import { SKU, TimelineEvent, BehavioralMetricsData, BrandHealthMetricsData } from "@/lib/types";
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Download,
  Filter,
  Calendar,
  Award,
  Users,
  DollarSign,
  Activity,
  Brain
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface DecisionRecord {
  id: number;
  date: string;
  phase: string;
  decision: string;
  rationale: string;
  outcome: "positive" | "negative" | "pending";
  impact: number;
}

interface Recommendation {
  id: number;
  priority: "high" | "medium" | "low";
  category: "optimization" | "risk" | "opportunity";
  title: string;
  description: string;
  expectedImpact: string;
  timeframe: string;
  effort: "low" | "medium" | "high";
}

export default function ExecutiveSummary() {
  const [selectedSku, setSelectedSku] = useState("all");
  const [timeRange, setTimeRange] = useState("90days");

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ["/api/skus"] 
  });

  // Mock cross-phase performance data
  const crossPhaseData = [
    { phase: "Pre-Launch", score: 82, benchmark: 75, status: "completed" },
    { phase: "Launch", score: 76, benchmark: 70, status: "active" },
    { phase: "Post-Launch", score: 0, benchmark: 80, status: "pending" },
    { phase: "Optimization", score: 0, benchmark: 85, status: "pending" }
  ];

  // Mock performance trend data
  const performanceTrend = [
    { month: "Oct", brandLift: 65, purchaseIntent: 42, netSentiment: 18 },
    { month: "Nov", brandLift: 72, purchaseIntent: 48, netSentiment: 25 },
    { month: "Dec", brandLift: 78, purchaseIntent: 52, netSentiment: 31 },
    { month: "Jan", brandLift: 82, purchaseIntent: 58, netSentiment: 35 }
  ];

  // Mock decision history
  const decisionHistory: DecisionRecord[] = [
    {
      id: 1,
      date: "2025-01-10",
      phase: "Pre-Launch",
      decision: "Approved concept testing with premium positioning",
      rationale: "Consumer research showed 78% appeal rate vs 65% benchmark",
      outcome: "positive",
      impact: 15
    },
    {
      id: 2,
      date: "2025-01-12",
      phase: "Launch",
      decision: "Increased initial media spend by 25%",
      rationale: "Strong pre-launch metrics warranted aggressive launch strategy",
      outcome: "positive",
      impact: 12
    },
    {
      id: 3,
      date: "2025-01-14",
      phase: "Launch",
      decision: "Launched cart abandonment survey trigger",
      rationale: "Abandonment rate exceeded 15% threshold",
      outcome: "pending",
      impact: 0
    }
  ];

  // Mock AI recommendations
  const recommendations: Recommendation[] = [
    {
      id: 1,
      priority: "high",
      category: "risk",
      title: "Address Regional Performance Gap",
      description: "Northeast region showing 23% lower conversion vs national average. Immediate intervention recommended.",
      expectedImpact: "8-12% conversion improvement",
      timeframe: "2 weeks",
      effort: "medium"
    },
    {
      id: 2,
      priority: "medium", 
      category: "opportunity",
      title: "Optimize Peak Shopping Hours",
      description: "Data shows 40% higher conversion between 7-9 PM. Consider time-targeted promotions.",
      expectedImpact: "5-8% sales lift",
      timeframe: "1 week",
      effort: "low"
    },
    {
      id: 3,
      priority: "medium",
      category: "optimization",
      title: "Expand Successful Demographics",
      description: "25-34 age group showing exceptional engagement. Scale targeting to similar segments.",
      expectedImpact: "15-20% reach expansion",
      timeframe: "3 weeks",
      effort: "high"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "risk": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "opportunity": return <Target className="h-4 w-4 text-green-500" />;
      case "optimization": return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default: return <Lightbulb className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader 
        currentPhase="executive"
        completedSteps={2}
        totalSteps={4}
        skuName={selectedSku === "all" ? "All SKUs" : skus.find(s => s.id.toString() === selectedSku)?.name}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Executive Dashboard</h1>
            <p className="text-muted-foreground">Cross-phase performance summary and strategic insights</p>
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
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="90days">90 days</SelectItem>
                <SelectItem value="6months">6 months</SelectItem>
                <SelectItem value="1year">1 year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-gold-500" />
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82/100</div>
              <p className="text-xs text-muted-foreground">vs 75 benchmark</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+7 points</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Active SKUs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">across 3 regions</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">All on track</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Revenue Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€2.4M</div>
              <p className="text-xs text-muted-foreground">projected annual</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+18% vs plan</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                Active Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">automation rules</p>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-600">2 pending approval</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="decisions">Decision History</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-6">
            {/* Cross-Phase Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cross-Phase Performance
                </CardTitle>
                <CardDescription>
                  Progress and performance across the product lifecycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {crossPhaseData.map((phase, index) => (
                    <div key={phase.phase} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{phase.phase}</h4>
                        <Badge variant={phase.status === "completed" ? "default" : phase.status === "active" ? "secondary" : "outline"}>
                          {phase.status}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {phase.score || "—"}{phase.score ? "/100" : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Benchmark: {phase.benchmark}
                      </div>
                      {phase.score > 0 && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${phase.score >= phase.benchmark ? "bg-green-500" : "bg-yellow-500"}`}
                            style={{ width: `${Math.min((phase.score / 100) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Key metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="brandLift" stackId="1" stroke="#8884d8" fill="#8884d8" opacity={0.8} />
                    <Area type="monotone" dataKey="purchaseIntent" stackId="1" stroke="#82ca9d" fill="#82ca9d" opacity={0.8} />
                    <Area type="monotone" dataKey="netSentiment" stackId="1" stroke="#ffc658" fill="#ffc658" opacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Decision History & Impact
                </CardTitle>
                <CardDescription>
                  Track key decisions and their business impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {decisionHistory.map((decision) => (
                    <div key={decision.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{decision.phase}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(decision.date).toLocaleDateString()}
                            </span>
                            {decision.outcome === "positive" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {decision.outcome === "negative" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            {decision.outcome === "pending" && <Clock className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <h4 className="font-medium mb-1">{decision.decision}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{decision.rationale}</p>
                          {decision.impact > 0 && (
                            <div className="text-sm font-medium text-green-600">
                              Impact: +{decision.impact}% performance improvement
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>
                  Strategic insights and optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(rec.category)}
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority} priority
                            </Badge>
                            <span className="text-sm text-muted-foreground capitalize">
                              {rec.category}
                            </span>
                          </div>
                          <h4 className="font-medium mb-1">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Expected Impact:</span>
                              <div className="font-medium">{rec.expectedImpact}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Timeframe:</span>
                              <div className="font-medium">{rec.timeframe}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Effort:</span>
                              <div className="font-medium capitalize">{rec.effort}</div>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="ml-4">
                          Implement
                        </Button>
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