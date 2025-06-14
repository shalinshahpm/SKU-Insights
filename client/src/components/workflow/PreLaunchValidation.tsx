import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Play
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface LaunchReadinessData {
  overallScore: number;
  internalScore: number;
  competitiveScore: number;
  consumerScore: number;
  recommendations: string[];
}

export function PreLaunchValidation({ skuId }: { skuId: number }) {
  const [activeTab, setActiveTab] = useState('internal');

  // Fetch launch readiness data
  const { data: readinessData } = useQuery<LaunchReadinessData>({
    queryKey: ['/api/launch-readiness', skuId],
    enabled: !!skuId,
  });

  const launchSurveyMutation = useMutation({
    mutationFn: async (surveyData: any) => {
      const response = await apiRequest('POST', '/api/launch-survey', surveyData);
      return response.json();
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Launch Readiness Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Launch Readiness Score
          </CardTitle>
          <CardDescription>
            Overall readiness assessment based on internal, competitive, and consumer validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(readinessData?.overallScore || 0)}`}>
                {readinessData?.overallScore || 0}%
              </div>
              <Badge className={getScoreBadge(readinessData?.overallScore || 0)}>
                {(readinessData?.overallScore || 0) >= 80 ? 'Ready to Launch' : 
                 (readinessData?.overallScore || 0) >= 60 ? 'Needs Improvement' : 'High Risk'}
              </Badge>
            </div>
            <div className="text-right">
              <Button 
                onClick={() => launchSurveyMutation.mutate({ skuId, type: 'comprehensive' })}
                disabled={launchSurveyMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {launchSurveyMutation.isPending ? 'Launching...' : 'Run Survey'}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Launches on Survfast.xyz
              </p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-semibold ${getScoreColor(readinessData?.internalScore || 0)}`}>
                {readinessData?.internalScore || 0}%
              </div>
              <p className="text-sm text-gray-600">Internal</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-semibold ${getScoreColor(readinessData?.competitiveScore || 0)}`}>
                {readinessData?.competitiveScore || 0}%
              </div>
              <p className="text-sm text-gray-600">Competitive</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-semibold ${getScoreColor(readinessData?.consumerScore || 0)}`}>
                {readinessData?.consumerScore || 0}%
              </div>
              <p className="text-sm text-gray-600">Consumer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Validation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="internal">Internal Score</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="consumer">Consumer</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="internal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Internal Scorecard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Product Quality Score</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="w-24" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Market Readiness</span>
                  <div className="flex items-center gap-2">
                    <Progress value={72} className="w-24" />
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Supply Chain Readiness</span>
                  <div className="flex items-center gap-2">
                    <Progress value={90} className="w-24" />
                    <span className="text-sm font-medium">90%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Marketing Readiness</span>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="w-24" />
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Competitive Overlap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Moderate Overlap Detected</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    3 similar products found in target category. Consider differentiation strategies.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Competitor Product A</p>
                      <p className="text-sm text-gray-600">Similar positioning, 68% overlap</p>
                    </div>
                    <Badge variant="outline">High Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Competitor Product B</p>
                      <p className="text-sm text-gray-600">Different market, 32% overlap</p>
                    </div>
                    <Badge variant="outline">Low Risk</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Consumer Research Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">82%</div>
                    <p className="text-sm text-gray-600">Purchase Intent</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">76%</div>
                    <p className="text-sm text-gray-600">Brand Fit</p>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800 mb-2">Key Insights</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Strong appeal to target demographic (25-34)</li>
                    <li>• Premium positioning resonates well</li>
                    <li>• Price point considered fair by 78% of respondents</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Launch Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {readinessData?.recommendations?.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{rec}</p>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <p>Run validation surveys to get personalized recommendations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}