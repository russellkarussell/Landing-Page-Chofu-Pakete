import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema } from "@shared/schema";
import { z } from "zod";
import { getUncachableHubSpotClient } from "./hubspot";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      
      const contactRequest = await storage.createContactRequest(validatedData);
      
      try {
        const hubspotClient = await getUncachableHubSpotClient();
        
        const nameParts = validatedData.name.split(" ");
        const firstname = nameParts[0];
        const lastname = nameParts.slice(1).join(" ") || firstname;
        
        const response = await hubspotClient.crm.contacts.basicApi.create({
          properties: {
            firstname,
            lastname,
            email: validatedData.email,
            phone: validatedData.phone,
            state: validatedData.bundesland,
            hs_lead_status: "NEW",
          },
          associations: []
        });

        if (response && response.id) {
          await storage.updateContactRequestHubspotId(contactRequest.id, response.id);
          console.log(`HubSpot contact created: ${response.id}`);
        }
      } catch (hubspotError: any) {
        console.error("HubSpot API error:", hubspotError.message || hubspotError);
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
