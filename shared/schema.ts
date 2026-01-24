import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Partner (Fachpartner)
export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  bundeslaender: text("bundeslaender").array().notNull(),
  website: text("website"),
  logoUrl: text("logo_url"),
  phone: text("phone"),
  services: text("services").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

// Referenzfotos für Partner
export const partnerReferences = pgTable("partner_references", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPartnerReferenceSchema = createInsertSchema(partnerReferences).omit({
  id: true,
  createdAt: true,
});

export type InsertPartnerReference = z.infer<typeof insertPartnerReferenceSchema>;
export type PartnerReference = typeof partnerReferences.$inferSelect;

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bundesland: text("bundesland").notNull(),
  message: text("message").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  hubspotContactId: text("hubspot_contact_id"),
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
  hubspotContactId: true,
});

export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;
