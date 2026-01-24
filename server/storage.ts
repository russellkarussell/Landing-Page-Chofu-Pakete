import { 
  type ContactRequest, 
  type InsertContactRequest, 
  contactRequests,
  type Partner,
  type InsertPartner,
  partners,
  type PartnerReference,
  type InsertPartnerReference,
  partnerReferences
} from "@shared/schema";
import { db } from "../db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // Contact Requests
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  updateContactRequestHubspotId(id: string, hubspotContactId: string): Promise<void>;
  
  // Partners
  getAllPartners(): Promise<Partner[]>;
  getPartnerById(id: string): Promise<Partner | null>;
  getPartnerBySlug(slug: string): Promise<Partner | null>;
  getPartnersByBundesland(bundesland: string): Promise<Partner[]>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: string, partner: Partial<InsertPartner>): Promise<Partner | null>;
  deletePartner(id: string): Promise<boolean>;
  
  // Partner References
  getPartnerReferences(partnerId: string): Promise<PartnerReference[]>;
  createPartnerReference(reference: InsertPartnerReference): Promise<PartnerReference>;
  deletePartnerReference(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // Contact Requests
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

  // Partners
  async getAllPartners(): Promise<Partner[]> {
    return db.select().from(partners).orderBy(asc(partners.bundesland), asc(partners.name));
  }

  async getPartnerById(id: string): Promise<Partner | null> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || null;
  }

  async getPartnerBySlug(slug: string): Promise<Partner | null> {
    const [partner] = await db.select().from(partners).where(eq(partners.slug, slug));
    return partner || null;
  }

  async getPartnersByBundesland(bundesland: string): Promise<Partner[]> {
    return db.select().from(partners).where(eq(partners.bundesland, bundesland)).orderBy(asc(partners.name));
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [newPartner] = await db.insert(partners).values(partner).returning();
    return newPartner;
  }

  async updatePartner(id: string, partner: Partial<InsertPartner>): Promise<Partner | null> {
    const [updatedPartner] = await db
      .update(partners)
      .set(partner)
      .where(eq(partners.id, id))
      .returning();
    return updatedPartner || null;
  }

  async deletePartner(id: string): Promise<boolean> {
    const result = await db.delete(partners).where(eq(partners.id, id)).returning();
    return result.length > 0;
  }

  // Partner References
  async getPartnerReferences(partnerId: string): Promise<PartnerReference[]> {
    return db
      .select()
      .from(partnerReferences)
      .where(eq(partnerReferences.partnerId, partnerId))
      .orderBy(asc(partnerReferences.sortOrder));
  }

  async createPartnerReference(reference: InsertPartnerReference): Promise<PartnerReference> {
    const [newReference] = await db.insert(partnerReferences).values(reference).returning();
    return newReference;
  }

  async deletePartnerReference(id: string): Promise<boolean> {
    const result = await db.delete(partnerReferences).where(eq(partnerReferences.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
