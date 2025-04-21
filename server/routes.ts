import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertSkuSchema, 
  insertBehavioralMetricSchema,
  insertSurveySchema, 
  insertBrandHealthMetricSchema, 
  insertTimelineEventSchema,
  insertAnomalySettingSchema,
  insertQuestionTemplateSchema
} from "@shared/schema";
import type {
  BehavioralMetric,
  Survey,
  TimelineEvent,
  AnomalySetting,
  QuestionTemplate
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // User routes
  app.get("/api/users", async (req: Request, res: Response) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    const loginSchema = z.object({
      username: z.string(),
      password: z.string()
    });

    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real application, you would use a secure authentication method
      // like JWT tokens and not send the password back to the client
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // SKU routes
  app.get("/api/skus", async (req: Request, res: Response) => {
    const { region, market } = req.query;
    
    let skus;
    if (region && typeof region === 'string') {
      skus = await storage.getSKUsByRegion(region);
    } else if (market && typeof market === 'string') {
      skus = await storage.getSKUsByMarket(market);
    } else {
      skus = await storage.getSKUs();
    }
    
    res.json(skus);
  });

  app.get("/api/skus/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const sku = await storage.getSKU(id);
    if (!sku) {
      return res.status(404).json({ message: "SKU not found" });
    }

    res.json(sku);
  });

  app.post("/api/skus", async (req: Request, res: Response) => {
    try {
      const skuData = insertSkuSchema.parse(req.body);
      const sku = await storage.createSKU(skuData);
      res.status(201).json(sku);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid SKU data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create SKU" });
    }
  });

  app.delete("/api/skus/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const success = await storage.deleteSKU(id);
    if (!success) {
      return res.status(404).json({ message: "SKU not found" });
    }

    res.json({ message: "SKU deleted" });
  });
  
  app.get("/api/launch-radar", async (req: Request, res: Response) => {
    try {
      // Get all new launch SKUs
      const newLaunchSKUs = await storage.getNewLaunchSKUs();
      
      // Build comprehensive data for each new launch SKU
      const launchRadarData = await Promise.all(newLaunchSKUs.map(async (sku) => {
        // Get behavioral metrics for the SKU
        const metrics = await storage.getBehavioralMetricsBySkuId(sku.id);
        
        // Get success thresholds for the SKU
        const thresholds = await storage.getSuccessThresholdsBySkuId(sku.id);
        
        // Get applied interventions for the SKU
        const interventions = await storage.getAppliedInterventionsBySkuId(sku.id);
        
        // Get brand health metrics for the SKU
        const brandHealthMetrics = await storage.getBrandHealthMetricsBySkuId(sku.id);
        
        // Get micro-surveys for the SKU
        const microSurveys = await storage.getMicroSurveysBySkuId(sku.id);
        
        // Get social listening data for the SKU
        const socialListeningData = await storage.getSocialListeningDataBySkuId(sku.id);
        
        // Get latest metrics if available
        const latestMetrics = metrics.length > 0 
          ? metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          : null;
        
        // Get latest brand health metrics if available
        const latestBrandHealth = brandHealthMetrics.length > 0
          ? brandHealthMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          : null;
        
        // Calculate days since launch
        const daysSinceLaunch = sku.launchDate 
          ? Math.floor((new Date().getTime() - new Date(sku.launchDate).getTime()) / (1000 * 60 * 60 * 24))
          : null;
        
        // Determine current launch phase based on days since launch
        const launchPhases = await storage.getLaunchPhases();
        let currentPhase = null;
        
        if (daysSinceLaunch !== null && launchPhases.length > 0) {
          // Sort phases by order
          const sortedPhases = [...launchPhases].sort((a, b) => a.order - b.order);
          
          // Find the phase that matches the current days since launch
          for (let i = sortedPhases.length - 1; i >= 0; i--) {
            if (daysSinceLaunch >= sortedPhases[i].daysFromLaunch) {
              currentPhase = sortedPhases[i];
              break;
            }
          }
          
          // If no phase was found and days since launch is negative, we're in pre-launch
          if (!currentPhase && daysSinceLaunch < 0) {
            currentPhase = sortedPhases.find(phase => phase.daysFromLaunch < 0);
          }
        }
        
        // Get thresholds for current phase if available
        const currentPhaseThresholds = currentPhase
          ? thresholds.filter(t => t.phaseId === currentPhase.id)
          : [];
        
        // Calculate performance against thresholds
        const thresholdPerformance = currentPhaseThresholds.map(threshold => {
          let currentValue = null;
          let status = "unknown";
          
          // Determine the current value based on metric type
          if (latestMetrics) {
            if (threshold.metricType === "page_views") {
              currentValue = latestMetrics.pageViews;
            } else if (threshold.metricType === "add_to_cart") {
              currentValue = latestMetrics.addToCart;
            } else if (threshold.metricType === "review_volume") {
              currentValue = latestMetrics.reviewVolume;
            } else if (threshold.metricType === "average_rating") {
              currentValue = latestMetrics.averageRating;
            }
          }
          
          // Determine status based on threshold levels
          if (currentValue !== null) {
            if (currentValue >= threshold.targetValue) {
              status = "above_target";
            } else if (currentValue >= threshold.minimumAcceptable) {
              status = "acceptable";
            } else if (currentValue >= threshold.criticalThreshold) {
              status = "below_minimum";
            } else {
              status = "critical";
            }
          }
          
          return {
            ...threshold,
            currentValue,
            status,
            percentageOfTarget: currentValue !== null 
              ? parseFloat(((currentValue / threshold.targetValue) * 100).toFixed(1))
              : null
          };
        });
        
        return {
          sku,
          daysSinceLaunch,
          currentPhase,
          latestMetrics,
          latestBrandHealth,
          thresholdPerformance,
          interventions: interventions.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()),
          microSurveys: microSurveys.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
          socialListeningData: socialListeningData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
          hasWarningFlags: thresholdPerformance.some(t => t.status === "below_minimum" || t.status === "critical")
        };
      }));
      
      res.json(launchRadarData);
    } catch (error) {
      console.error("Error fetching launch radar data:", error);
      res.status(500).json({ message: "Failed to fetch launch radar data" });
    }
  });

  // Behavioral metrics routes
  app.get("/api/behavioral-metrics", async (req: Request, res: Response) => {
    const skuId = req.query.skuId ? parseInt(req.query.skuId as string) : undefined;
    const date = req.query.date ? new Date(req.query.date as string) : undefined;
    const timeframe = req.query.timeframe as string || "30days"; // Default to 30 days
    
    let metrics: BehavioralMetric[] = [];
    if (skuId) {
      metrics = await storage.getBehavioralMetricsBySkuId(skuId);
    } else if (date) {
      metrics = await storage.getBehavioralMetricsForDate(date);
    } else {
      // Get all behavioral metrics for the first SKU if none specified
      const allSkus = await storage.getSKUs();
      if (allSkus.length > 0) {
        metrics = await storage.getBehavioralMetricsBySkuId(allSkus[0].id);
      } else {
        metrics = []; // Return empty array if no SKUs exist
      }
    }

    // Calculate aggregated data for better executive insights
    if (metrics.length > 0) {
      // Sort metrics by date (newest first)
      metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Apply timeframe filtering
      let filteredMetrics = metrics;
      if (timeframe) {
        const today = new Date();
        let cutoffDate = new Date();
        
        if (timeframe === "7days") {
          cutoffDate.setDate(today.getDate() - 7);
        } else if (timeframe === "30days") {
          cutoffDate.setDate(today.getDate() - 30);
        } else if (timeframe === "90days") {
          cutoffDate.setDate(today.getDate() - 90);
        }
        
        filteredMetrics = metrics.filter(m => new Date(m.date) >= cutoffDate);
      }
      
      // Calculate totals and averages for the filtered period
      const totals = {
        totalPageViews: filteredMetrics.reduce((sum, m) => sum + m.pageViews, 0),
        totalAddToCart: filteredMetrics.reduce((sum, m) => sum + m.addToCart, 0),
        totalReviewVolume: filteredMetrics.reduce((sum, m) => sum + m.reviewVolume, 0),
        averageRating: parseFloat((filteredMetrics.reduce((sum, m) => sum + m.averageRating, 0) / filteredMetrics.length).toFixed(1)),
        anomalyCount: filteredMetrics.filter(m => m.status === "anomaly").length,
        watchStatusCount: filteredMetrics.filter(m => m.status === "watch").length,
        conversionRate: parseFloat(((filteredMetrics.reduce((sum, m) => sum + m.addToCart, 0) / 
                         filteredMetrics.reduce((sum, m) => sum + m.pageViews, 0)) * 100).toFixed(1)),
      };
      
      // Calculate trends (comparing first half with second half of the period)
      const midpoint = Math.floor(filteredMetrics.length / 2);
      const secondHalf = filteredMetrics.slice(0, midpoint);
      const firstHalf = filteredMetrics.slice(midpoint);
      
      // Only calculate trends if we have enough data
      const trends = {
        pageViewsTrend: 0,
        addToCartTrend: 0,
        reviewVolumeTrend: 0,
        ratingTrend: 0,
        conversionRateTrend: 0
      };
      
      if (firstHalf.length > 0 && secondHalf.length > 0) {
        const firstHalfPageViews = firstHalf.reduce((sum, m) => sum + m.pageViews, 0);
        const secondHalfPageViews = secondHalf.reduce((sum, m) => sum + m.pageViews, 0);
        
        const firstHalfAddToCart = firstHalf.reduce((sum, m) => sum + m.addToCart, 0);
        const secondHalfAddToCart = secondHalf.reduce((sum, m) => sum + m.addToCart, 0);
        
        const firstHalfReviewVolume = firstHalf.reduce((sum, m) => sum + m.reviewVolume, 0);
        const secondHalfReviewVolume = secondHalf.reduce((sum, m) => sum + m.reviewVolume, 0);
        
        const firstHalfRating = firstHalf.reduce((sum, m) => sum + m.averageRating, 0) / firstHalf.length;
        const secondHalfRating = secondHalf.reduce((sum, m) => sum + m.averageRating, 0) / secondHalf.length;
        
        const firstHalfConversion = (firstHalfAddToCart / firstHalfPageViews) * 100;
        const secondHalfConversion = (secondHalfAddToCart / secondHalfPageViews) * 100;
        
        trends.pageViewsTrend = firstHalfPageViews === 0 ? 0 : 
          parseFloat(((secondHalfPageViews - firstHalfPageViews) / firstHalfPageViews * 100).toFixed(1));
        
        trends.addToCartTrend = firstHalfAddToCart === 0 ? 0 : 
          parseFloat(((secondHalfAddToCart - firstHalfAddToCart) / firstHalfAddToCart * 100).toFixed(1));
        
        trends.reviewVolumeTrend = firstHalfReviewVolume === 0 ? 0 : 
          parseFloat(((secondHalfReviewVolume - firstHalfReviewVolume) / firstHalfReviewVolume * 100).toFixed(1));
        
        trends.ratingTrend = firstHalfRating === 0 ? 0 : 
          parseFloat(((secondHalfRating - firstHalfRating) / firstHalfRating * 100).toFixed(1));
        
        trends.conversionRateTrend = firstHalfConversion === 0 ? 0 : 
          parseFloat(((secondHalfConversion - firstHalfConversion) / firstHalfConversion * 100).toFixed(1));
      }
      
      // Add executive insights for C-suite level decision making
      // Get today's metrics and yesterday's metrics for day-over-day comparison
      const metricsToday = filteredMetrics.length > 0 ? filteredMetrics[0] : null;
      const metricsYesterday = filteredMetrics.length > 1 ? filteredMetrics[1] : null;
      
      // Find metrics from 7 days ago for week-over-week comparison
      const metrics7DaysAgo = filteredMetrics.find(m => {
        if (!metricsToday) return false;
        const metricDate = new Date(m.date);
        const todayDate = new Date(metricsToday.date);
        const diffTime = Math.abs(todayDate.getTime() - metricDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 6 && diffDays <= 8; // Allow some flexibility
      });
      
      // Calculate executive insights for day-over-day and week-over-week changes
      const executiveInsights = {
        dailyChange: !metricsToday || !metricsYesterday ? null : {
          pageViews: {
            value: metricsToday.pageViews - metricsYesterday.pageViews,
            percentage: parseFloat((((metricsToday.pageViews - metricsYesterday.pageViews) / metricsYesterday.pageViews) * 100).toFixed(1))
          },
          addToCart: {
            value: metricsToday.addToCart - metricsYesterday.addToCart,
            percentage: parseFloat((((metricsToday.addToCart - metricsYesterday.addToCart) / metricsYesterday.addToCart) * 100).toFixed(1))
          },
          conversionRate: {
            current: parseFloat(((metricsToday.addToCart / metricsToday.pageViews) * 100).toFixed(1)),
            previous: parseFloat(((metricsYesterday.addToCart / metricsYesterday.pageViews) * 100).toFixed(1)),
            change: parseFloat((((metricsToday.addToCart / metricsToday.pageViews) - 
                              (metricsYesterday.addToCart / metricsYesterday.pageViews)) * 100).toFixed(1))
          },
          reviewVolume: {
            value: metricsToday.reviewVolume - metricsYesterday.reviewVolume,
            percentage: parseFloat((((metricsToday.reviewVolume - metricsYesterday.reviewVolume) / metricsYesterday.reviewVolume) * 100).toFixed(1))
          },
          rating: {
            value: parseFloat((metricsToday.averageRating - metricsYesterday.averageRating).toFixed(1)),
            percentage: parseFloat((((metricsToday.averageRating - metricsYesterday.averageRating) / metricsYesterday.averageRating) * 100).toFixed(1))
          }
        },
        weeklyChange: !metricsToday || !metrics7DaysAgo ? null : {
          pageViews: {
            value: metricsToday.pageViews - metrics7DaysAgo.pageViews,
            percentage: parseFloat((((metricsToday.pageViews - metrics7DaysAgo.pageViews) / metrics7DaysAgo.pageViews) * 100).toFixed(1))
          },
          addToCart: {
            value: metricsToday.addToCart - metrics7DaysAgo.addToCart,
            percentage: parseFloat((((metricsToday.addToCart - metrics7DaysAgo.addToCart) / metrics7DaysAgo.addToCart) * 100).toFixed(1))
          },
          conversionRate: {
            current: parseFloat(((metricsToday.addToCart / metricsToday.pageViews) * 100).toFixed(1)),
            previous: parseFloat(((metrics7DaysAgo.addToCart / metrics7DaysAgo.pageViews) * 100).toFixed(1)),
            change: parseFloat((((metricsToday.addToCart / metricsToday.pageViews) - 
                              (metrics7DaysAgo.addToCart / metrics7DaysAgo.pageViews)) * 100).toFixed(1))
          },
          reviewVolume: {
            value: metricsToday.reviewVolume - metrics7DaysAgo.reviewVolume,
            percentage: parseFloat((((metricsToday.reviewVolume - metrics7DaysAgo.reviewVolume) / metrics7DaysAgo.reviewVolume) * 100).toFixed(1))
          },
          rating: {
            value: parseFloat((metricsToday.averageRating - metrics7DaysAgo.averageRating).toFixed(1)),
            percentage: parseFloat((((metricsToday.averageRating - metrics7DaysAgo.averageRating) / metrics7DaysAgo.averageRating) * 100).toFixed(1))
          }
        },
        // Find peak performance days
        peakPerformance: {
          pageViews: {
            value: Math.max(...filteredMetrics.map(m => m.pageViews)),
            date: new Date(filteredMetrics.find(m => m.pageViews === Math.max(...filteredMetrics.map(m => m.pageViews)))?.date || '')
          },
          addToCart: {
            value: Math.max(...filteredMetrics.map(m => m.addToCart)),
            date: new Date(filteredMetrics.find(m => m.addToCart === Math.max(...filteredMetrics.map(m => m.addToCart)))?.date || '')
          },
          conversionRate: (() => {
            const conversionRates = filteredMetrics.map(m => (m.addToCart / m.pageViews) * 100);
            const maxRate = Math.max(...conversionRates);
            const maxRateIndex = conversionRates.findIndex(rate => rate === maxRate);
            return {
              value: parseFloat(maxRate.toFixed(1)),
              date: maxRateIndex >= 0 ? new Date(filteredMetrics[maxRateIndex].date) : new Date()
            };
          })()
        },
        // Summary of anomalies for quick executive review
        anomalyHighlights: filteredMetrics
          .filter(m => m.status === "anomaly")
          .map(m => ({
            date: new Date(m.date),
            metrics: {
              pageViews: m.pageViews,
              addToCart: m.addToCart,
              reviewVolume: m.reviewVolume,
              rating: m.averageRating
            },
            // Calculate percentage difference from 7-day average before the anomaly
            deviation: (() => {
              const anomalyDate = new Date(m.date);
              const weekBeforeMetrics = filteredMetrics.filter(fm => {
                const fmDate = new Date(fm.date);
                const diffTime = anomalyDate.getTime() - fmDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays > 0 && diffDays <= 7;
              });
              
              if (weekBeforeMetrics.length === 0) return null;
              
              const avgPageViews = weekBeforeMetrics.reduce((sum, wm) => sum + wm.pageViews, 0) / weekBeforeMetrics.length;
              const avgAddToCart = weekBeforeMetrics.reduce((sum, wm) => sum + wm.addToCart, 0) / weekBeforeMetrics.length;
              const avgReviewVolume = weekBeforeMetrics.reduce((sum, wm) => sum + wm.reviewVolume, 0) / weekBeforeMetrics.length;
              const avgRating = weekBeforeMetrics.reduce((sum, wm) => sum + wm.averageRating, 0) / weekBeforeMetrics.length;
              
              return {
                pageViews: parseFloat((((m.pageViews - avgPageViews) / avgPageViews) * 100).toFixed(1)),
                addToCart: parseFloat((((m.addToCart - avgAddToCart) / avgAddToCart) * 100).toFixed(1)),
                reviewVolume: parseFloat((((m.reviewVolume - avgReviewVolume) / avgReviewVolume) * 100).toFixed(1)),
                rating: parseFloat((((m.averageRating - avgRating) / avgRating) * 100).toFixed(1))
              };
            })()
          }))
      };
      
      // Return both raw metrics and the enhanced executive summary
      res.json({
        metrics: filteredMetrics,
        summary: {
          timeframe,
          totals,
          trends,
          executiveInsights
        }
      });
    } else {
      res.json({ metrics: [], summary: null });
    }
  });

  app.post("/api/behavioral-metrics", async (req: Request, res: Response) => {
    try {
      const metricData = insertBehavioralMetricSchema.parse(req.body);
      const metric = await storage.createBehavioralMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid metric data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create behavioral metric" });
    }
  });

  app.patch("/api/behavioral-metrics/:id/status", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const statusSchema = z.object({ status: z.string() });
    
    try {
      const { status } = statusSchema.parse(req.body);
      const metric = await storage.updateBehavioralMetricStatus(id, status);
      res.json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update behavioral metric status" });
    }
  });

  app.post("/api/detect-anomalies", async (req: Request, res: Response) => {
    const thresholdSchema = z.object({ threshold: z.number().optional() });
    
    try {
      const { threshold = 30.0 } = thresholdSchema.parse(req.body);
      const anomalies = await storage.detectAnomalies(threshold);
      res.json(anomalies);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid threshold data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to detect anomalies" });
    }
  });
  
  // Helper endpoint to generate sample data for demo purposes
  app.post("/api/generate-sample-data", async (req: Request, res: Response) => {
    try {
      // Clear existing behavioral metrics first
      // We can't directly clear it, but we'll create a way to access it
      // @ts-ignore - Accessing private property
      const behavioralMetrics = storage.behavioralMetrics;
      if (behavioralMetrics && behavioralMetrics.clear) {
        behavioralMetrics.clear();
      }
      
      // Get all SKUs
      const skus = await storage.getSKUs();
      
      // For each SKU, generate 30 days of behavioral metrics
      const today = new Date();
      const metricsGenerated = [];
      
      for (const sku of skus) {
        // Set up baseline metrics for each SKU with distinct patterns
        const baselineMetrics = {
          pageViews: sku.id === 1 ? 25000 : (sku.id === 2 ? 18000 : (sku.id === 3 ? 12000 : 8000)),
          addToCart: sku.id === 1 ? 3500 : (sku.id === 2 ? 2200 : (sku.id === 3 ? 1500 : 1000)),
          reviewVolume: sku.id === 1 ? 850 : (sku.id === 2 ? 600 : (sku.id === 3 ? 400 : 200)),
          rating: sku.id === 1 ? 4.3 : (sku.id === 2 ? 4.5 : (sku.id === 3 ? 4.1 : 4.0)),
        };
        
        // Create campaign spike periods
        const campaignSpikes = [];
        if (sku.id === 1) {
          campaignSpikes.push(
            { startDay: 20, endDay: 24, pageViewsMultiplier: 1.45, addToCartMultiplier: 1.35 },
            { startDay: 5, endDay: 9, pageViewsMultiplier: 1.30, addToCartMultiplier: 1.25 }
          );
        } else if (sku.id === 2) {
          campaignSpikes.push(
            { startDay: 15, endDay: 19, pageViewsMultiplier: 1.40, addToCartMultiplier: 1.25 }
          );
        } else if (sku.id === 3) {
          campaignSpikes.push(
            { startDay: 10, endDay: 14, pageViewsMultiplier: 1.35, addToCartMultiplier: 1.20 }
          );
        } else {
          campaignSpikes.push(
            { startDay: 25, endDay: 29, pageViewsMultiplier: 1.25, addToCartMultiplier: 1.15 }
          );
        }
        
        // Create anomalies or watch points
        const anomalies = [];
        if (sku.id === 1) {
          anomalies.push(
            { day: 2, metric: "addToCart", multiplier: 0.675, status: "anomaly" },
            { day: 0, metric: "rating", value: 3.9, status: "watch" },
            { day: 4, metric: "pageViews", multiplier: 0.55, status: "anomaly" },
            { day: 5, metric: "reviewVolume", multiplier: 2.1, status: "watch" }
          );
        } else if (sku.id === 2) {
          anomalies.push(
            { day: 8, metric: "reviewVolume", multiplier: 1.65, status: "watch" },
            { day: 3, metric: "addToCart", multiplier: 0.62, status: "anomaly" },
            { day: 6, metric: "pageViews", multiplier: 0.78, status: "watch" }
          );
        } else if (sku.id === 3) {
          anomalies.push(
            { day: 7, metric: "pageViews", multiplier: 0.6, status: "anomaly" },
            { day: 9, metric: "addToCart", multiplier: 0.7, status: "watch" }
          );
        } else {
          anomalies.push(
            { day: 6, metric: "rating", value: 2.8, status: "anomaly" },
            { day: 3, metric: "reviewVolume", multiplier: 0.5, status: "anomaly" }
          );
        }
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // Start with baseline values
          let pageViews = baselineMetrics.pageViews;
          let addToCart = baselineMetrics.addToCart;
          let reviewVolume = baselineMetrics.reviewVolume;
          let averageRating = baselineMetrics.rating;
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
          const campaignSpike = campaignSpikes.find(
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
          const anomaly = anomalies.find(
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
          
          const metric = await storage.createBehavioralMetric({
            skuId: sku.id,
            date: date,
            pageViews: pageViews,
            addToCart: addToCart,
            reviewVolume: reviewVolume,
            averageRating: Math.min(5, Math.max(1, Number(averageRating.toFixed(1)))),
            status: status
          });
          
          metricsGenerated.push(metric);
        }
      }
      
      res.json({ 
        message: "Sample data generated successfully", 
        count: metricsGenerated.length,
        skuCount: skus.length
      });
    } catch (error) {
      console.error("Error generating sample data:", error);
      res.status(500).json({ message: "Failed to generate sample data" });
    }
  });

  // Survey routes
  app.get("/api/surveys", async (req: Request, res: Response) => {
    const skuId = req.query.skuId ? parseInt(req.query.skuId as string) : undefined;
    const active = req.query.active === 'true';
    
    let surveys: Survey[] = [];
    if (skuId) {
      surveys = await storage.getSurveysBySkuId(skuId);
    } else if (active) {
      surveys = await storage.getActiveSurveys();
    } else {
      // Return all surveys if no filter is provided
      const allSurveys: Survey[] = [];
      const skus = await storage.getSKUs();
      for (const sku of skus) {
        const skuSurveys = await storage.getSurveysBySkuId(sku.id);
        allSurveys.push(...skuSurveys);
      }
      surveys = allSurveys;
    }
    
    res.json(surveys);
  });

  app.get("/api/surveys/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const survey = await storage.getSurvey(id);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.json(survey);
  });

  app.post("/api/surveys", async (req: Request, res: Response) => {
    try {
      const surveyData = insertSurveySchema.parse(req.body);
      const survey = await storage.createSurvey(surveyData);
      res.status(201).json(survey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid survey data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create survey" });
    }
  });

  app.patch("/api/surveys/:id/status", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const statusSchema = z.object({ status: z.string() });
    
    try {
      const { status } = statusSchema.parse(req.body);
      const survey = await storage.updateSurveyStatus(id, status);
      res.json(survey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update survey status" });
    }
  });

  // Brand health metrics routes
  app.get("/api/brand-health-metrics", async (req: Request, res: Response) => {
    const skuId = req.query.skuId ? parseInt(req.query.skuId as string) : undefined;
    
    if (!skuId) {
      return res.status(400).json({ message: "skuId is required" });
    }
    
    const metrics = await storage.getBrandHealthMetricsBySkuId(skuId);
    res.json(metrics);
  });

  app.post("/api/brand-health-metrics", async (req: Request, res: Response) => {
    try {
      const metricData = insertBrandHealthMetricSchema.parse(req.body);
      const metric = await storage.createBrandHealthMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid metric data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brand health metric" });
    }
  });

  // Timeline events routes
  app.get("/api/timeline-events", async (req: Request, res: Response) => {
    const skuId = req.query.skuId ? parseInt(req.query.skuId as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    let events: TimelineEvent[] = [];
    if (skuId) {
      events = await storage.getTimelineEventsBySkuId(skuId);
    } else {
      events = await storage.getTimelineEvents(limit);
    }
    
    res.json(events);
  });

  app.post("/api/timeline-events", async (req: Request, res: Response) => {
    try {
      const eventData = insertTimelineEventSchema.parse(req.body);
      const event = await storage.createTimelineEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create timeline event" });
    }
  });

  // Anomaly settings routes
  app.get("/api/anomaly-settings", async (req: Request, res: Response) => {
    const metricType = req.query.metricType as string | undefined;
    
    let settings: AnomalySetting[] = [];
    if (metricType) {
      const setting = await storage.getAnomalySettingByMetricType(metricType);
      if (!setting) {
        return res.status(404).json({ message: `Anomaly setting for metric type '${metricType}' not found` });
      }
      settings = [setting];
    } else {
      settings = await storage.getAnomalySettings();
    }
    
    res.json(settings);
  });

  app.post("/api/anomaly-settings", async (req: Request, res: Response) => {
    try {
      const settingData = insertAnomalySettingSchema.parse(req.body);
      const setting = await storage.createAnomalySetting(settingData);
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid setting data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create anomaly setting" });
    }
  });

  app.patch("/api/anomaly-settings/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updateSchema = z.object({
      thresholdPercentage: z.number().optional(),
      enabled: z.boolean().optional()
    });
    
    try {
      const updateData = updateSchema.parse(req.body);
      const setting = await storage.updateAnomalySetting(id, updateData);
      res.json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update anomaly setting" });
    }
  });

  // Question template routes
  app.get("/api/question-templates", async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    
    let templates: QuestionTemplate[] = [];
    if (category) {
      templates = await storage.getQuestionTemplatesByCategory(category);
    } else {
      // Get all templates
      const allTemplates: QuestionTemplate[] = [];
      const categories = ["awareness", "message_recall", "purchase_intent", "friction_point"];
      for (const cat of categories) {
        const categoryTemplates = await storage.getQuestionTemplatesByCategory(cat);
        allTemplates.push(...categoryTemplates);
      }
      templates = allTemplates;
    }
    
    res.json(templates);
  });

  app.post("/api/question-templates", async (req: Request, res: Response) => {
    try {
      const templateData = insertQuestionTemplateSchema.parse(req.body);
      const template = await storage.createQuestionTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create question template" });
    }
  });

  return httpServer;
}
