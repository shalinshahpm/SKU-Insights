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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSkuSchema = createInsertSchema(skus).pick({
  name: true,
  brand: true,
  region: true,
  market: true,
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
