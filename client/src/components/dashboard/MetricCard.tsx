import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
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

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    
    return change > 0 ? (
      <ArrowUp className="mr-1 h-3 w-3" />
    ) : (
      <ArrowDown className="mr-1 h-3 w-3" />
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
              {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-muted-foreground truncate">
                  {title}
                </dt>
                <dd>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold font-mono">
                      {value}
                    </div>
                    {change !== undefined && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(change)}`}>
                        <div className="flex items-center">
                          {getChangeIcon(change)}
                          <span>
                            {Math.abs(change).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                    {subtext && (
                      <div className="ml-2 text-sm text-muted-foreground">
                        {subtext}
                      </div>
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 px-4 py-3 sm:px-6">
        <div className="text-sm">
          <Link href={detailsLink}>
            <div className="font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
              View details
            </div>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
