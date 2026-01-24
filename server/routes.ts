import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      
      const contactRequest = await storage.createContactRequest(validatedData);
      
      if (process.env.HUBSPOT_ACCESS_TOKEN) {
        try {
          const hubspotResponse = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              properties: {
                firstname: validatedData.name.split(" ")[0],
                lastname: validatedData.name.split(" ").slice(1).join(" ") || validatedData.name.split(" ")[0],
                email: validatedData.email,
                phone: validatedData.phone,
                state: validatedData.bundesland,
                message: validatedData.message || "",
                hs_lead_status: "NEW"
              }
            })
          });

          if (hubspotResponse.ok) {
            const hubspotData = await hubspotResponse.json();
            await storage.updateContactRequestHubspotId(contactRequest.id, hubspotData.id);
            console.log(`HubSpot contact created: ${hubspotData.id}`);
          } else {
            console.error("Failed to create HubSpot contact:", await hubspotResponse.text());
          }
        } catch (hubspotError) {
          console.error("HubSpot API error:", hubspotError);
        }
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
