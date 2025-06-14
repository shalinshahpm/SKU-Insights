import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipHelp } from "@/components/ui/tooltip-help";
import { 
  MoreVertical, 
  Download, 
  Filter, 
  Settings, 
  Calendar,
  HelpCircle,
  RefreshCw
} from "lucide-react";

interface SimplifiedHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  onExport?: () => void;
  onShowFilters?: () => void;
  onRefresh?: () => void;
  showFilters?: boolean;
}

export function SimplifiedHeader({ 
  timeRange, 
  onTimeRangeChange, 
  onExport, 
  onShowFilters, 
  onRefresh,
  showFilters = false 
}: SimplifiedHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <TooltipHelp 
            content="Select the time period for data analysis. Shorter periods show more granular trends."
            title="Time Range"
          />
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
            <Filter className="h-3 w-3" />
            Filters Active
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <TooltipHelp 
          content="Access help documentation, tutorials, and support resources"
          title="Help & Support"
        />
        
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4 mr-1" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onShowFilters && (
              <>
                <DropdownMenuItem onClick={onShowFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            
            {onExport && (
              <DropdownMenuItem onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Dashboard Settings
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Documentation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}