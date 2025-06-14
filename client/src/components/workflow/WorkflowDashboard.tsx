import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  BarChart3,
  Target,
  AlertTriangle,
  Upload,
  CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { WorkflowHeader } from './WorkflowHeader';
import { SKUUploader } from './SKUUploader';
import { PreLaunchValidation } from './PreLaunchValidation';
import { ActionCenter } from './ActionCenter';

interface SKUMetrics {
  velocity: number;
  velocityChange: number;
  reviewDelta: number;
  sentimentScore: number;
  benchmarkPosition: number;
}

interface SKU {
  id: number;
  name: string;
  brand: string;
  category: string;
  region: string;
  market: string;
  velocity?: number;
  sentimentScore?: number;
  reviewDelta?: number;
  launchReadinessScore?: number;
}

export function WorkflowDashboard() {
  const [selectedSku, setSelectedSku] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('pulse');

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({ 
    queryKey: ['/api/skus'] 
  });

  // Fetch metrics for selected SKU
  const { data: metrics } = useQuery<SKUMetrics>({
    queryKey: ['/api/sku-metrics', selectedSku],
    enabled: !!selectedSku,
  });

  const selectedSkuData = skus.find(sku => sku.id === selectedSku);

  const getVelocityColor = (velocity: number, change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < -10) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  const renderPulseCheck = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* SKU Velocity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            SKU Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.velocity || 0}</div>
          <div className={`flex items-center text-sm ${getVelocityColor(metrics?.velocity || 0, metrics?.velocityChange || 0)}`}>
            {(metrics?.velocityChange || 0) > 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {metrics?.velocityChange || 0}% vs last week
          </div>
          <p className="text-xs text-gray-500 mt-1">Units/day across all channels</p>
        </CardContent>
      </Card>

      {/* Review Delta */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Review Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.reviewDelta || 0}</div>
          <div className="text-sm text-gray-600">
            New reviews this week
          </div>
          <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
        </CardContent>
      </Card>

      {/* Sentiment Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Sentiment Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getSentimentColor(metrics?.sentimentScore || 0)}`}>
            {((metrics?.sentimentScore || 0) * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">
            Consumer sentiment
          </div>
          <p className="text-xs text-gray-500 mt-1">Based on reviews & social media</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderBenchmarks = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Category Benchmarks
        </CardTitle>
        <CardDescription>
          Performance vs category average and top performers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Velocity vs Category Avg</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (metrics?.benchmarkPosition || 50))}%` }}
                />
              </div>
              <span className="text-sm font-medium">{metrics?.benchmarkPosition || 50}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">Top 25%</div>
              <p className="text-xs text-gray-500">Performance tier</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">+23%</div>
              <p className="text-xs text-gray-500">vs category</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">#7</div>
              <p className="text-xs text-gray-500">in segment</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <WorkflowHeader />

      {/* SKU Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select SKU for Analysis</CardTitle>
          <CardDescription>
            Choose a SKU to view detailed workflow analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedSku?.toString() || ''} onValueChange={(value) => setSelectedSku(parseInt(value))}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a SKU..." />
              </SelectTrigger>
              <SelectContent>
                {skus.map((sku) => (
                  <SelectItem key={sku.id} value={sku.id.toString()}>
                    {sku.name} - {sku.brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedSkuData && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedSkuData.category}</Badge>
                <Badge variant="outline">{selectedSkuData.region}</Badge>
                {selectedSkuData.launchReadinessScore && (
                  <Badge className={
                    selectedSkuData.launchReadinessScore >= 80 
                      ? 'bg-green-100 text-green-800'
                      : selectedSkuData.launchReadinessScore >= 60
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }>
                    {selectedSkuData.launchReadinessScore}% Ready
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Workflow Content */}
      {selectedSku ? (
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pulse">Pulse Check</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="validation">Pre-Launch</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="pulse" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">① Pulse Check</h3>
              {renderPulseCheck()}
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">② Consumer Sentiment</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis Dashboard</CardTitle>
                  <CardDescription>
                    Real-time consumer sentiment tracking across all channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getSentimentColor(metrics?.sentimentScore || 0)}`}>
                          {((metrics?.sentimentScore || 0) * 100).toFixed(0)}%
                        </div>
                        <p className="text-sm text-gray-600">Overall Sentiment</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Positive Reviews</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Neutral Reviews</span>
                        <span className="text-sm font-medium">24%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Negative Reviews</span>
                        <span className="text-sm font-medium">8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">③ Benchmarks vs Category</h3>
              {renderBenchmarks()}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">④ Actions & Alerts</h3>
              <ActionCenter skuId={selectedSku} />
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">⑤ Pre-launch Validation</h3>
              <PreLaunchValidation skuId={selectedSku} />
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">⑥ Learning Loop</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Outcome Tracking</CardTitle>
                  <CardDescription>
                    Timeline of actions taken and their measured impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Learning loop data will appear here</p>
                    <p className="text-sm">Execute actions to start tracking outcomes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          {/* SKU Upload Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Get Started
              </CardTitle>
              <CardDescription>
                Upload your SKU data to begin using the workflow-based dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SKUUploader />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}