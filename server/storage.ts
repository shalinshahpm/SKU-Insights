import {
  type User, type InsertUser, type SKU, type InsertSKU,
  type BehavioralMetric, type InsertBehavioralMetric,
  type Survey, type InsertSurvey, 
  type BrandHealthMetric, type InsertBrandHealthMetric,
  type TimelineEvent, type InsertTimelineEvent,
  type AnomalySetting, type InsertAnomalySetting,
  type QuestionTemplate, type InsertQuestionTemplate
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

  // SKU methods
  getSKU(id: number): Promise<SKU | undefined>;
  getSKUs(): Promise<SKU[]>;
  getSKUsByRegion(region: string): Promise<SKU[]>;
  getSKUsByMarket(market: string): Promise<SKU[]>;
  createSKU(sku: InsertSKU): Promise<SKU>;
  deleteSKU(id: number): Promise<boolean>;

  // Behavioral metrics methods
  getBehavioralMetric(id: number): Promise<BehavioralMetric | undefined>;
  getBehavioralMetricsBySkuId(skuId: number): Promise<BehavioralMetric[]>;
  getBehavioralMetricsForDate(date: Date): Promise<BehavioralMetric[]>;
  createBehavioralMetric(metric: InsertBehavioralMetric): Promise<BehavioralMetric>;
  updateBehavioralMetricStatus(id: number, status: string): Promise<BehavioralMetric>;
  detectAnomalies(thresholdPercentage: number): Promise<BehavioralMetric[]>;

  // Survey methods
  getSurvey(id: number): Promise<Survey | undefined>;
  getSurveysBySkuId(skuId: number): Promise<Survey[]>;
  getActiveSurveys(): Promise<Survey[]>;
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  updateSurveyStatus(id: number, status: string): Promise<Survey>;

  // Brand health metrics methods
  getBrandHealthMetric(id: number): Promise<BrandHealthMetric | undefined>;
  getBrandHealthMetricsBySkuId(skuId: number): Promise<BrandHealthMetric[]>;
  createBrandHealthMetric(metric: InsertBrandHealthMetric): Promise<BrandHealthMetric>;

  // Timeline events methods
  getTimelineEvent(id: number): Promise<TimelineEvent | undefined>;
  getTimelineEvents(limit?: number): Promise<TimelineEvent[]>;
  getTimelineEventsBySkuId(skuId: number): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;

  // Anomaly settings methods
  getAnomalySetting(id: number): Promise<AnomalySetting | undefined>;
  getAnomalySettings(): Promise<AnomalySetting[]>;
  getAnomalySettingByMetricType(metricType: string): Promise<AnomalySetting | undefined>;
  createAnomalySetting(setting: InsertAnomalySetting): Promise<AnomalySetting>;
  updateAnomalySetting(id: number, setting: Partial<AnomalySetting>): Promise<AnomalySetting>;

  // Question template methods
  getQuestionTemplate(id: number): Promise<QuestionTemplate | undefined>;
  getQuestionTemplatesByCategory(category: string): Promise<QuestionTemplate[]>;
  createQuestionTemplate(template: InsertQuestionTemplate): Promise<QuestionTemplate>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private skus: Map<number, SKU>;
  private behavioralMetrics: Map<number, BehavioralMetric>;
  private surveys: Map<number, Survey>;
  private brandHealthMetrics: Map<number, BrandHealthMetric>;
  private timelineEvents: Map<number, TimelineEvent>;
  private anomalySettings: Map<number, AnomalySetting>;
  private questionTemplates: Map<number, QuestionTemplate>;
  
  private currentUserId: number;
  private currentSkuId: number;
  private currentBehavioralMetricId: number;
  private currentSurveyId: number;
  private currentBrandHealthMetricId: number;
  private currentTimelineEventId: number;
  private currentAnomalySettingId: number;
  private currentQuestionTemplateId: number;

  constructor() {
    this.users = new Map();
    this.skus = new Map();
    this.behavioralMetrics = new Map();
    this.surveys = new Map();
    this.brandHealthMetrics = new Map();
    this.timelineEvents = new Map();
    this.anomalySettings = new Map();
    this.questionTemplates = new Map();
    
    this.currentUserId = 1;
    this.currentSkuId = 1;
    this.currentBehavioralMetricId = 1;
    this.currentSurveyId = 1;
    this.currentBrandHealthMetricId = 1;
    this.currentTimelineEventId = 1;
    this.currentAnomalySettingId = 1;
    this.currentQuestionTemplateId = 1;
    
    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Create default users
    this.createUser({
      username: "brand_manager",
      password: "password123",
      fullName: "Sam Johnson",
      role: "brand_manager",
      avatar: undefined
    });

    this.createUser({
      username: "insights_lead",
      password: "password123",
      fullName: "Emily Wilson",
      role: "regional_insights",
      avatar: undefined
    });

    this.createUser({
      username: "marketing_ops",
      password: "password123",
      fullName: "Alex Chen",
      role: "global_marketing",
      avatar: undefined
    });

    // Create default SKUs
    const kitkat = this.createSKU({
      name: "KitKat Original",
      brand: "Nestlé",
      region: "UK",
      market: "Amazon"
    });

    const nescafe = this.createSKU({
      name: "Nescafé Gold",
      brand: "Nestlé",
      region: "India",
      market: "Amazon"
    });

    const nesquik = this.createSKU({
      name: "Nesquik Chocolate",
      brand: "Nestlé",
      region: "Brazil",
      market: "Carrefour"
    });

    const pureLife = this.createSKU({
      name: "Nestlé Pure Life",
      brand: "Nestlé",
      region: "US",
      market: "Walmart"
    });

    // Create default behavioral metrics
    for (const sku of [kitkat, nescafe, nesquik, pureLife]) {
      // Create metrics for last 7 days
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate random data with some patterns
        const basePageViews = sku.id === kitkat.id ? 25000 : (sku.id === nescafe.id ? 18000 : (sku.id === nesquik.id ? 12000 : 8000));
        const baseAddToCart = sku.id === kitkat.id ? 3500 : (sku.id === nescafe.id ? 2200 : (sku.id === nesquik.id ? 1500 : 1000));
        const baseReviewVolume = sku.id === kitkat.id ? 850 : (sku.id === nescafe.id ? 600 : (sku.id === nesquik.id ? 400 : 200));
        const baseRating = sku.id === kitkat.id ? 4.3 : (sku.id === nescafe.id ? 4.5 : (sku.id === nesquik.id ? 4.1 : 4.0));
        
        // Add some random variation
        const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        
        // Add dramatic drop for KitKat on the latest day
        let status = "normal";
        let pageViews = Math.round(basePageViews * randomFactor);
        let addToCart = Math.round(baseAddToCart * randomFactor);
        let reviewVolume = Math.round(baseReviewVolume * randomFactor);
        let averageRating = baseRating * randomFactor;
        
        // Create anomaly for KitKat's add-to-cart on the latest day
        if (sku.id === kitkat.id && i === 0) {
          addToCart = Math.round(baseAddToCart * 0.675); // 32.5% drop
          status = "anomaly";
        }
        
        // Watch status for rating drop
        if (sku.id === kitkat.id && i === 0) {
          averageRating = baseRating - 0.4;
          status = averageRating < 4.0 ? "watch" : status;
        }
        
        this.createBehavioralMetric({
          skuId: sku.id,
          date: date,
          pageViews: pageViews,
          addToCart: addToCart,
          reviewVolume: reviewVolume,
          averageRating: Math.min(5, Math.max(1, Number(averageRating.toFixed(1)))),
          status: status
        });
      }
    }

    // Create default brand health metrics
    for (const sku of [kitkat, nescafe, nesquik, pureLife]) {
      const today = new Date();
      
      // Create more dramatic data for KitKat, which we'll highlight
      const brandLiftScore = sku.id === kitkat.id ? 78.4 : (sku.id === nescafe.id ? 72.1 : (sku.id === nesquik.id ? 65.3 : 69.8));
      const purchaseIntent = sku.id === kitkat.id ? 64.2 : (sku.id === nescafe.id ? 58.7 : (sku.id === nesquik.id ? 51.9 : 60.3));
      const netSentiment = sku.id === kitkat.id ? 42 : (sku.id === nescafe.id ? 35 : (sku.id === nesquik.id ? 28 : 31));
      
      this.createBrandHealthMetric({
        skuId: sku.id,
        date: today,
        brandLiftScore: brandLiftScore,
        purchaseIntent: purchaseIntent,
        netSentiment: netSentiment
      });
    }

    // Create default surveys
    this.createSurvey({
      skuId: kitkat.id,
      title: "KitKat UK - Purchase Intent Survey",
      type: "purchase_intent",
      audience: "existing_customers",
      status: "completed",
      sampleSize: 500,
      questions: [
        {
          question: "How likely are you to purchase KitKat in the next month?",
          responseType: "rating",
          options: { min: 1, max: 5, labels: ["Very unlikely", "Very likely"] }
        },
        {
          question: "What would make you more likely to purchase KitKat?",
          responseType: "multiple_choice",
          options: { choices: ["Lower price", "New flavors", "Larger pack sizes", "Better availability", "Other"] }
        }
      ]
    });

    this.createSurvey({
      skuId: nescafe.id,
      title: "Nescafé Gold India - Brand Awareness",
      type: "awareness",
      audience: "urban_males_25_34",
      status: "active",
      sampleSize: 300,
      questions: [
        {
          question: "How familiar are you with Nescafé Gold?",
          responseType: "rating",
          options: { min: 1, max: 5, labels: ["Not at all familiar", "Very familiar"] }
        },
        {
          question: "Have you seen advertising for Nescafé Gold in the past month?",
          responseType: "multiple_choice",
          options: { choices: ["Yes", "No", "Not sure"] }
        }
      ]
    });

    // Create default anomaly settings
    this.createAnomalySetting({
      metricType: "page_views",
      thresholdPercentage: 30.0,
      enabled: true
    });

    this.createAnomalySetting({
      metricType: "add_to_cart",
      thresholdPercentage: 30.0,
      enabled: true
    });

    this.createAnomalySetting({
      metricType: "review_volume",
      thresholdPercentage: 30.0,
      enabled: true
    });

    this.createAnomalySetting({
      metricType: "average_rating",
      thresholdPercentage: 15.0,
      enabled: true
    });

    // Create default question templates
    this.createQuestionTemplate({
      category: "awareness",
      question: "How familiar are you with [BRAND] [PRODUCT]?",
      responseType: "rating",
      options: { min: 1, max: 5, labels: ["Not at all familiar", "Very familiar"] }
    });

    this.createQuestionTemplate({
      category: "message_recall",
      question: "What key messages do you recall from recent [BRAND] advertising?",
      responseType: "open_ended",
      options: null
    });

    this.createQuestionTemplate({
      category: "purchase_intent",
      question: "How likely are you to purchase [BRAND] [PRODUCT] in the next month?",
      responseType: "rating",
      options: { min: 1, max: 5, labels: ["Very unlikely", "Very likely"] }
    });

    this.createQuestionTemplate({
      category: "friction_point",
      question: "What barriers, if any, prevent you from purchasing [BRAND] [PRODUCT]?",
      responseType: "multiple_choice",
      options: { 
        choices: [
          "Price", 
          "Availability", 
          "Product features", 
          "Packaging", 
          "Competing products", 
          "No barriers",
          "Other"
        ] 
      }
    });

    // Create default timeline events
    this.createTimelineEvent({
      skuId: kitkat.id,
      type: "survey_completed",
      title: "Survey Results Available",
      description: "KitKat Original (UK) - Purchase Intent Survey",
      data: {
        details: "Purchase intent decreased by 6% compared to previous quarter. Key friction points identified.",
        reportUrl: "/reports/kitkat-uk-survey-results"
      }
    });

    this.createTimelineEvent({
      skuId: kitkat.id,
      type: "anomaly_detected",
      title: "Anomaly Detected",
      description: "KitKat Original (UK) - Add-to-Cart Rate",
      data: {
        details: "32.5% decrease in Add-to-Cart rate detected on Amazon UK. Investigating potential causes.",
        metricId: 7 // Assuming the 7th behavioral metric created is the anomaly
      }
    });

    this.createTimelineEvent({
      skuId: nescafe.id,
      type: "sku_added",
      title: "New SKU Added",
      description: "Nescafé Gold (India)",
      data: {
        details: "SKU has been added to tracking system. Initial metrics will be available in 24 hours."
      }
    });

    this.createTimelineEvent({
      skuId: kitkat.id,
      type: "report_generated",
      title: "Market Comparison Report",
      description: "KitKat UK vs Brazil Launch Comparison",
      data: {
        details: "UK launch outperforming Brazil by 23% in terms of conversion rate.",
        reportUrl: "/reports/kitkat-market-comparison"
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // SKU methods
  async getSKU(id: number): Promise<SKU | undefined> {
    return this.skus.get(id);
  }

  async getSKUs(): Promise<SKU[]> {
    return Array.from(this.skus.values());
  }

  async getSKUsByRegion(region: string): Promise<SKU[]> {
    return Array.from(this.skus.values()).filter(sku => sku.region === region);
  }

  async getSKUsByMarket(market: string): Promise<SKU[]> {
    return Array.from(this.skus.values()).filter(sku => sku.market === market);
  }

  async createSKU(insertSKU: InsertSKU): Promise<SKU> {
    const id = this.currentSkuId++;
    const sku: SKU = { 
      ...insertSKU, 
      id, 
      createdAt: new Date() 
    };
    this.skus.set(id, sku);

    // Create a timeline event for the new SKU
    this.createTimelineEvent({
      skuId: id,
      type: "sku_added",
      title: "New SKU Added",
      description: `${insertSKU.name} (${insertSKU.region})`,
      data: {
        details: "SKU has been added to tracking system. Initial metrics will be available in 24 hours."
      }
    });

    return sku;
  }

  async deleteSKU(id: number): Promise<boolean> {
    return this.skus.delete(id);
  }

  // Behavioral metrics methods
  async getBehavioralMetric(id: number): Promise<BehavioralMetric | undefined> {
    return this.behavioralMetrics.get(id);
  }

  async getBehavioralMetricsBySkuId(skuId: number): Promise<BehavioralMetric[]> {
    return Array.from(this.behavioralMetrics.values())
      .filter(metric => metric.skuId === skuId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getBehavioralMetricsForDate(date: Date): Promise<BehavioralMetric[]> {
    const dateString = date.toDateString();
    return Array.from(this.behavioralMetrics.values())
      .filter(metric => new Date(metric.date).toDateString() === dateString);
  }

  async createBehavioralMetric(insertMetric: InsertBehavioralMetric): Promise<BehavioralMetric> {
    const id = this.currentBehavioralMetricId++;
    const metric: BehavioralMetric = { ...insertMetric, id };
    this.behavioralMetrics.set(id, metric);
    return metric;
  }

  async updateBehavioralMetricStatus(id: number, status: string): Promise<BehavioralMetric> {
    const metric = this.behavioralMetrics.get(id);
    if (!metric) {
      throw new Error(`Behavioral metric with id ${id} not found`);
    }
    
    const updatedMetric = { ...metric, status };
    this.behavioralMetrics.set(id, updatedMetric);
    
    // If status changed to anomaly, create a timeline event
    if (status === "anomaly" && metric.status !== "anomaly") {
      const sku = this.skus.get(metric.skuId);
      if (sku) {
        this.createTimelineEvent({
          skuId: metric.skuId,
          type: "anomaly_detected",
          title: "Anomaly Detected",
          description: `${sku.name} (${sku.region}) - Behavioral Metric Anomaly`,
          data: {
            details: "Significant change detected in behavioral metrics. Investigate potential causes.",
            metricId: id
          }
        });
      }
    }
    
    return updatedMetric;
  }

  async detectAnomalies(thresholdPercentage: number): Promise<BehavioralMetric[]> {
    const anomalies: BehavioralMetric[] = [];
    const skus = await this.getSKUs();
    
    for (const sku of skus) {
      const metrics = await this.getBehavioralMetricsBySkuId(sku.id);
      if (metrics.length < 2) continue;
      
      // Sort by date in descending order
      metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      const current = metrics[0];
      const previous = metrics[1];
      
      // Check for anomalies in each metric
      const pageViewsChange = ((current.pageViews - previous.pageViews) / previous.pageViews) * 100;
      const addToCartChange = ((current.addToCart - previous.addToCart) / previous.addToCart) * 100;
      const reviewVolumeChange = ((current.reviewVolume - previous.reviewVolume) / previous.reviewVolume) * 100;
      const ratingChange = ((current.averageRating - previous.averageRating) / previous.averageRating) * 100;
      
      let updated = false;
      const updatedMetric = { ...current };
      
      if (Math.abs(pageViewsChange) >= thresholdPercentage) {
        updatedMetric.status = "anomaly";
        updated = true;
      }
      
      if (Math.abs(addToCartChange) >= thresholdPercentage) {
        updatedMetric.status = "anomaly";
        updated = true;
      }
      
      if (Math.abs(reviewVolumeChange) >= thresholdPercentage) {
        updatedMetric.status = "anomaly";
        updated = true;
      }
      
      // Rating is more sensitive, so we use a lower threshold
      if (Math.abs(ratingChange) >= thresholdPercentage / 2) {
        updatedMetric.status = "anomaly";
        updated = true;
      }
      
      if (updated) {
        this.behavioralMetrics.set(current.id, updatedMetric);
        anomalies.push(updatedMetric);
      }
    }
    
    return anomalies;
  }

  // Survey methods
  async getSurvey(id: number): Promise<Survey | undefined> {
    return this.surveys.get(id);
  }

  async getSurveysBySkuId(skuId: number): Promise<Survey[]> {
    return Array.from(this.surveys.values()).filter(survey => survey.skuId === skuId);
  }

  async getActiveSurveys(): Promise<Survey[]> {
    return Array.from(this.surveys.values()).filter(survey => survey.status === "active");
  }

  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const id = this.currentSurveyId++;
    const survey: Survey = { 
      ...insertSurvey, 
      id, 
      createdAt: new Date(),
      completedAt: undefined
    };
    this.surveys.set(id, survey);
    
    // Create a timeline event for the new survey
    const sku = this.skus.get(insertSurvey.skuId);
    if (sku) {
      this.createTimelineEvent({
        skuId: insertSurvey.skuId,
        type: "survey_launched",
        title: "Survey Launched",
        description: `${sku.name} (${sku.region}) - ${insertSurvey.title}`,
        data: {
          details: `New survey launched for ${sku.name}. Target audience: ${insertSurvey.audience}. Sample size: ${insertSurvey.sampleSize}.`,
          surveyId: id
        }
      });
    }
    
    return survey;
  }

  async updateSurveyStatus(id: number, status: string): Promise<Survey> {
    const survey = this.surveys.get(id);
    if (!survey) {
      throw new Error(`Survey with id ${id} not found`);
    }
    
    let completedAt = survey.completedAt;
    if (status === "completed" && survey.status !== "completed") {
      completedAt = new Date();
      
      // Create a timeline event for the completed survey
      const sku = this.skus.get(survey.skuId);
      if (sku) {
        this.createTimelineEvent({
          skuId: survey.skuId,
          type: "survey_completed",
          title: "Survey Results Available",
          description: `${sku.name} (${sku.region}) - ${survey.title}`,
          data: {
            details: "Survey has been completed. Results are now available for analysis.",
            surveyId: id
          }
        });
      }
    }
    
    const updatedSurvey = { ...survey, status, completedAt };
    this.surveys.set(id, updatedSurvey);
    return updatedSurvey;
  }

  // Brand health metrics methods
  async getBrandHealthMetric(id: number): Promise<BrandHealthMetric | undefined> {
    return this.brandHealthMetrics.get(id);
  }

  async getBrandHealthMetricsBySkuId(skuId: number): Promise<BrandHealthMetric[]> {
    return Array.from(this.brandHealthMetrics.values())
      .filter(metric => metric.skuId === skuId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createBrandHealthMetric(insertMetric: InsertBrandHealthMetric): Promise<BrandHealthMetric> {
    const id = this.currentBrandHealthMetricId++;
    const metric: BrandHealthMetric = { ...insertMetric, id };
    this.brandHealthMetrics.set(id, metric);
    return metric;
  }

  // Timeline events methods
  async getTimelineEvent(id: number): Promise<TimelineEvent | undefined> {
    return this.timelineEvents.get(id);
  }

  async getTimelineEvents(limit?: number): Promise<TimelineEvent[]> {
    let events = Array.from(this.timelineEvents.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (limit) {
      events = events.slice(0, limit);
    }
    
    return events;
  }

  async getTimelineEventsBySkuId(skuId: number): Promise<TimelineEvent[]> {
    return Array.from(this.timelineEvents.values())
      .filter(event => event.skuId === skuId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createTimelineEvent(insertEvent: InsertTimelineEvent): Promise<TimelineEvent> {
    const id = this.currentTimelineEventId++;
    const event: TimelineEvent = { 
      ...insertEvent, 
      id, 
      timestamp: new Date() 
    };
    this.timelineEvents.set(id, event);
    return event;
  }

  // Anomaly settings methods
  async getAnomalySetting(id: number): Promise<AnomalySetting | undefined> {
    return this.anomalySettings.get(id);
  }

  async getAnomalySettings(): Promise<AnomalySetting[]> {
    return Array.from(this.anomalySettings.values());
  }

  async getAnomalySettingByMetricType(metricType: string): Promise<AnomalySetting | undefined> {
    return Array.from(this.anomalySettings.values()).find(setting => setting.metricType === metricType);
  }

  async createAnomalySetting(insertSetting: InsertAnomalySetting): Promise<AnomalySetting> {
    const id = this.currentAnomalySettingId++;
    const setting: AnomalySetting = { ...insertSetting, id };
    this.anomalySettings.set(id, setting);
    return setting;
  }

  async updateAnomalySetting(id: number, partialSetting: Partial<AnomalySetting>): Promise<AnomalySetting> {
    const setting = this.anomalySettings.get(id);
    if (!setting) {
      throw new Error(`Anomaly setting with id ${id} not found`);
    }
    
    const updatedSetting = { ...setting, ...partialSetting };
    this.anomalySettings.set(id, updatedSetting);
    return updatedSetting;
  }

  // Question template methods
  async getQuestionTemplate(id: number): Promise<QuestionTemplate | undefined> {
    return this.questionTemplates.get(id);
  }

  async getQuestionTemplatesByCategory(category: string): Promise<QuestionTemplate[]> {
    return Array.from(this.questionTemplates.values()).filter(template => template.category === category);
  }

  async createQuestionTemplate(insertTemplate: InsertQuestionTemplate): Promise<QuestionTemplate> {
    const id = this.currentQuestionTemplateId++;
    const template: QuestionTemplate = { ...insertTemplate, id };
    this.questionTemplates.set(id, template);
    return template;
  }
}

export const storage = new MemStorage();
