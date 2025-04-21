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

// SKU model
export const skus = pgTable("skus", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  region: text("region").notNull(),
  market: text("market").notNull(),
  launchDate: timestamp("launch_date"),
  isNewLaunch: boolean("is_new_launch").default(false),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSkuSchema = createInsertSchema(skus).pick({
  name: true,
  brand: true,
  region: true,
  market: true,
  launchDate: true,
  isNewLaunch: true,
  category: true,
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

// Survey model
export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // "awareness", "message_recall", "purchase_intent", "friction_point"
  audience: text("audience").notNull(),
  status: text("status").notNull(), // "draft", "active", "completed"
  sampleSize: integer("sample_size").notNull(),
  questions: json("questions").notNull(), // Array of question objects
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertSurveySchema = createInsertSchema(surveys).pick({
  skuId: true,
  title: true,
  type: true,
  audience: true,
  status: true,
  sampleSize: true,
  questions: true,
});

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

export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;

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
