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

  // Behavioral metrics routes
  app.get("/api/behavioral-metrics", async (req: Request, res: Response) => {
    const skuId = req.query.skuId ? parseInt(req.query.skuId as string) : undefined;
    const date = req.query.date ? new Date(req.query.date as string) : undefined;
    
    let metrics;
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
    
    res.json(metrics);
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

  // Survey routes
  app.get("/api/surveys", async (req: Request, res: Response) => {
    const skuId = req.query.skuId ? parseInt(req.query.skuId as string) : undefined;
    const active = req.query.active === 'true';
    
    let surveys;
    if (skuId) {
      surveys = await storage.getSurveysBySkuId(skuId);
    } else if (active) {
      surveys = await storage.getActiveSurveys();
    } else {
      // Return all surveys if no filter is provided
      const allSurveys = [];
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
    
    let events;
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
    
    let settings;
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
    
    let templates;
    if (category) {
      templates = await storage.getQuestionTemplatesByCategory(category);
    } else {
      // Get all templates
      templates = [];
      const categories = ["awareness", "message_recall", "purchase_intent", "friction_point"];
      for (const cat of categories) {
        const categoryTemplates = await storage.getQuestionTemplatesByCategory(cat);
        templates.push(...categoryTemplates);
      }
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
