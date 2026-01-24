import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema } from "@shared/schema";
import { z } from "zod";
import { getUncachableHubSpotClient } from "./hubspot";
import { getUncachableResendClient } from "./resend";

const NOTIFICATION_EMAIL = "office@westech-solar.at";
const LEAD_SOURCE = "meine-waermepumpe.at";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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
              website: LEAD_SOURCE,
              notes_last_updated: new Date().toISOString(),
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
                  website: LEAD_SOURCE,
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
        const { client: resendClient, fromEmail } = await getUncachableResendClient();
        
        await resendClient.emails.send({
          from: fromEmail,
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

  return httpServer;
}
