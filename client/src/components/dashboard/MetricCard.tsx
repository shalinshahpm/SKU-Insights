import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/20 group">
      <CardContent className="p-0">
        <div className="relative px-5 py-6">
          {/* Top gradient accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${iconBgColor} opacity-70`}></div>
          
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${iconBgColor} rounded-full p-3`}>
              {icon}
            </div>
            <div className="ml-4 w-0 flex-1">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {title}
                </h3>
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
        <Link href={detailsLink}>
          <div className="text-sm font-medium text-primary hover:text-primary transition-colors cursor-pointer flex items-center group-hover:underline">
            View details
            <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
