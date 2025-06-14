// Types for the front-end components

export type BehavioralMetricsData = {
  id: number;
  skuId: number;
  date: string;
  pageViews: number;
  addToCart: number;
  reviewVolume: number;
  averageRating: number;
  status: "normal" | "anomaly" | "watch";
}

export type BehavioralMetricsResponse = {
  metrics: BehavioralMetricsData[];
  summary: {
    timeframe: string;
    totals: {
      totalPageViews: number;
      totalAddToCart: number;
      totalReviewVolume: number;
      averageRating: number;
      anomalyCount: number;
      watchStatusCount: number;
      conversionRate: number;
    };
    trends: {
      pageViewsTrend: number;
      addToCartTrend: number;
      reviewVolumeTrend: number;
      ratingTrend: number;
      conversionRateTrend: number;
    };
    executiveInsights?: {
      dailyChange: {
        pageViews: { value: number; percentage: number } | null;
        addToCart: { value: number; percentage: number } | null;
        conversionRate: { current: number; previous: number; change: number } | null;
        reviewVolume: { value: number; percentage: number } | null;
        rating: { value: number; percentage: number } | null;
      } | null;
      weeklyChange: {
        pageViews: { value: number; percentage: number } | null;
        addToCart: { value: number; percentage: number } | null;
        conversionRate: { current: number; previous: number; change: number } | null;
        reviewVolume: { value: number; percentage: number } | null;
        rating: { value: number; percentage: number } | null;
      } | null;
      peakPerformance: {
        pageViews: { value: number; date: Date };
        addToCart: { value: number; date: Date };
        conversionRate: { value: number; date: Date };
      };
      anomalyHighlights: Array<{
        date: Date;
        metrics: {
          pageViews: number;
          addToCart: number;
          reviewVolume: number;
          rating: number;
        };
        deviation: {
          pageViews: number;
          addToCart: number;
          reviewVolume: number;
          rating: number;
        } | null;
      }>;
    };
  } | null;
}

export type BrandHealthMetricsData = {
  id: number;
  skuId: number;
  date: string;
  brandLiftScore: number;
  purchaseIntent: number;
  netSentiment: number;
}

export type User = {
  id: number;
  username: string;
  fullName: string;
  role: "brand_manager" | "regional_insights" | "global_marketing";
  avatar?: string;
}

export type SKU = {
  id: number;
  name: string;
  brand: string;
  region: string;
  market: string;
  createdAt: string;
}

export type TimelineEvent = {
  id: number;
  skuId?: number;
  type: "sku_added" | "anomaly_detected" | "survey_launched" | "survey_completed" | "report_generated";
  title: string;
  description: string;
  timestamp: string;
  data?: {
    details?: string;
    reportUrl?: string;
    metricId?: number;
    surveyId?: number;
  };
}

export type Survey = {
  id: number;
  skuId: number;
  title: string;
  type: "awareness" | "message_recall" | "purchase_intent" | "friction_point";
  audience: string;
  status: "draft" | "active" | "completed";
  sampleSize: number;
  questions: Array<{
    question: string;
    responseType: "multiple_choice" | "rating" | "open_ended";
    options?: {
      min?: number;
      max?: number;
      labels?: string[];
      choices?: string[];
    };
  }>;
  createdAt: string;
  completedAt?: string;
}

export type MetricCardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  detailsLink?: string;
  subtext?: string;
  tooltip?: string;
  performanceLevel?: "excellent" | "good" | "average" | "poor";
  benchmark?: string;
  actionHint?: string;
}

export type BehavioralTableData = {
  metric: string;
  current: string | number;
  dailyChange: number;
  status: "normal" | "anomaly" | "watch";
}

export type FilterOptions = {
  skus: Array<{ value: string; label: string; }>;
  markets: Array<{ value: string; label: string; }>;
  regions: Array<{ value: string; label: string; }>;
}

export type SidebarItem = {
  title: string;
  icon: React.ReactNode;
  path: string;
  isActive?: boolean;
}

export type SidebarSectionProps = {
  title: string;
  items: SidebarItem[];
}

export type QuestionTemplate = {
  id: number;
  category: "awareness" | "message_recall" | "purchase_intent" | "friction_point";
  question: string;
  responseType: "multiple_choice" | "rating" | "open_ended";
  options?: {
    min?: number;
    max?: number;
    labels?: string[];
    choices?: string[];
  } | null;
}

export type AnomalySetting = {
  id: number;
  metricType: string;
  thresholdPercentage: number;
  enabled: boolean;
}
