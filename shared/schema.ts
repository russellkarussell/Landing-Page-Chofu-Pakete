import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bundesland: text("bundesland").notNull(),
  message: text("message"),
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
