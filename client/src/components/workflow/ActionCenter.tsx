import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Pause, 
  Play,
  MessageSquare,
  Target,
  Clock
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ActionRecommendation {
  id: string;
  type: 'price_adjustment' | 'pause_sku' | 'increase_marketing' | 'improve_messaging' | 'competitor_response';
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  triggerReason: string;
  expectedImpact: string;
  estimatedCost?: string;
  timeframe: string;
  skuId: number;
}

interface ExecutedAction {
  id: number;
  type: string;
  description: string;
  status: 'pending' | 'executed' | 'completed';
  outcome?: string;
  impactScore?: number;
  createdAt: string;
}

export function ActionCenter({ skuId }: { skuId?: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [customNotes, setCustomNotes] = useState('');

  // Fetch action recommendations
  const { data: recommendations = [] } = useQuery<ActionRecommendation[]>({
    queryKey: ['/api/action-recommendations', skuId],
    enabled: !!skuId,
  });

  // Fetch executed actions
  const { data: executedActions = [] } = useQuery<ExecutedAction[]>({
    queryKey: ['/api/executed-actions', skuId],
    enabled: !!skuId,
  });

  const executeActionMutation = useMutation({
    mutationFn: async (actionData: { actionId: string; notes?: string }) => {
      const response = await apiRequest('POST', '/api/execute-action', {
        skuId,
        actionId: actionData.actionId,
        notes: actionData.notes,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executed-actions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/action-recommendations'] });
      toast({
        title: 'Action Executed',
        description: 'Action has been logged and will be tracked for outcomes',
      });
      setSelectedAction(null);
      setCustomNotes('');
    },
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'price_adjustment':
        return <DollarSign className="h-4 w-4" />;
      case 'pause_sku':
        return <Pause className="h-4 w-4" />;
      case 'increase_marketing':
        return <TrendingUp className="h-4 w-4" />;
      case 'improve_messaging':
        return <MessageSquare className="h-4 w-4" />;
      case 'competitor_response':
        return <Target className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'executed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Action Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered insights and intervention suggestions based on current performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((action) => (
                <div key={action.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActionIcon(action.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{action.title}</h4>
                          <Badge className={getUrgencyColor(action.urgency)}>
                            {action.urgency} urgency
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p><strong>Trigger:</strong> {action.triggerReason}</p>
                          <p><strong>Expected Impact:</strong> {action.expectedImpact}</p>
                          <p><strong>Timeframe:</strong> {action.timeframe}</p>
                          {action.estimatedCost && (
                            <p><strong>Estimated Cost:</strong> {action.estimatedCost}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedAction(action.id)}
                      disabled={executeActionMutation.isPending}
                    >
                      Execute
                    </Button>
                  </div>

                  {/* Action execution form */}
                  {selectedAction === action.id && (
                    <div className="border-t pt-3 space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Additional Notes (Optional)
                        </label>
                        <Textarea
                          value={customNotes}
                          onChange={(e) => setCustomNotes(e.target.value)}
                          placeholder="Add any specific instructions or context for this action..."
                          className="h-20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => executeActionMutation.mutate({ 
                            actionId: action.id, 
                            notes: customNotes 
                          })}
                          disabled={executeActionMutation.isPending}
                        >
                          {executeActionMutation.isPending ? 'Executing...' : 'Confirm Action'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAction(null);
                            setCustomNotes('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active recommendations</p>
              <p className="text-sm">Your SKU performance is within expected ranges</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Executed Actions History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Action History & Outcomes
          </CardTitle>
          <CardDescription>
            Track the impact of executed interventions on SKU performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {executedActions.length > 0 ? (
            <div className="space-y-3">
              {executedActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getActionIcon(action.type)}
                      <div>
                        <p className="font-medium text-sm">{action.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(action.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {action.impactScore && (
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          action.impactScore > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {action.impactScore > 0 ? '+' : ''}{action.impactScore}%
                        </div>
                        <p className="text-xs text-gray-500">Impact</p>
                      </div>
                    )}
                    <Badge className={getStatusColor(action.status)}>
                      {action.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No actions executed yet</p>
              <p className="text-sm">Execute recommendations to track their impact</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}