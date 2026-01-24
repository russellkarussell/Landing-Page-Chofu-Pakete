import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertPartnerSchema, insertPartnerReferenceSchema } from "@shared/schema";
import { z } from "zod";
import { getUncachableHubSpotClient } from "./hubspot";
import { getUncachableResendClient } from "./resend";
import { uploadFile, deleteFile, requireAuth } from "./supabase";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const NOTIFICATION_EMAIL = "office@westech-solar.at";
const LEAD_SOURCE = "meine-waermepumpe.at";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/config/supabase", (req, res) => {
    res.json({
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    });
  });
  
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      
      const contactRequest = await storage.createContactRequest(validatedData);
      
      const nameParts = validatedData.name.split(" ");
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" ") || firstname;
      
      try {
        const hubspotClient = await getUncachableHubSpotClient();
        
        let hubspotContactId: string | null = null;
        
        try {
          const response = await hubspotClient.crm.contacts.basicApi.create({
            properties: {
              firstname,
              lastname,
              email: validatedData.email,
              phone: validatedData.phone,
              state: validatedData.bundesland,
              hs_lead_status: "NEW",
              lead_source: LEAD_SOURCE,
            },
            associations: []
          });

          if (response && response.id) {
            hubspotContactId = response.id;
            await storage.updateContactRequestHubspotId(contactRequest.id, response.id);
            console.log(`HubSpot contact created: ${response.id}`);
          }
        } catch (createError: any) {
          if (createError.code === 409 || createError.message?.includes("Contact already exists")) {
            const existingIdMatch = createError.message?.match(/Existing ID: (\d+)/);
            if (existingIdMatch && existingIdMatch[1]) {
              const existingContactId = existingIdMatch[1];
              hubspotContactId = existingContactId;
              await hubspotClient.crm.contacts.basicApi.update(existingContactId, {
                properties: {
                  firstname,
                  lastname,
                  phone: validatedData.phone,
                  state: validatedData.bundesland,
                  hs_lead_status: "NEW",
                  lead_source: LEAD_SOURCE,
                }
              });
              await storage.updateContactRequestHubspotId(contactRequest.id, existingContactId);
              console.log(`HubSpot contact updated: ${existingContactId}`);
            }
          } else {
            throw createError;
          }
        }
      } catch (hubspotError: any) {
        console.error("HubSpot API error:", hubspotError.message || hubspotError);
      }

      try {
        const { client: resendClient } = await getUncachableResendClient();
        
        await resendClient.emails.send({
          from: "meine-waermepumpe.at <anfrage@meine-waermepumpe.at>",
          to: NOTIFICATION_EMAIL,
          subject: `Neue Wärmepumpen-Anfrage von ${validatedData.name}`,
          html: `
            <h2>Neue Kontaktanfrage über meine-waermepumpe.at</h2>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${validatedData.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">E-Mail</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${validatedData.email}">${validatedData.email}</a></td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Telefon</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${validatedData.phone}">${validatedData.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Bundesland</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${validatedData.bundesland}</td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Nachricht</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${validatedData.message || "-"}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              Diese Anfrage wurde automatisch über meine-waermepumpe.at gesendet.
            </p>
          `,
        });
        console.log(`Email notification sent to ${NOTIFICATION_EMAIL}`);
      } catch (emailError: any) {
        console.error("Email notification error:", emailError.message || emailError);
      }

      res.status(201).json({ 
        success: true, 
        message: "Anfrage erfolgreich gesendet",
        id: contactRequest.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validierungsfehler", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating contact request:", error);
        res.status(500).json({ 
          success: false, 
          message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut." 
        });
      }
    }
  });

  // Partner Routes - Public
  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ success: false, message: "Fehler beim Laden der Partner" });
    }
  });

  app.get("/api/partners/bundesland/:bundesland", async (req, res) => {
    try {
      const partners = await storage.getPartnersByBundesland(req.params.bundesland);
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners by bundesland:", error);
      res.status(500).json({ success: false, message: "Fehler beim Laden der Partner" });
    }
  });

  app.get("/api/partners/:slug", async (req, res) => {
    try {
      const partner = await storage.getPartnerBySlug(req.params.slug);
      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner nicht gefunden" });
      }
      const references = await storage.getPartnerReferences(partner.id);
      res.json({ ...partner, references });
    } catch (error) {
      console.error("Error fetching partner:", error);
      res.status(500).json({ success: false, message: "Fehler beim Laden des Partners" });
    }
  });

  // Partner Routes - Admin (protected)
  app.post("/api/admin/partners", requireAuth, async (req, res) => {
    try {
      const data = insertPartnerSchema.parse({
        ...req.body,
        slug: generateSlug(req.body.name)
      });
      const partner = await storage.createPartner(data);
      res.status(201).json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validierungsfehler", errors: error.errors });
      } else {
        console.error("Error creating partner:", error);
        res.status(500).json({ success: false, message: "Fehler beim Erstellen des Partners" });
      }
    }
  });

  app.put("/api/admin/partners/:id", requireAuth, async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (req.body.name) {
        updateData.slug = generateSlug(req.body.name);
      }
      const partner = await storage.updatePartner(req.params.id, updateData);
      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner nicht gefunden" });
      }
      res.json(partner);
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ success: false, message: "Fehler beim Aktualisieren des Partners" });
    }
  });

  app.delete("/api/admin/partners/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePartner(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: "Partner nicht gefunden" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ success: false, message: "Fehler beim Löschen des Partners" });
    }
  });

  // File Upload - Logo (protected)
  app.post("/api/admin/partners/:id/logo", requireAuth, upload.single('logo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Keine Datei hochgeladen" });
      }

      const partner = await storage.getPartnerById(req.params.id);
      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner nicht gefunden" });
      }

      const fileName = `logos/${partner.slug}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
      const publicUrl = await uploadFile(req.file.buffer, fileName, req.file.mimetype);

      if (!publicUrl) {
        return res.status(500).json({ success: false, message: "Fehler beim Hochladen" });
      }

      const updatedPartner = await storage.updatePartner(req.params.id, { logoUrl: publicUrl });
      res.json(updatedPartner);
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ success: false, message: "Fehler beim Hochladen des Logos" });
    }
  });

  // File Upload - Reference Photos (protected)
  app.post("/api/admin/partners/:id/references", requireAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Keine Datei hochgeladen" });
      }

      const partner = await storage.getPartnerById(req.params.id);
      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner nicht gefunden" });
      }

      const fileName = `references/${partner.slug}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
      const publicUrl = await uploadFile(req.file.buffer, fileName, req.file.mimetype);

      if (!publicUrl) {
        return res.status(500).json({ success: false, message: "Fehler beim Hochladen" });
      }

      const reference = await storage.createPartnerReference({
        partnerId: partner.id,
        imageUrl: publicUrl,
        caption: req.body.caption || null,
        sortOrder: parseInt(req.body.sortOrder) || 0
      });
      res.status(201).json(reference);
    } catch (error) {
      console.error("Error uploading reference:", error);
      res.status(500).json({ success: false, message: "Fehler beim Hochladen der Referenz" });
    }
  });

  app.delete("/api/admin/references/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePartnerReference(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: "Referenz nicht gefunden" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting reference:", error);
      res.status(500).json({ success: false, message: "Fehler beim Löschen der Referenz" });
    }
  });

  return httpServer;
}
