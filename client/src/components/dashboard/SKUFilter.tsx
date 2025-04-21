import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  RotateCcw 
} from "lucide-react";
import { FilterOptions } from "@/lib/types";

interface SKUFilterProps {
  filterOptions: FilterOptions;
  onApplyFilters: (filters: {
    selectedSku: string;
    selectedMarket: string;
    selectedRegion: string;
  }) => void;
}

export function SKUFilter({ filterOptions, onApplyFilters }: SKUFilterProps) {
  const [selectedSku, setSelectedSku] = useState("all");
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-apply filters when selection changes
  useEffect(() => {
    onApplyFilters({
      selectedSku,
      selectedMarket,
      selectedRegion,
    });
  }, [selectedSku, selectedMarket, selectedRegion, onApplyFilters]);

  // Get display name for SKU
  const getSkuDisplayName = () => {
    if (selectedSku === "all") return null;
    const sku = filterOptions.skus.find(s => s.value === selectedSku);
    return sku ? sku.label : selectedSku;
  };

  // Count active filters
  const activeFilterCount = [
    selectedSku !== "all", 
    selectedMarket !== "all", 
    selectedRegion !== "all"
  ].filter(Boolean).length;

  return (
    <Card className="mb-6 shadow-sm border-muted/60">
      <CardHeader 
        className="pb-2 px-4 py-3 flex flex-row items-center justify-between cursor-pointer bg-muted/10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Filter Data
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/30">
                  {activeFilterCount} active
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs mt-1 flex flex-wrap gap-1">
              {selectedSku !== "all" && (
                <span className="px-2 py-0.5 bg-muted/30 rounded text-xs">
                  SKU: {getSkuDisplayName()}
                </span>
              )}
              {selectedMarket !== "all" && (
                <span className="px-2 py-0.5 bg-muted/30 rounded text-xs">
                  Market: {selectedMarket}
                </span>
              )}
              {selectedRegion !== "all" && (
                <span className="px-2 py-0.5 bg-muted/30 rounded text-xs">
                  Region: {selectedRegion}
                </span>
              )}
              {activeFilterCount === 0 && "All data shown"}
            </CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
          {isExpanded ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4 border-t border-muted/60">
          <div className="flex flex-col md:flex-row md:items-end space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="sku-select" className="block text-sm font-medium mb-1">
                SKU
              </Label>
              <Select value={selectedSku} onValueChange={setSelectedSku}>
                <SelectTrigger id="sku-select" className="w-full">
                  <SelectValue placeholder="All SKUs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SKUs</SelectItem>
                  {filterOptions.skus.map((option) => (
                    <SelectItem key={option.value} value={option.value || "unknown"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="market-select" className="block text-sm font-medium mb-1">
                Market
              </Label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger id="market-select" className="w-full">
                  <SelectValue placeholder="All Markets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Markets</SelectItem>
                  {filterOptions.markets.map((option) => (
                    <SelectItem key={option.value} value={option.value || "unknown"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="region-select" className="block text-sm font-medium mb-1">
                Region
              </Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region-select" className="w-full">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {filterOptions.regions.map((option) => (
                    <SelectItem key={option.value} value={option.value || "unknown"}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeFilterCount > 0 && (
              <div className="md:ml-2">
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => {
                    setSelectedSku("all");
                    setSelectedMarket("all");
                    setSelectedRegion("all");
                  }}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
