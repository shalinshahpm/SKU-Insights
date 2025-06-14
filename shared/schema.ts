import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // "brand_manager", "regional_insights", "global_marketing"
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  avatar: true,
});

// SKU model - Enhanced for workflow
export const skus = pgTable("skus", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  region: text("region").notNull(),
  market: text("market").notNull(),
  category: text("category").notNull(),
  format: text("format"), // "bottle", "can", "pouch", etc.
  price: real("price"),
  launchDate: timestamp("launch_date"),
  isNewLaunch: boolean("is_new_launch").default(false),
  velocity: real("velocity").default(0), // Sales velocity metric
  sentimentScore: real("sentiment_score").default(0), // -1 to 1
  reviewDelta: real("review_delta").default(0), // Change in reviews
  launchReadinessScore: real("launch_readiness_score").default(0), // 0-100
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id").notNull(),
});

export const insertSkuSchema = createInsertSchema(skus).pick({
  name: true,
  brand: true,
  region: true,
  market: true,
  category: true,
  format: true,
  price: true,
  launchDate: true,
  isNewLaunch: true,
  userId: true,
});

// File uploads model
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  userId: integer("user_id").notNull(),
  fileType: text("file_type").notNull(), // "csv", "excel"
  status: text("status").notNull().default("processing"), // "processing", "completed", "error"
  recordsProcessed: integer("records_processed").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUploadSchema = createInsertSchema(uploads).pick({
  fileName: true,
  userId: true,
  fileType: true,
  status: true,
  recordsProcessed: true,
});

// Actions model for tracking interventions
export const actions = pgTable("actions", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  type: text("type").notNull(), // "price_adjustment", "pause_sku", "increase_marketing", etc.
  description: text("description").notNull(),
  triggerReason: text("trigger_reason"), // What insight triggered this action
  outcome: text("outcome"), // Result of the action
  impactScore: real("impact_score"), // Measured impact (positive/negative)
  status: text("status").notNull().default("pending"), // "pending", "executed", "completed"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  executedAt: timestamp("executed_at"),
  userId: integer("user_id").notNull(),
});

export const insertActionSchema = createInsertSchema(actions).pick({
  skuId: true,
  type: true,
  description: true,
  triggerReason: true,
  userId: true,
});

// Pre-launch validation surveys
export const validationSurveys = pgTable("validation_surveys", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  conceptText: text("concept_text").notNull(),
  audience: text("audience").notNull(), // "general", "target_demographic", etc.
  surveyType: text("survey_type").notNull(), // "concept_test", "price_test", "competitive_test"
  status: text("status").notNull().default("draft"), // "draft", "live", "completed"
  results: json("results"), // Survey results from external service
  completionRate: real("completion_rate"),
  insights: text("insights"), // AI-generated insights from results
  createdAt: timestamp("created_at").notNull().defaultNow(),
  launchedAt: timestamp("launched_at"),
  completedAt: timestamp("completed_at"),
  userId: integer("user_id").notNull(),
});

export const insertValidationSurveySchema = createInsertSchema(validationSurveys).pick({
  skuId: true,
  conceptText: true,
  audience: true,
  surveyType: true,
  userId: true,
});

// Behavioral metrics model
export const behavioralMetrics = pgTable("behavioral_metrics", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  date: timestamp("date").notNull(),
  pageViews: integer("page_views").notNull(),
  addToCart: integer("add_to_cart").notNull(),
  reviewVolume: integer("review_volume").notNull(),
  averageRating: real("average_rating").notNull(),
  status: text("status").notNull(), // "normal", "anomaly", "watch"
});

export const insertBehavioralMetricSchema = createInsertSchema(behavioralMetrics).pick({
  skuId: true,
  date: true,
  pageViews: true,
  addToCart: true,
  reviewVolume: true,
  averageRating: true,
  status: true,
});

// Legacy surveys table - will be replaced by new workflow surveys above

// Brand health metrics model
export const brandHealthMetrics = pgTable("brand_health_metrics", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  date: timestamp("date").notNull(),
  brandLiftScore: real("brand_lift_score").notNull(),
  purchaseIntent: real("purchase_intent").notNull(),
  netSentiment: integer("net_sentiment").notNull(),
});

export const insertBrandHealthMetricSchema = createInsertSchema(brandHealthMetrics).pick({
  skuId: true,
  date: true,
  brandLiftScore: true,
  purchaseIntent: true,
  netSentiment: true,
});

// Insights timeline events model
export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id"),
  type: text("type").notNull(), // "sku_added", "anomaly_detected", "survey_launched", "survey_completed", "report_generated"
  title: text("title").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  data: json("data"), // Additional data related to the event
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).pick({
  skuId: true,
  type: true,
  title: true,
  description: true,
  data: true,
});

// Anomaly detection settings
export const anomalySettings = pgTable("anomaly_settings", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull().unique(),
  thresholdPercentage: real("threshold_percentage").notNull(),
  enabled: boolean("enabled").notNull().default(true),
});

export const insertAnomalySettingSchema = createInsertSchema(anomalySettings).pick({
  metricType: true,
  thresholdPercentage: true,
  enabled: true,
});

