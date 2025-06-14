import {
  type User, type InsertUser, type SKU, type InsertSKU,
  type BehavioralMetric, type InsertBehavioralMetric,
  type ValidationSurvey, type InsertValidationSurvey, 
  type BrandHealthMetric, type InsertBrandHealthMetric,
  type TimelineEvent, type InsertTimelineEvent,
  type AnomalySetting, type InsertAnomalySetting,
  type QuestionTemplate, type InsertQuestionTemplate,
  type LaunchPhase, type InsertLaunchPhase,
  type SuccessThreshold, type InsertSuccessThreshold,
  type MicroSurvey, type InsertMicroSurvey,
  type MicroSurveyResponse, type InsertMicroSurveyResponse,
  type SocialListeningData, type InsertSocialListeningData,
  type LaunchIntervention, type InsertLaunchIntervention,
  type AppliedIntervention, type InsertAppliedIntervention,
  type CreditTransaction, type InsertCreditTransaction
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
  getNewLaunchSKUs(): Promise<SKU[]>;
  createSKU(sku: InsertSKU): Promise<SKU>;
  updateSKU(id: number, sku: Partial<InsertSKU>): Promise<SKU>;
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

  // Launch phase methods
  getLaunchPhase(id: number): Promise<LaunchPhase | undefined>;
  getLaunchPhases(): Promise<LaunchPhase[]>;
  createLaunchPhase(phase: InsertLaunchPhase): Promise<LaunchPhase>;

  // Success threshold methods
  getSuccessThreshold(id: number): Promise<SuccessThreshold | undefined>;
  getSuccessThresholdsBySkuId(skuId: number): Promise<SuccessThreshold[]>;
  getSuccessThresholdsByPhaseId(phaseId: number): Promise<SuccessThreshold[]>;
  createSuccessThreshold(threshold: InsertSuccessThreshold): Promise<SuccessThreshold>;
  updateSuccessThreshold(id: number, threshold: Partial<SuccessThreshold>): Promise<SuccessThreshold>;

  // Micro-survey methods
  getMicroSurvey(id: number): Promise<MicroSurvey | undefined>;
  getMicroSurveysBySkuId(skuId: number): Promise<MicroSurvey[]>;
  getActiveMicroSurveys(): Promise<MicroSurvey[]>;
  createMicroSurvey(survey: InsertMicroSurvey): Promise<MicroSurvey>;
  updateMicroSurveyStatus(id: number, isActive: boolean): Promise<MicroSurvey>;

  // Micro-survey response methods
  getMicroSurveyResponses(surveyId: number): Promise<MicroSurveyResponse[]>;
  createMicroSurveyResponse(response: InsertMicroSurveyResponse): Promise<MicroSurveyResponse>;

  // Social listening methods
  getSocialListeningData(id: number): Promise<SocialListeningData | undefined>;
  getSocialListeningDataBySkuId(skuId: number): Promise<SocialListeningData[]>;
  createSocialListeningData(data: InsertSocialListeningData): Promise<SocialListeningData>;

  // Launch intervention methods
  getLaunchIntervention(id: number): Promise<LaunchIntervention | undefined>;
  getLaunchInterventions(): Promise<LaunchIntervention[]>;
  getLaunchInterventionsByCategory(category: string): Promise<LaunchIntervention[]>;
  createLaunchIntervention(intervention: InsertLaunchIntervention): Promise<LaunchIntervention>;

  // Applied intervention methods
  getAppliedIntervention(id: number): Promise<AppliedIntervention | undefined>;
  getAppliedInterventionsBySkuId(skuId: number): Promise<AppliedIntervention[]>;
  createAppliedIntervention(intervention: InsertAppliedIntervention): Promise<AppliedIntervention>;
  updateAppliedInterventionStatus(id: number, status: string): Promise<AppliedIntervention>;

  // Credits tracking methods
  updateUserCredits(userId: number, amount: number, type: "purchase" | "usage" | "refund"): Promise<User>;
  createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  getCreditTransactionsByUserId(userId: number): Promise<CreditTransaction[]>;
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
  private launchPhases: Map<number, LaunchPhase>;
  private successThresholds: Map<number, SuccessThreshold>;
  private microSurveys: Map<number, MicroSurvey>;
  private microSurveyResponses: Map<number, MicroSurveyResponse>;
  private socialListeningData: Map<number, SocialListeningData>;
  private launchInterventions: Map<number, LaunchIntervention>;
  private appliedInterventions: Map<number, AppliedIntervention>;
  private creditTransactions: Map<number, CreditTransaction>;
  
  private currentUserId: number;
  private currentSkuId: number;
  private currentBehavioralMetricId: number;
  private currentSurveyId: number;
  private currentBrandHealthMetricId: number;
  private currentTimelineEventId: number;
  private currentAnomalySettingId: number;
  private currentQuestionTemplateId: number;
  private currentLaunchPhaseId: number;
  private currentSuccessThresholdId: number;
  private currentMicroSurveyId: number;
  private currentMicroSurveyResponseId: number;
  private currentSocialListeningDataId: number;
  private currentLaunchInterventionId: number;
  private currentAppliedInterventionId: number;
  private currentCreditTransactionId: number;

  constructor() {
    this.users = new Map();
    this.skus = new Map();
    this.behavioralMetrics = new Map();
    this.surveys = new Map();
    this.brandHealthMetrics = new Map();
    this.timelineEvents = new Map();
    this.anomalySettings = new Map();
    this.questionTemplates = new Map();
    this.launchPhases = new Map();
    this.successThresholds = new Map();
    this.microSurveys = new Map();
    this.microSurveyResponses = new Map();
    this.socialListeningData = new Map();
    this.launchInterventions = new Map();
    this.appliedInterventions = new Map();
    this.creditTransactions = new Map();
    
    this.currentUserId = 1;
    this.currentSkuId = 1;
    this.currentBehavioralMetricId = 1;
    this.currentSurveyId = 1;
    this.currentBrandHealthMetricId = 1;
    this.currentTimelineEventId = 1;
    this.currentAnomalySettingId = 1;
    this.currentQuestionTemplateId = 1;
    this.currentLaunchPhaseId = 1;
    this.currentSuccessThresholdId = 1;
    this.currentMicroSurveyId = 1;
    this.currentMicroSurveyResponseId = 1;
    this.currentSocialListeningDataId = 1;
    this.currentLaunchInterventionId = 1;
    this.currentAppliedInterventionId = 1;
    this.currentCreditTransactionId = 1;
    
    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Create default launch phases
    const phasePre = this.createLaunchPhase({
      name: "Pre-Launch",
      description: "30 days before launch - preparation and anticipation",
      daysFromLaunch: -30,
      order: 1
    });
    
    const phaseWeek1 = this.createLaunchPhase({
      name: "Week 1",
      description: "1-7 days after launch - initial reception and visibility",
      daysFromLaunch: 1,
      order: 2
    });
    
    const phaseWeek2 = this.createLaunchPhase({
      name: "Week 2-4",
      description: "8-30 days after launch - early adoption and momentum building",
      daysFromLaunch: 8,
      order: 3
    });
    
    const phaseMonth2 = this.createLaunchPhase({
      name: "Month 2-3",
      description: "31-90 days after launch - sustained growth and market establishment",
      daysFromLaunch: 31,
      order: 4
    });
    
    // Create default launch interventions
    this.createLaunchIntervention({
      name: "Price Promotion",
      description: "Temporary price reduction to stimulate trial and purchase",
      category: "pricing",
      interventionType: "discount",
      targetMetrics: ["add_to_cart", "page_views"],
      implementationSteps: [
        "Set promotional price in retail systems",
        "Update product detail pages to highlight discount",
        "Add promotional banners to relevant pages"
      ],
      expectedImpact: "20-30% increase in add-to-cart rate, 10-15% increase in page views"
    });
    
    this.createLaunchIntervention({
      name: "Enhanced Product Visibility",
      description: "Increase product visibility through category placement and featured spots",
      category: "merchandising",
      interventionType: "visibility",
      targetMetrics: ["page_views"],
      implementationSteps: [
        "Secure premium shelf placement",
        "Negotiate featured spot on retailer homepage",
        "Add end-cap displays in physical retail"
      ],
      expectedImpact: "25-40% increase in page views, 15-25% increase in overall sales"
    });
    
    // Create default users
    this.createUser({
      username: "brand_manager",
      password: "password123",
      fullName: "Sam Johnson",
      role: "brand_manager",
      avatar: null
    });

    this.createUser({
      username: "insights_lead",
      password: "password123",
      fullName: "Emily Wilson",
      role: "regional_insights",
      avatar: null
    });

    this.createUser({
      username: "marketing_ops",
      password: "password123",
      fullName: "Alex Chen",
      role: "global_marketing",
      avatar: null
    });

    // Initialize with credits for demo purposes
    this.users.set(1, {
      ...this.users.get(1)!,
      credits: 500,
      totalCreditsEarned: 1000,
      lastPaymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    });

    this.users.set(2, {
      ...this.users.get(2)!,
      credits: 250,
      totalCreditsEarned: 500,
      lastPaymentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
    });

    this.users.set(3, {
      ...this.users.get(3)!,
      credits: 750,
      totalCreditsEarned: 1500,
      lastPaymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
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
    
    // Create new launch SKUs with launch dates
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    const kitkatCaramel = this.createSKU({
      name: "KitKat Caramel",
      brand: "Nestlé",
      region: "UK",
      market: "Amazon",
      launchDate: twoWeeksAgo,
      isNewLaunch: true,
      category: "Confectionery"
    });
    
    const nesquikStrawberry = this.createSKU({
      name: "Nesquik Strawberry",
      brand: "Nestlé",
      region: "US",
      market: "Walmart",
      launchDate: twoWeeksAgo,
      isNewLaunch: true,
      category: "Beverages"
    });
    
    // Recently launched 
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    
    const nescafeMatcha = this.createSKU({
      name: "Nescafé Matcha Latte",
      brand: "Nestlé",
      region: "Japan",
      market: "Amazon",
      launchDate: threeDaysAgo,
      isNewLaunch: true,
      category: "Coffee"
    });

    // Create behavioral metrics data for the new launch products
    this.createBehavioralMetric({
      skuId: kitkatCaramel.id,
      date: twoWeeksAgo,
      pageViews: 12500,
      addToCart: 1800,
      reviewVolume: 120,
      averageRating: 4.2,
      status: "normal"
    });
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    this.createBehavioralMetric({
      skuId: kitkatCaramel.id,
      date: oneWeekAgo,
      pageViews: 18700,
      addToCart: 2400,
      reviewVolume: 280,
      averageRating: 4.3,
      status: "normal"
    });
    
    this.createBehavioralMetric({
      skuId: kitkatCaramel.id,
      date: today,
      pageViews: 22300,
      addToCart: 3200,
      reviewVolume: 320,
      averageRating: 4.4,
      status: "normal"
    });
    
    // Add metrics for the Nesquik Strawberry
    this.createBehavioralMetric({
      skuId: nesquikStrawberry.id,
      date: twoWeeksAgo,
      pageViews: 8300,
      addToCart: 950,
      reviewVolume: 65,
      averageRating: 3.9,
      status: "watch"
    });
    
    this.createBehavioralMetric({
      skuId: nesquikStrawberry.id,
      date: oneWeekAgo,
      pageViews: 10200,
      addToCart: 1250,
      reviewVolume: 130,
      averageRating: 4.1,
      status: "normal"
    });
    
    this.createBehavioralMetric({
      skuId: nesquikStrawberry.id,
      date: today,
      pageViews: 11800,
      addToCart: 1580,
      reviewVolume: 185,
      averageRating: 4.2,
      status: "normal"
    });
    
    // Add metrics for recently launched Nescafe Matcha Latte
    this.createBehavioralMetric({
      skuId: nescafeMatcha.id,
      date: threeDaysAgo,
      pageViews: 15600,
      addToCart: 1350,
      reviewVolume: 45,
      averageRating: 4.0,
      status: "normal"
    });
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    this.createBehavioralMetric({
      skuId: nescafeMatcha.id,
      date: yesterday,
      pageViews: 12400,
      addToCart: 980,
      reviewVolume: 85,
      averageRating: 3.8,
      status: "watch"
    });
    
    this.createBehavioralMetric({
      skuId: nescafeMatcha.id,
      date: today,
      pageViews: 10800,
      addToCart: 820,
      reviewVolume: 110,
      averageRating: 3.7,
      status: "anomaly"
    });
    
    // Create default behavioral metrics for the existing SKUs
    for (const sku of [kitkat, nescafe, nesquik, pureLife]) {
      // Create metrics for last 30 days (to have more comprehensive data)
      const today = new Date();
      
      // Set up baseline metrics for each SKU with distinct patterns
      const baselineMetrics = {
        kitkat: {
          pageViews: 25000,
          addToCart: 3500,
          reviewVolume: 850,
          rating: 4.3,
          // Create campaign spike periods
          campaignSpikes: [
            { startDay: 20, endDay: 24, pageViewsMultiplier: 1.45, addToCartMultiplier: 1.35 },
            { startDay: 5, endDay: 9, pageViewsMultiplier: 1.30, addToCartMultiplier: 1.25 }
          ],
          // Create anomalies or watch points
          anomalies: [
            { day: 2, metric: "addToCart", multiplier: 0.675, status: "anomaly" },
            { day: 0, metric: "rating", value: 3.9, status: "watch" },
            { day: 4, metric: "pageViews", multiplier: 0.55, status: "anomaly" },
            { day: 5, metric: "reviewVolume", multiplier: 2.1, status: "watch" }
          ]
        },
        nescafe: {
          pageViews: 18000,
          addToCart: 2200,
          reviewVolume: 600,
          rating: 4.5,
          campaignSpikes: [
            { startDay: 15, endDay: 19, pageViewsMultiplier: 1.40, addToCartMultiplier: 1.25 }
          ],
          anomalies: [
            { day: 8, metric: "reviewVolume", multiplier: 1.65, status: "watch" },
            { day: 3, metric: "addToCart", multiplier: 0.62, status: "anomaly" },
            { day: 6, metric: "pageViews", multiplier: 0.78, status: "watch" }
          ]
        },
        nesquik: {
          pageViews: 12000,
          addToCart: 1500,
          reviewVolume: 400,
          rating: 4.1,
          campaignSpikes: [
            { startDay: 10, endDay: 14, pageViewsMultiplier: 1.35, addToCartMultiplier: 1.20 }
          ],
          anomalies: []
        },
        pureLife: {
          pageViews: 8000,
          addToCart: 1000,
          reviewVolume: 200,
          rating: 4.0,
          campaignSpikes: [
            { startDay: 25, endDay: 29, pageViewsMultiplier: 1.25, addToCartMultiplier: 1.15 }
          ],
          anomalies: []
        }
      };
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Get the appropriate baseline for this SKU
        const baseline = sku.id === kitkat.id 
          ? baselineMetrics.kitkat 
          : (sku.id === nescafe.id 
              ? baselineMetrics.nescafe 
              : (sku.id === nesquik.id 
                  ? baselineMetrics.nesquik 
                  : baselineMetrics.pureLife));
        
        // Start with baseline values
        let pageViews = baseline.pageViews;
        let addToCart = baseline.addToCart;
        let reviewVolume = baseline.reviewVolume;
        let averageRating = baseline.rating;
        let status = "normal";
        
        // Apply weekly pattern (weekend dips)
        const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          pageViews = Math.round(pageViews * 0.85);
          addToCart = Math.round(addToCart * 0.80);
        }
        
        // Apply slight upward trend over time (1% growth per week)
        const weekMultiplier = 1 + ((29 - i) / 7) * 0.01;
        pageViews = Math.round(pageViews * weekMultiplier);
        addToCart = Math.round(addToCart * weekMultiplier);
        reviewVolume = Math.round(reviewVolume * weekMultiplier);
        
        // Apply campaign spikes if applicable
        const campaignSpike = baseline.campaignSpikes.find(
          spike => i <= spike.endDay && i >= spike.startDay
        );
        
        if (campaignSpike) {
          pageViews = Math.round(pageViews * campaignSpike.pageViewsMultiplier);
          addToCart = Math.round(addToCart * campaignSpike.addToCartMultiplier);
        }
        
        // Apply day-to-day random variation
        const randomFactor = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
        pageViews = Math.round(pageViews * randomFactor);
        addToCart = Math.round(addToCart * randomFactor);
        reviewVolume = Math.round(reviewVolume * randomFactor);
        averageRating = Math.min(5, Math.max(1, averageRating * (0.98 + Math.random() * 0.04)));
        
        // Apply specific anomalies if applicable
        const anomaly = baseline.anomalies.find(
          a => a.day === i
        );
        
        if (anomaly) {
          if (anomaly.metric === "pageViews") {
            pageViews = Math.round(pageViews * (anomaly.multiplier || 1));
          } else if (anomaly.metric === "addToCart") {
            addToCart = Math.round(addToCart * (anomaly.multiplier || 1));
          } else if (anomaly.metric === "reviewVolume") {
            reviewVolume = Math.round(reviewVolume * (anomaly.multiplier || 1));
          } else if (anomaly.metric === "rating") {
            averageRating = anomaly.value || averageRating;
          }
          
          status = anomaly.status || status;
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

    // Add success thresholds for the new products
    // KitKat Caramel thresholds for Week 2-4 phase
    const week2to4Phase = this.launchPhases.get(3);
    if (week2to4Phase) {
      this.createSuccessThreshold({
        skuId: kitkatCaramel.id,
        phaseId: week2to4Phase.id,
        metricType: "page_views",
        targetValue: 20000,
        minimumValue: 15000,
        idealValue: 25000
      });
      
      this.createSuccessThreshold({
        skuId: kitkatCaramel.id,
        phaseId: week2to4Phase.id,
        metricType: "add_to_cart",
        targetValue: 3000,
        minimumValue: 2200,
        idealValue: 3800
      });
      
      this.createSuccessThreshold({
        skuId: kitkatCaramel.id,
        phaseId: week2to4Phase.id,
        metricType: "average_rating",
        targetValue: 4.2,
        minimumValue: 3.8,
        idealValue: 4.5
      });
    }
    
    // Nesquik Strawberry thresholds
    this.createSuccessThreshold({
      skuId: nesquikStrawberry.id,
      phaseId: week2to4Phase ? week2to4Phase.id : 3,
      metricType: "page_views",
      targetValue: 15000,
      minimumValue: 10000,
      idealValue: 18000
    });
    
    this.createSuccessThreshold({
      skuId: nesquikStrawberry.id,
      phaseId: week2to4Phase ? week2to4Phase.id : 3,
      metricType: "add_to_cart",
      targetValue: 1800,
      minimumValue: 1200,
      idealValue: 2200
    });
    
    // Nescafe Matcha Latte thresholds for Week 1
    const week1Phase = this.launchPhases.get(2);
    if (week1Phase) {
      this.createSuccessThreshold({
        skuId: nescafeMatcha.id,
        phaseId: week1Phase.id,
        metricType: "page_views",
        targetValue: 18000,
        minimumValue: 12000,
        idealValue: 22000
      });
      
      this.createSuccessThreshold({
        skuId: nescafeMatcha.id,
        phaseId: week1Phase.id,
        metricType: "add_to_cart",
        targetValue: 1500,
        minimumValue: 1000,
        idealValue: 2000
      });
      
      this.createSuccessThreshold({
        skuId: nescafeMatcha.id,
        phaseId: week1Phase.id,
        metricType: "average_rating",
        targetValue: 4.2,
        minimumValue: 3.9,
        idealValue: 4.5
      });
    }
    
    // Add brand health metrics for new products
    this.createBrandHealthMetric({
      skuId: kitkatCaramel.id,
      date: today,
      brandLiftScore: 68.5,
      purchaseIntent: 59.2,
      netSentiment: 38
    });
    
    this.createBrandHealthMetric({
      skuId: nesquikStrawberry.id,
      date: today,
      brandLiftScore: 62.3,
      purchaseIntent: 54.8,
      netSentiment: 32
    });
    
    this.createBrandHealthMetric({
      skuId: nescafeMatcha.id,
      date: today,
      brandLiftScore: 57.9,
      purchaseIntent: 52.4,
      netSentiment: 25
    });
    
    // Create default brand health metrics for existing products
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
    
    // Add timeline events for new launch products
    this.createTimelineEvent({
      skuId: kitkatCaramel.id,
      type: "product_launched",
      title: "Product Launch",
      description: "KitKat Caramel launched in UK",
      data: {
        details: "Official launch on Amazon UK platform. Initial metrics show strong consumer interest."
      }
    });
    
    this.createTimelineEvent({
      skuId: kitkatCaramel.id,
      type: "forecast_update",
      title: "Forecast Updated",
      description: "KitKat Caramel - Forecast Update",
      data: {
        details: "First week performance indicates 120% achievement vs launch targets.",
        reportUrl: "/reports/kitkat-caramel-forecast"
      }
    });
    
    this.createTimelineEvent({
      skuId: nesquikStrawberry.id,
      type: "product_launched",
      title: "Product Launch",
      description: "Nesquik Strawberry launched in US",
      data: {
        details: "Official launch on Walmart US platform. Initial performance meeting expectations."
      }
    });
    
    this.createTimelineEvent({
      skuId: nesquikStrawberry.id,
      type: "anomaly_detected",
      title: "Anomaly Detected - Low Rating",
      description: "Nesquik Strawberry - Initial Rating Below Target",
      data: {
        details: "Initial product ratings are below threshold at 3.9 stars. Monitoring required.",
        metricId: 9
      }
    });
    
    this.createTimelineEvent({
      skuId: nescafeMatcha.id,
      type: "product_launched",
      title: "Product Launch",
      description: "Nescafé Matcha Latte launched in Japan",
      data: {
        details: "Official launch on Amazon Japan platform. Targeting specialty coffee consumers."
      }
    });
    
    this.createTimelineEvent({
      skuId: nescafeMatcha.id,
      type: "anomaly_detected",
      title: "Anomaly Detected - Performance Drop",
      description: "Nescafé Matcha Latte - Performance Drop",
      data: {
        details: "26% drop in page views and 18% drop in add-to-cart rate in the last 24 hours.",
        metricId: 12
      }
    });
    
    // Create applied interventions for the new launch products with issues
    this.createAppliedIntervention({
      skuId: nesquikStrawberry.id,
      interventionId: 1, // Price Promotion
      status: "active",
      startDate: oneWeekAgo,
      endDate: null,
      notes: "10% discount applied to increase trial rate and improve initial ratings",
      results: {
        impactMetrics: {
          beforePeriod: {
            pageViews: 8300,
            addToCart: 950
          },
          afterPeriod: {
            pageViews: 10200,
            addToCart: 1250
          },
          percentChange: {
            pageViews: 22.9,
            addToCart: 31.6
          }
        }
      }
    });
    
    // Create an intervention recommendation for the product with anomaly
    this.createAppliedIntervention({
      skuId: nescafeMatcha.id,
      interventionId: 2, // Enhanced Product Visibility
      status: "recommended",
      startDate: today,
      endDate: null,
      notes: "Recommended to improve visibility due to sudden drop in performance metrics",
      results: null
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

  async getNewLaunchSKUs(): Promise<SKU[]> {
    return Array.from(this.skus.values()).filter(sku => sku.isNewLaunch === true);
  }

  async createSKU(insertSKU: InsertSKU): Promise<SKU> {
    const id = this.currentSkuId++;
    const sku: SKU = { 
      ...insertSKU, 
      id, 
      launchDate: insertSKU.launchDate || null,
      isNewLaunch: insertSKU.isNewLaunch || false,
      category: insertSKU.category || null,
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

  async updateSKU(id: number, updateData: Partial<InsertSKU>): Promise<SKU> {
    const existingSKU = await this.getSKU(id);
    
    if (!existingSKU) {
      throw new Error(`SKU with ID ${id} not found`);
    }
    
    const updatedSKU: SKU = {
      ...existingSKU,
      ...updateData,
      id: existingSKU.id,
      createdAt: existingSKU.createdAt
    };
    
    this.skus.set(id, updatedSKU);
    return updatedSKU;
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
  
  // Launch phase methods
  async getLaunchPhase(id: number): Promise<LaunchPhase | undefined> {
    return this.launchPhases.get(id);
  }
  
  async getLaunchPhases(): Promise<LaunchPhase[]> {
    return Array.from(this.launchPhases.values());
  }
  
  async createLaunchPhase(insertPhase: InsertLaunchPhase): Promise<LaunchPhase> {
    const id = this.currentLaunchPhaseId++;
    const phase: LaunchPhase = { ...insertPhase, id };
    this.launchPhases.set(id, phase);
    return phase;
  }
  
  // Success threshold methods
  async getSuccessThreshold(id: number): Promise<SuccessThreshold | undefined> {
    return this.successThresholds.get(id);
  }
  
  async getSuccessThresholdsBySkuId(skuId: number): Promise<SuccessThreshold[]> {
    return Array.from(this.successThresholds.values()).filter(threshold => threshold.skuId === skuId);
  }
  
  async getSuccessThresholdsByPhaseId(phaseId: number): Promise<SuccessThreshold[]> {
    return Array.from(this.successThresholds.values()).filter(threshold => threshold.phaseId === phaseId);
  }
  
  async createSuccessThreshold(insertThreshold: InsertSuccessThreshold): Promise<SuccessThreshold> {
    const id = this.currentSuccessThresholdId++;
    const threshold: SuccessThreshold = { ...insertThreshold, id };
    this.successThresholds.set(id, threshold);
    return threshold;
  }
  
  async updateSuccessThreshold(id: number, thresholdData: Partial<SuccessThreshold>): Promise<SuccessThreshold> {
    const existingThreshold = await this.getSuccessThreshold(id);
    
    if (!existingThreshold) {
      throw new Error(`Success threshold with ID ${id} not found`);
    }
    
    const updatedThreshold: SuccessThreshold = {
      ...existingThreshold,
      ...thresholdData,
      id: existingThreshold.id
    };
    
    this.successThresholds.set(id, updatedThreshold);
    return updatedThreshold;
  }
  
  // Micro-survey methods
  async getMicroSurvey(id: number): Promise<MicroSurvey | undefined> {
    return this.microSurveys.get(id);
  }
  
  async getMicroSurveysBySkuId(skuId: number): Promise<MicroSurvey[]> {
    return Array.from(this.microSurveys.values()).filter(survey => survey.skuId === skuId);
  }
  
  async getActiveMicroSurveys(): Promise<MicroSurvey[]> {
    return Array.from(this.microSurveys.values()).filter(survey => survey.isActive === true);
  }
  
  async createMicroSurvey(insertSurvey: InsertMicroSurvey): Promise<MicroSurvey> {
    const id = this.currentMicroSurveyId++;
    const survey: MicroSurvey = { 
      ...insertSurvey, 
      id,
      createdAt: new Date()
    };
    this.microSurveys.set(id, survey);
    
    // Create a timeline event for the new micro-survey
    const sku = this.skus.get(insertSurvey.skuId);
    if (sku) {
      this.createTimelineEvent({
        skuId: insertSurvey.skuId,
        type: "micro_survey_created",
        title: "Micro-Survey Deployed",
        description: `${sku.name} (${sku.region}) - ${insertSurvey.question}`,
        data: {
          details: `Micro-survey deployed for ${sku.name}. Targeting: ${insertSurvey.target}.`,
          microSurveyId: id
        }
      });
    }
    
    return survey;
  }
  
  async updateMicroSurveyStatus(id: number, isActive: boolean): Promise<MicroSurvey> {
    const survey = this.microSurveys.get(id);
    if (!survey) {
      throw new Error(`Micro-survey with id ${id} not found`);
    }
    
    const updatedSurvey = { ...survey, isActive };
    this.microSurveys.set(id, updatedSurvey);
    
    // Create a timeline event if the survey was deactivated
    if (!isActive && survey.isActive) {
      const sku = this.skus.get(survey.skuId);
      if (sku) {
        this.createTimelineEvent({
          skuId: survey.skuId,
          type: "micro_survey_completed",
          title: "Micro-Survey Completed",
          description: `${sku.name} (${sku.region}) - ${survey.question}`,
          data: {
            details: "Micro-survey has been completed. Results are now available for analysis.",
            microSurveyId: id
          }
        });
      }
    }
    
    return updatedSurvey;
  }
  
  // Micro-survey response methods
  async getMicroSurveyResponses(surveyId: number): Promise<MicroSurveyResponse[]> {
    return Array.from(this.microSurveyResponses.values())
      .filter(response => response.surveyId === surveyId);
  }
  
  async createMicroSurveyResponse(insertResponse: InsertMicroSurveyResponse): Promise<MicroSurveyResponse> {
    const id = this.currentMicroSurveyResponseId++;
    const response: MicroSurveyResponse = { 
      ...insertResponse, 
      id,
      timestamp: new Date() 
    };
    this.microSurveyResponses.set(id, response);
    return response;
  }
  
  // Social listening methods
  async getSocialListeningData(id: number): Promise<SocialListeningData | undefined> {
    return this.socialListeningData.get(id);
  }
  
  async getSocialListeningDataBySkuId(skuId: number): Promise<SocialListeningData[]> {
    return Array.from(this.socialListeningData.values())
      .filter(data => data.skuId === skuId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createSocialListeningData(insertData: InsertSocialListeningData): Promise<SocialListeningData> {
    const id = this.currentSocialListeningDataId++;
    const data: SocialListeningData = { 
      ...insertData, 
      id,
      timestamp: new Date() 
    };
    this.socialListeningData.set(id, data);
    
    // Create a timeline event if sentiment is significantly negative
    if (data.sentiment < -25) {
      const sku = this.skus.get(data.skuId);
      if (sku) {
        this.createTimelineEvent({
          skuId: data.skuId,
          type: "negative_sentiment",
          title: "Negative Social Sentiment Alert",
          description: `${sku.name} (${sku.region}) - Social Listening Alert`,
          data: {
            details: `Significant negative sentiment detected in social media conversations about ${sku.name}. Source: ${data.source}. Sentiment score: ${data.sentiment}.`,
            socialListeningDataId: id
          }
        });
      }
    }
    
    return data;
  }
  
  // Launch intervention methods
  async getLaunchIntervention(id: number): Promise<LaunchIntervention | undefined> {
    return this.launchInterventions.get(id);
  }
  
  async getLaunchInterventions(): Promise<LaunchIntervention[]> {
    return Array.from(this.launchInterventions.values());
  }
  
  async getLaunchInterventionsByCategory(category: string): Promise<LaunchIntervention[]> {
    return Array.from(this.launchInterventions.values())
      .filter(intervention => intervention.category === category);
  }
  
  async createLaunchIntervention(insertIntervention: InsertLaunchIntervention): Promise<LaunchIntervention> {
    const id = this.currentLaunchInterventionId++;
    const intervention: LaunchIntervention = { ...insertIntervention, id };
    this.launchInterventions.set(id, intervention);
    return intervention;
  }
  
  // Applied intervention methods
  async getAppliedIntervention(id: number): Promise<AppliedIntervention | undefined> {
    return this.appliedInterventions.get(id);
  }
  
  async getAppliedInterventionsBySkuId(skuId: number): Promise<AppliedIntervention[]> {
    return Array.from(this.appliedInterventions.values())
      .filter(intervention => intervention.skuId === skuId)
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  }
  
  async createAppliedIntervention(insertIntervention: InsertAppliedIntervention): Promise<AppliedIntervention> {
    const id = this.currentAppliedInterventionId++;
    const intervention: AppliedIntervention = { 
      ...insertIntervention, 
      id,
      appliedDate: new Date(),
      status: "pending"
    };
    this.appliedInterventions.set(id, intervention);
    
    // Create a timeline event for the new intervention
    const sku = this.skus.get(insertIntervention.skuId);
    if (sku) {
      this.createTimelineEvent({
        skuId: insertIntervention.skuId,
        type: "intervention_applied",
        title: "Launch Intervention Applied",
        description: `${sku.name} (${sku.region}) - ${insertIntervention.name}`,
        data: {
          details: `Intervention has been applied to address issues with ${sku.name}. Type: ${insertIntervention.interventionType}. Expected impact: ${insertIntervention.expectedImpact}.`,
          appliedInterventionId: id
        }
      });
    }
    
    return intervention;
  }
  
  async updateAppliedInterventionStatus(id: number, status: string): Promise<AppliedIntervention> {
    const intervention = this.appliedInterventions.get(id);
    if (!intervention) {
      throw new Error(`Applied intervention with id ${id} not found`);
    }
    
    const updatedIntervention = { ...intervention, status };
    this.appliedInterventions.set(id, updatedIntervention);
    
    // Create a timeline event if the intervention was completed
    if (status === "completed" && intervention.status !== "completed") {
      const sku = this.skus.get(intervention.skuId);
      if (sku) {
        this.createTimelineEvent({
          skuId: intervention.skuId,
          type: "intervention_completed",
          title: "Intervention Results Available",
          description: `${sku.name} (${sku.region}) - ${intervention.name}`,
          data: {
            details: "Intervention has been completed. Results are now available for analysis.",
            appliedInterventionId: id
          }
        });
      }
    }
    
    return updatedIntervention;
  }

  // Credits tracking methods
  async updateUserCredits(userId: number, amount: number, type: "purchase" | "usage" | "refund"): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    let updatedUser: User;
    if (type === "purchase") {
      updatedUser = {
        ...user,
        credits: (user.credits || 0) + amount,
        totalCreditsEarned: (user.totalCreditsEarned || 0) + amount,
        lastPaymentDate: new Date()
      };
    } else if (type === "usage") {
      updatedUser = {
        ...user,
        credits: Math.max(0, (user.credits || 0) - amount)
      };
    } else { // refund
      updatedUser = {
        ...user,
        credits: (user.credits || 0) + amount
      };
    }

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const newTransaction: CreditTransaction = {
      id: this.currentCreditTransactionId++,
      ...transaction,
      timestamp: new Date()
    };
    
    this.creditTransactions.set(newTransaction.id, newTransaction);
    return newTransaction;
  }

  async getCreditTransactionsByUserId(userId: number): Promise<CreditTransaction[]> {
    return Array.from(this.creditTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
