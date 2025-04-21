import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

  const handleApplyFilters = () => {
    onApplyFilters({
      selectedSku,
      selectedMarket,
      selectedRegion,
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Label htmlFor="sku-select" className="block text-sm font-medium mb-1">
              Select SKUs
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

          <div className="pt-6">
            <Button 
              className="w-full md:w-auto"
              onClick={handleApplyFilters}
              variant="secondary"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