// Question templates for surveys
export const questionTemplates = pgTable("question_templates", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // "awareness", "message_recall", "purchase_intent", "friction_point"
  question: text("question").notNull(),
  responseType: text("response_type").notNull(), // "multiple_choice", "rating", "open_ended"
  options: json("options"), // For multiple choice questions
});

export const insertQuestionTemplateSchema = createInsertSchema(questionTemplates).pick({
  category: true,
  question: true,
  responseType: true,
  options: true,
});

// Define launch tracking tables
export const launchPhases = pgTable("launch_phases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  daysFromStart: integer("days_from_start").notNull(),
  daysToEnd: integer("days_to_end").notNull(),
  description: text("description"),
});

export const insertLaunchPhaseSchema = createInsertSchema(launchPhases).pick({
  name: true,
  daysFromStart: true,
  daysToEnd: true,
  description: true,
});

export const successThresholds = pgTable("success_thresholds", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  phaseId: integer("phase_id").notNull(),
  metricType: text("metric_type").notNull(),
  targetValue: real("target_value").notNull(),
  minimumValue: real("minimum_value").notNull(),
  idealValue: real("ideal_value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSuccessThresholdSchema = createInsertSchema(successThresholds).pick({
  skuId: true,
  phaseId: true,
  metricType: true,
  targetValue: true,
  minimumValue: true,
  idealValue: true,
});

export const microSurveys = pgTable("micro_surveys", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  question: text("question").notNull(),
  interactionPoint: text("interaction_point").notNull(),
  responseOptions: json("response_options"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMicroSurveySchema = createInsertSchema(microSurveys).pick({
  skuId: true,
  question: true,
  interactionPoint: true,
  responseOptions: true,
  isActive: true,
});

export const microSurveyResponses = pgTable("micro_survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertMicroSurveyResponseSchema = createInsertSchema(microSurveyResponses).pick({
  surveyId: true,
  response: true,
});

export const socialListeningData = pgTable("social_listening_data", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  sentiment: text("sentiment").notNull(),
  engagementCount: integer("engagement_count"),
  source: text("source"),
  sourceUrl: text("source_url"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSocialListeningDataSchema = createInsertSchema(socialListeningData).pick({
  skuId: true,
  platform: true,
  content: true,
  sentiment: true,
  engagementCount: true,
  source: true,
  sourceUrl: true,
});

export const launchInterventions = pgTable("launch_interventions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  expectedImpact: text("expected_impact"),
  implementationSteps: json("implementation_steps"),
});

export const insertLaunchInterventionSchema = createInsertSchema(launchInterventions).pick({
  name: true,
  category: true,
  description: true,
  expectedImpact: true,
  implementationSteps: true,
});

export const appliedInterventions = pgTable("applied_interventions", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  interventionId: integer("intervention_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull(),
  notes: text("notes"),
  results: json("results"),
});

export const insertAppliedInterventionSchema = createInsertSchema(appliedInterventions).pick({
  skuId: true,
  interventionId: true,
  startDate: true,
  endDate: true,
  status: true,
  notes: true,
  results: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SKU = typeof skus.$inferSelect;
export type InsertSKU = z.infer<typeof insertSkuSchema>;

export type BehavioralMetric = typeof behavioralMetrics.$inferSelect;
export type InsertBehavioralMetric = z.infer<typeof insertBehavioralMetricSchema>;

// Legacy survey types - using validation surveys instead

export type BrandHealthMetric = typeof brandHealthMetrics.$inferSelect;
export type InsertBrandHealthMetric = z.infer<typeof insertBrandHealthMetricSchema>;

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;

export type AnomalySetting = typeof anomalySettings.$inferSelect;
export type InsertAnomalySetting = z.infer<typeof insertAnomalySettingSchema>;

export type QuestionTemplate = typeof questionTemplates.$inferSelect;
export type InsertQuestionTemplate = z.infer<typeof insertQuestionTemplateSchema>;

export type LaunchPhase = typeof launchPhases.$inferSelect;
export type InsertLaunchPhase = z.infer<typeof insertLaunchPhaseSchema>;

export type SuccessThreshold = typeof successThresholds.$inferSelect;
export type InsertSuccessThreshold = z.infer<typeof insertSuccessThresholdSchema>;

export type MicroSurvey = typeof microSurveys.$inferSelect;
export type InsertMicroSurvey = z.infer<typeof insertMicroSurveySchema>;

export type MicroSurveyResponse = typeof microSurveyResponses.$inferSelect;
export type InsertMicroSurveyResponse = z.infer<typeof insertMicroSurveyResponseSchema>;

export type SocialListeningData = typeof socialListeningData.$inferSelect;
export type InsertSocialListeningData = z.infer<typeof insertSocialListeningDataSchema>;

export type LaunchIntervention = typeof launchInterventions.$inferSelect;
export type InsertLaunchIntervention = z.infer<typeof insertLaunchInterventionSchema>;

export type AppliedIntervention = typeof appliedInterventions.$inferSelect;
export type InsertAppliedIntervention = z.infer<typeof insertAppliedInterventionSchema>;

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;

export type Action = typeof actions.$inferSelect;
export type InsertAction = z.infer<typeof insertActionSchema>;

export type ValidationSurvey = typeof validationSurveys.$inferSelect;
export type InsertValidationSurvey = z.infer<typeof insertValidationSurveySchema>;
