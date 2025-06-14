import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WorkflowHeader } from "@/components/workflow/WorkflowHeader";
import { AutomationEngine } from "@/components/automation/AutomationEngine";
import { SKU, BehavioralMetricsData } from "@/lib/types";
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
  Rocket,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShoppingCart,
  Users,
  Eye,
  ArrowRight,
  Upload,
  Plus,
  Activity
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LaunchExecution() {
  const [selectedSku, setSelectedSku] = useState("all");

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ["/api/skus"] 
  });

  // Mock real-time SKU performance data
  const liveMetrics = [
    { metric: "Page Views", value: "24,851", change: 18.2, status: "normal" },
    { metric: "Add-to-Cart Rate", value: "3.2%", change: -2.1, status: "watch" },
    { metric: "Conversion Rate", value: "2.8%", change: 5.4, status: "normal" },
    { metric: "Cart Abandonment", value: "12.3%", change: -8.7, status: "normal" },
    { metric: "Sell-Through Rate", value: "68%", change: 12.1, status: "excellent" }
  ];

  // Mock hourly performance data
  const hourlyData = [
    { hour: "00:00", views: 420, conversions: 12, carts: 18 },
    { hour: "01:00", views: 380, conversions: 8, carts: 15 },
    { hour: "02:00", views: 320, conversions: 6, carts: 12 },
    { hour: "03:00", views: 280, conversions: 4, carts: 10 },
    { hour: "04:00", views: 340, conversions: 7, carts: 14 },
    { hour: "05:00", views: 450, conversions: 11, carts: 19 },
    { hour: "06:00", views: 680, conversions: 18, carts: 26 },
    { hour: "07:00", views: 920, conversions: 28, carts: 35 },
    { hour: "08:00", views: 1240, conversions: 42, carts: 48 },
    { hour: "09:00", views: 1580, conversions: 58, carts: 67 },
    { hour: "10:00", views: 1820, conversions: 72, carts: 82 },
    { hour: "11:00", views: 2100, conversions: 84, carts: 95 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50 border-green-200";
      case "normal": return "text-blue-600 bg-blue-50 border-blue-200";
      case "watch": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "alert": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "normal": return <Activity className="h-4 w-4 text-blue-500" />;
      case "watch": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "alert": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader 
        currentPhase="launch"
        completedSteps={1}
        totalSteps={4}
        skuName={selectedSku === "all" ? "All SKUs" : skus.find(s => s.id.toString() === selectedSku)?.name}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              Launch Execution
            </h1>
            <p className="text-muted-foreground">Real-time SKU monitoring and performance tracking</p>
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
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add SKU
            </Button>
          </div>
        </div>

        {/* SKU Onboarding Banner */}
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">SKU Onboarding & Data Integration</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your POS/eCom platforms (Amazon, Walmart, Carrefour) for real-time monitoring
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">Amazon API</Badge>
                  <Badge variant="outline">Walmart Connect</Badge>
                  <Badge variant="outline">Carrefour API</Badge>
                  <Badge variant="outline">Custom POS</Badge>
                </div>
              </div>
              <Button>
                Connect Platforms
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {liveMetrics.map((metric) => (
            <Card key={metric.metric}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {metric.metric}
                  {getStatusIcon(metric.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="flex items-center">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${metric.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
                <Badge className={`mt-2 text-xs ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="monitoring" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
            <TabsTrigger value="triggers">Smart Triggers</TabsTrigger>
            <TabsTrigger value="integration">Data Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monitoring" className="space-y-6">
            {/* Hourly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Performance Trends</CardTitle>
                <CardDescription>Real-time metrics updated every 15 minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="carts" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Performance Alerts
                </CardTitle>
                <CardDescription>Active alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-4 w-4 text-yellow-600" />
                      <div>
                        <div className="font-medium text-sm">Add-to-Cart Rate Declining</div>
                        <div className="text-xs text-muted-foreground">Down 2.1% in last 2 hours</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium text-sm">Northeast Region Underperforming</div>
                        <div className="text-xs text-muted-foreground">23% below national average</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Launch Survey
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="triggers">
            <AutomationEngine skuId={selectedSku === "all" ? undefined : parseInt(selectedSku)} />
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Data Sources</CardTitle>
                <CardDescription>Manage your platform integrations and data feeds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-medium">Amazon API</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Connected
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Last sync: 2 minutes ago
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Metrics: Views, Add-to-Cart, Conversions, Reviews
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Walmart Connect</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Setup in progress
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Complete Setup
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium">Carrefour API</span>
                      </div>
                      <Badge variant="outline">
                        Not Connected
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      European market data
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Connect
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                          <Upload className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">Custom CSV</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Manual data uploads
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Upload Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}