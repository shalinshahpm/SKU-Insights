import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Activity, ShoppingBag, LineChart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TimelineEvent } from "@/lib/types";

interface InsightsTimelineProps {
  events: TimelineEvent[];
  newCount?: number;
  onViewAll: () => void;
}

export function InsightsTimeline({ 
  events, 
  newCount = 0,
  onViewAll 
}: InsightsTimelineProps) {
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

  const getTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: false });
    } catch (error) {
      return "recently";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Insights Timeline</CardTitle>
          {newCount > 0 && (
            <Badge className="bg-primary/10 text-primary">
              {newCount} new
            </Badge>
          )}
        </div>
        <CardDescription>
          Recent activities and insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flow-root">
          <ul className="-mb-8">
            {events.map((event, index) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {index !== events.length - 1 && (
                    <span 
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-muted" 
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-start space-x-3 px-6 py-3">
                    <div className="relative">
                      <div className={`h-10 w-10 rounded-full ${getEventIconBackground(event.type)} flex items-center justify-center ring-8 ring-white dark:ring-gray-800`}>
                        {getEventIcon(event.type)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium">
                            {event.title}
                          </a>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>{event.data?.details}</p>
                      </div>
                      {event.data?.reportUrl && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            View Report
                          </Button>
                        </div>
                      )}
                      {event.type === "anomaly_detected" && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            Investigate
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs whitespace-nowrap text-muted-foreground">
                      {getTimeAgo(event.timestamp)} ago
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/10 py-3 border-t justify-center">
        <Button 
          variant="link" 
          className="text-primary hover:text-primary/80"
          onClick={onViewAll}
        >
          View all activity
        </Button>
      </CardFooter>
    </Card>
  );
}
