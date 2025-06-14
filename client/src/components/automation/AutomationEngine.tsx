import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Zap,
  Bell,
  AlertTriangle,
  Clock,
  Users,
  TrendingDown,
  Mail,
  Slack,
  Plus,
  Settings,
  Play,
  Pause
} from "lucide-react";

interface TriggerRule {
  id: number;
  name: string;
  metric: string;
  condition: string;
  threshold: number;
  action: "survey" | "alert" | "both";
  surveyTemplate?: string;
  enabled: boolean;
  lastTriggered?: string;
  triggerCount: number;
}

interface AutomationEngineProps {
  skuId?: number;
}

export function AutomationEngine({ skuId }: AutomationEngineProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: triggers = [] } = useQuery<TriggerRule[]>({
    queryKey: ["/api/automation-triggers", skuId],
    queryFn: async () => [
      {
        id: 1,
        name: "Cart Abandonment Alert",
        metric: "cart_abandonment_rate",
        condition: "greater_than",
        threshold: 15,
        action: "both",
        surveyTemplate: "cart_abandonment_survey",
        enabled: true,
        lastTriggered: "2025-01-14T10:30:00Z",
        triggerCount: 3
      },
      {
        id: 2,
        name: "Low Conversion Alert",
        metric: "conversion_rate",
        condition: "less_than",
        threshold: 2.5,
        action: "alert",
        enabled: true,
        triggerCount: 1
      },
      {
        id: 3,
        name: "Regional Performance Drop",
        metric: "sales_velocity",
        condition: "decrease_by",
        threshold: 20,
        action: "survey",
        surveyTemplate: "performance_investigation",
        enabled: false,
        triggerCount: 0
      }
    ]
  });

  const toggleTriggerMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      return { id, enabled };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automation-triggers"] });
      toast({
        title: "Trigger Updated",
        description: "Automation rule has been updated successfully.",
      });
    }
  });

  const approveSurveyMutation = useMutation({
    mutationFn: async ({ triggerId, approved }: { triggerId: number; approved: boolean }) => {
      return { triggerId, approved };
    },
    onSuccess: (data) => {
      toast({
        title: data.approved ? "Survey Approved" : "Survey Rejected",
        description: data.approved 
          ? "Micro survey has been launched to target audience."
          : "Survey request has been declined.",
      });
    }
  });

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "cart_abandonment_rate":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "conversion_rate":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "sales_velocity":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConditionText = (condition: string, threshold: number) => {
    switch (condition) {
      case "greater_than":
        return `> ${threshold}%`;
      case "less_than":
        return `< ${threshold}%`;
      case "decrease_by":
        return `↓ ${threshold}%`;
      default:
        return `${threshold}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Smart Automation Engine
          </h3>
          <p className="text-sm text-muted-foreground">
            Automated triggers for surveys and alerts based on performance thresholds
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
              <DialogDescription>
                Set up automatic triggers for surveys and alerts
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Rule configuration form would be implemented here</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {triggers.map((trigger) => (
          <Card key={trigger.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getMetricIcon(trigger.metric)}
                  <div>
                    <CardTitle className="text-base">{trigger.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {trigger.metric.replace(/_/g, ' ')} {getConditionText(trigger.condition, trigger.threshold)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={trigger.enabled ? "default" : "secondary"}>
                    {trigger.enabled ? "Active" : "Paused"}
                  </Badge>
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={(enabled) => 
                      toggleTriggerMutation.mutate({ id: trigger.id, enabled })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {trigger.triggerCount} triggers
                  </div>
                  {trigger.lastTriggered && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last: {new Date(trigger.lastTriggered).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {trigger.action === "survey" && <Users className="h-3 w-3" />}
                    {trigger.action === "alert" && <Bell className="h-3 w-3" />}
                    {trigger.action === "both" && <Zap className="h-3 w-3" />}
                    {trigger.action === "both" ? "Survey + Alert" : trigger.action}
                  </div>
                </div>

                {trigger.action !== "alert" && trigger.enabled && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      onClick={() => approveSurveyMutation.mutate({ 
                        triggerId: trigger.id, 
                        approved: true 
                      })}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Approve Survey
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => approveSurveyMutation.mutate({ 
                        triggerId: trigger.id, 
                        approved: false 
                      })}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alert Channels
          </CardTitle>
          <CardDescription>
            Configure where alerts are sent when triggers activate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Slack className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Slack</span>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Teams</span>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}