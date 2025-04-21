import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BehavioralMetricsData, SKU } from "@/lib/types";

interface SurveyTriggerProps {
  anomalyData?: {
    sku: SKU;
    metric: BehavioralMetricsData;
    detectedTime: string;
  };
  onLaunchSurvey: (surveyConfig: {
    skuId: number;
    audience: string;
    surveyType: string;
  }) => void;
}

export function SurveyTrigger({ 
  anomalyData,
  onLaunchSurvey 
}: SurveyTriggerProps) {
  const [selectedSku, setSelectedSku] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("");
  const [selectedSurveyType, setSelectedSurveyType] = useState<string>("");

  // Fetch SKUs
  const { data: skus } = useQuery<SKU[]>({
    queryKey: ["/api/skus"],
  });

  const audienceOptions = [
    { value: "gen_z_moms", label: "Gen Z moms" },
    { value: "urban_males_25_34", label: "Urban males 25-34" },
    { value: "existing_customers", label: "Existing customers" },
    { value: "competitive_brand_users", label: "Competitive brand users" }
  ];

  const surveyTypeOptions = [
    { value: "awareness", label: "Awareness Check" },
    { value: "message_recall", label: "Message Recall" },
    { value: "purchase_intent", label: "Purchase Intent" },
    { value: "friction_point", label: "Friction Point Analysis" }
  ];

  const handleLaunchAnomalySurvey = () => {
    if (anomalyData) {
      onLaunchSurvey({
        skuId: anomalyData.sku.id,
        audience: "existing_customers", // Default audience for anomaly
        surveyType: "friction_point" // Default survey type for anomaly
      });
    }
  };

  const handleConfigureSurvey = () => {
    if (selectedSku && selectedAudience && selectedSurveyType) {
      onLaunchSurvey({
        skuId: parseInt(selectedSku),
        audience: selectedAudience,
        surveyType: selectedSurveyType
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Trigger</CardTitle>
        <CardDescription>Launch surveys based on behavioral data</CardDescription>
      </CardHeader>
      
      <CardContent>
        {anomalyData && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-accent bg-opacity-10">
                  <AlertCircle className="h-4 w-4 text-accent" />
                </span>
                <span className="ml-2 text-sm font-medium">Anomaly Detected</span>
              </div>
              <span className="text-xs text-muted-foreground">{anomalyData.detectedTime}</span>
            </div>
            
            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="text-sm mb-2">
                <span className="font-medium">{anomalyData.sku.name} ({anomalyData.sku.region})</span> has 
                experienced a <span className="text-destructive font-medium">
                  {((anomalyData.metric.addToCart - 3147) / 3147 * 100).toFixed(1)}%
                </span> drop in Add-to-Cart rate on {anomalyData.sku.market}.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Recommended action: Survey</span>
                <Button 
                  size="sm" 
                  className="px-3 py-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleLaunchAnomalySurvey}
                >
                  Launch Survey
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-5">
          <h4 className="text-sm font-medium mb-3">Manual Survey Launch</h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="target-sku" className="text-xs font-medium mb-1">Target SKU</Label>
              <Select value={selectedSku} onValueChange={setSelectedSku}>
                <SelectTrigger id="target-sku">
                  <SelectValue placeholder="Select SKU..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default-sku">Select SKU...</SelectItem>
                  {skus?.map((sku) => (
                    <SelectItem key={sku.id} value={sku.id.toString()}>
                      {sku.name} ({sku.region})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="audience-panel" className="text-xs font-medium mb-1">Audience Panel</Label>
              <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                <SelectTrigger id="audience-panel">
                  <SelectValue placeholder="Select audience..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default-audience">Select audience...</SelectItem>
                  {audienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="survey-type" className="text-xs font-medium mb-1">Survey Type</Label>
              <Select value={selectedSurveyType} onValueChange={setSelectedSurveyType}>
                <SelectTrigger id="survey-type">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default-type">Select type...</SelectItem>
                  {surveyTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          disabled={!selectedSku || !selectedAudience || !selectedSurveyType}
          onClick={handleConfigureSurvey}
        >
          Configure Survey
        </Button>
      </CardContent>
    </Card>
  );
}
