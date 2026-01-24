import { type ContactRequest, type InsertContactRequest, contactRequests } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  updateContactRequestHubspotId(id: string, hubspotContactId: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const [contactRequest] = await db
      .insert(contactRequests)
      .values(request)
      .returning();
    return contactRequest;
  }

  async updateContactRequestHubspotId(id: string, hubspotContactId: string): Promise<void> {
    await db
      .update(contactRequests)
      .set({ hubspotContactId })
      .where(eq(contactRequests.id, id));
  }
}

export const storage = new DbStorage();
