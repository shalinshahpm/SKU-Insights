import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUp, ArrowDown, ExternalLink, Info } from "lucide-react";
import { Link } from "wouter";
import { MetricCardProps } from "@/lib/types";

export function MetricCard({
  title,
  value,
  change,
  icon,
  iconBgColor,
  iconTextColor,
  detailsLink = "#",
  subtext,
  tooltip,
  performanceLevel,
  benchmark,
  actionHint,
  quickAction,
}: MetricCardProps) {
  const getChangeColor = (change?: number) => {
    if (!change) return "text-muted-foreground";
    return change > 0 ? "text-success" : "text-destructive";
  };

  const getChangeBg = (change?: number) => {
    if (!change) return "";
    return change > 0 ? "bg-success/10" : "bg-destructive/10";
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    
    return change > 0 ? (
      <ArrowUp className="mr-1 h-3 w-3" />
    ) : (
      <ArrowDown className="mr-1 h-3 w-3" />
    );
  };

  const getPerformanceStyles = (level?: string) => {
    switch (level) {
      case "excellent":
        return { 
          indicator: "bg-green-500", 
          text: "text-green-700", 
          bg: "bg-green-50 dark:bg-green-950/20",
          border: "border-green-200"
        };
      case "good":
        return { 
          indicator: "bg-blue-500", 
          text: "text-blue-700", 
          bg: "bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-200"
        };
      case "average":
        return { 
          indicator: "bg-yellow-500", 
          text: "text-yellow-700", 
          bg: "bg-yellow-50 dark:bg-yellow-950/20",
          border: "border-yellow-200"
        };
      case "poor":
        return { 
          indicator: "bg-red-500", 
          text: "text-red-700", 
          bg: "bg-red-50 dark:bg-red-950/20",
          border: "border-red-200"
        };
      default:
        return { 
          indicator: "bg-gray-300", 
          text: "text-gray-600", 
          bg: "", 
          border: ""
        };
    }
  };

  const performanceStyles = getPerformanceStyles(performanceLevel);

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md hover:border-primary/20 group ${performanceStyles.bg} ${performanceStyles.border}`}>
      <CardContent className="p-0">
        <div className="relative px-5 py-6">
          {/* Performance indicator */}
          {performanceLevel && (
            <div className={`absolute top-0 left-0 right-0 h-1 ${performanceStyles.indicator}`}></div>
          )}
          {!performanceLevel && (
            <div className={`absolute top-0 left-0 right-0 h-1 ${iconBgColor} opacity-70`}></div>
          )}
          
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${iconBgColor} rounded-full p-3`}>
              {icon}
            </div>
            <div className="ml-4 w-0 flex-1">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                  </h3>
                  {tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-baseline mt-1">
                  <div className="text-2xl font-bold">
                    {value}
                  </div>
                  {change !== undefined && (
                    <div className={`ml-2.5 flex items-baseline text-sm font-semibold ${getChangeColor(change)}`}>
                      <div className={`flex items-center rounded-full py-0.5 px-2 ${getChangeBg(change)}`}>
                        {getChangeIcon(change)}
                        <span>
                          {Math.abs(change).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                  {subtext && (
                    <div className="ml-2.5 text-sm text-muted-foreground">
                      {subtext}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 px-5 py-2.5 border-t border-border/40">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            {benchmark && (
              <div className="text-xs text-muted-foreground mb-1">
                Benchmark: {benchmark}
              </div>
            )}
            {actionHint && (
              <div className={`text-xs ${performanceStyles.text} font-medium`}>
                💡 {actionHint}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {quickAction && (
              <Button
                size="sm"
                variant={quickAction.variant || "default"}
                onClick={quickAction.action}
                className="text-xs h-7 px-2"
              >
                {quickAction.label}
              </Button>
            )}
            <Link href={detailsLink}>
              <div className="text-sm font-medium text-primary hover:text-primary transition-colors cursor-pointer flex items-center group-hover:underline">
                View details
                <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
              </div>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
