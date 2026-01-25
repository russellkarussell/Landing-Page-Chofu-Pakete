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

  // Heizkostenrechner Lead Capture
  const heizkostenLeadSchema = z.object({
    email: z.string().email("Ungültige E-Mail-Adresse"),
    consent: z.object({
      accepted: z.literal(true),
      timestamp: z.string(),
      textVersion: z.string()
    }),
    inputs: z.object({
      buildingClass: z.string(),
      area_m2: z.number(),
      currentHeatingSystem: z.string(),
      efficiencyOldSystem: z.number(),
      currentEnergyPrice: z.number(),
      wpPowerPrice: z.number(),
      vorlaufTemp: z.number(),
      fbhPercent: z.number(),
      warmwasserPercent: z.number(),
      solarEnabled: z.boolean(),
      solarType: z.string().optional(),
      solarArea: z.number().optional(),
      radiatorFansEnabled: z.boolean()
    }),
    derived: z.object({
      effectiveVorlaufTemp: z.number(),
      selectedPackage: z.string().nullable(),
      investmentGross: z.number(),
      subsidyExpected: z.number(),
      investmentNet: z.number()
    }),
    results: z.object({
      nutzwaerme_kwh_a: z.number(),
      wpStrom_kwh_a: z.number(),
      wpStromkosten_eur_a: z.number(),
      wpCo2_kg_a: z.number(),
      scop: z.string(),
      oldCost_eur_a: z.number().nullable(),
      oldCo2_kg_a: z.number().nullable(),
      savings_eur_a: z.number().nullable(),
      amortisation_years: z.union([z.string(), z.number()]).nullable(),
      co2Reduction_kg_a: z.number().nullable()
    })
  });

  app.post("/api/heizkosten-lead", async (req, res) => {
    try {
      const validatedData = heizkostenLeadSchema.parse(req.body);
      
      // Create HubSpot contact
      try {
        const hubspotClient = await getUncachableHubSpotClient();
        
        try {
          await hubspotClient.crm.contacts.basicApi.create({
            properties: {
              email: validatedData.email,
              hs_lead_status: "NEW",
              lead_source: LEAD_SOURCE,
            },
            associations: []
          });
          console.log(`HubSpot contact created from Heizkostenrechner: ${validatedData.email}`);
        } catch (createError: any) {
          if (createError.code === 409 || createError.message?.includes("Contact already exists")) {
            const existingIdMatch = createError.message?.match(/Existing ID: (\d+)/);
            if (existingIdMatch && existingIdMatch[1]) {
              await hubspotClient.crm.contacts.basicApi.update(existingIdMatch[1], {
                properties: {
                  hs_lead_status: "NEW",
                  lead_source: LEAD_SOURCE,
                }
              });
              console.log(`HubSpot contact updated from Heizkostenrechner: ${validatedData.email}`);
            }
          } else {
            throw createError;
          }
        }
      } catch (hubspotError: any) {
        console.error("HubSpot API error (heizkosten-lead):", hubspotError.message || hubspotError);
      }

      // Send email to user via Resend
      try {
        const { client: resendClient, fromEmail } = await getUncachableResendClient();
        const { inputs, results, derived } = validatedData;
        
        console.log(`Attempting to send email to user: ${validatedData.email}, from: ${fromEmail}`);
        
        const buildingLabels: Record<string, string> = {
          alt_unsaniert: "Altbau, unsaniert",
          alt_teilsaniert: "Altbau, teilsaniert",
          alt_saniert: "Altbau, saniert",
          neubau: "Neubau",
          niedrigenergie: "Niedrigenergiehaus"
        };
        
        const heatingLabels: Record<string, string> = {
          heizoel: "Heizöl",
          erdgas_h: "Erdgas (H-Gas)",
          erdgas_l: "Erdgas (L-Gas)",
          fluessiggas: "Flüssiggas",
          pellets: "Holzpellets",
          strom: "Strom (Direkt)",
          keine: "Neubau / Keine"
        };
        
        const isComparisonMode = inputs.currentHeatingSystem !== "keine";

        await resendClient.emails.send({
          from: "meine-waermepumpe.at <anfrage@meine-waermepumpe.at>",
          to: validatedData.email,
          subject: "Ihre Heizkostenrechner-Ergebnisse – CHOFU Wärmepumpe",
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Danke für Ihre Anfrage</h1>
              <p style="margin: 12px 0 0; color: #ccfbf1; font-size: 14px;">meine-waermepumpe.at</p>
            </td>
          </tr>
          
          <!-- Intro -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #475569;">
                Anbei finden Sie die Ergebnisse aus Ihrem Heizkostenrechner. Bitte beachten Sie, dass es sich um Orientierungswerte handelt – eine genaue Planung erfolgt durch den Fachbetrieb.
              </p>
              
              <!-- Ihre Eingaben -->
              <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 8px;">Ihre Eingaben</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px; font-size: 14px;">
                <tr style="background-color: #f1f5f9;">
                  <td style="padding: 10px; border-radius: 4px 0 0 4px;">Gebäudeklasse</td>
                  <td style="padding: 10px; text-align: right; font-weight: 600; border-radius: 0 4px 4px 0;">${buildingLabels[inputs.buildingClass] || inputs.buildingClass}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;">Wohnfläche</td>
                  <td style="padding: 10px; text-align: right; font-weight: 600;">${inputs.area_m2} m²</td>
                </tr>
                <tr style="background-color: #f1f5f9;">
                  <td style="padding: 10px; border-radius: 4px 0 0 4px;">Vorlauftemperatur</td>
                  <td style="padding: 10px; text-align: right; font-weight: 600; border-radius: 0 4px 4px 0;">${inputs.vorlaufTemp}°C</td>
                </tr>
                <tr>
                  <td style="padding: 10px;">Fußbodenheizung</td>
                  <td style="padding: 10px; text-align: right; font-weight: 600;">${inputs.fbhPercent}%</td>
                </tr>
                <tr style="background-color: #f1f5f9;">
                  <td style="padding: 10px; border-radius: 4px 0 0 4px;">WP-Strompreis</td>
                  <td style="padding: 10px; text-align: right; font-weight: 600; border-radius: 0 4px 4px 0;">${inputs.wpPowerPrice.toFixed(2)} €/kWh</td>
                </tr>
                ${isComparisonMode ? `
                <tr>
                  <td style="padding: 10px;">Aktuelles Heizsystem</td>
                  <td style="padding: 10px; text-align: right; font-weight: 600;">${heatingLabels[inputs.currentHeatingSystem] || inputs.currentHeatingSystem}</td>
                </tr>
                ` : ''}
                ${inputs.solarEnabled ? `
                <tr style="background-color: #f1f5f9;">
                  <td style="padding: 10px; border-radius: 4px 0 0 4px;">Solarthermie</td>
                  <td style="padding: 10px; text-align: right; font-weight: 600; border-radius: 0 4px 4px 0;">${inputs.solarArea} m² (${inputs.solarType === 'roehren' ? 'Röhren' : 'Flach'})</td>
                </tr>
                ` : ''}
              </table>
              
              <!-- Ihre Ergebnisse -->
              <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 8px;">Ihre Ergebnisse</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px; font-size: 14px;">
                <tr style="background-color: #ecfdf5;">
                  <td style="padding: 12px; border-radius: 4px 0 0 4px; font-weight: 600;">Nutzwärmebedarf</td>
                  <td style="padding: 12px; text-align: right; font-weight: 700; color: #0f766e; border-radius: 0 4px 4px 0;">${results.nutzwaerme_kwh_a.toLocaleString('de-AT')} kWh/a</td>
                </tr>
                <tr>
                  <td style="padding: 12px;">Stromkosten Wärmepumpe</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">${results.wpStromkosten_eur_a.toLocaleString('de-AT')} €/a</td>
                </tr>
                <tr style="background-color: #f1f5f9;">
                  <td style="padding: 12px; border-radius: 4px 0 0 4px;">CO₂ Emissionen</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600; border-radius: 0 4px 4px 0;">${(results.wpCo2_kg_a / 1000).toFixed(1)} t/a</td>
                </tr>
                <tr>
                  <td style="padding: 12px;">Effizienz (JAZ/SCOP)</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">${results.scop}</td>
                </tr>
                ${derived.selectedPackage ? `
                <tr style="background-color: #ecfdf5;">
                  <td style="padding: 12px; border-radius: 4px 0 0 4px; font-weight: 600;">Empfohlenes Paket</td>
                  <td style="padding: 12px; text-align: right; font-weight: 700; color: #0f766e; border-radius: 0 4px 4px 0;">${derived.selectedPackage}</td>
                </tr>
                ` : ''}
                ${derived.subsidyExpected > 0 ? `
                <tr>
                  <td style="padding: 12px;">Erwartete Förderung</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">ca. ${derived.subsidyExpected.toLocaleString('de-AT')} €</td>
                </tr>
                <tr style="background-color: #f1f5f9;">
                  <td style="padding: 12px; border-radius: 4px 0 0 4px;">Netto-Investition</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600; border-radius: 0 4px 4px 0;">ca. ${derived.investmentNet.toLocaleString('de-AT')} €</td>
                </tr>
                ` : ''}
                ${isComparisonMode && results.savings_eur_a !== null ? `
                <tr style="background-color: #dcfce7;">
                  <td style="padding: 12px; border-radius: 4px 0 0 4px; font-weight: 600;">Jährliche Ersparnis</td>
                  <td style="padding: 12px; text-align: right; font-weight: 700; color: #15803d; border-radius: 0 4px 4px 0;">${results.savings_eur_a.toLocaleString('de-AT')} €/a</td>
                </tr>
                ` : ''}
                ${isComparisonMode && results.amortisation_years !== null ? `
                <tr>
                  <td style="padding: 12px;">Amortisation</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">${results.amortisation_years} Jahre</td>
                </tr>
                ` : ''}
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://meine-waermepumpe.at/kontakt" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                      Kostenloses Erstgespräch vereinbaren
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                Alle Werte sind Schätzungen basierend auf Ihren Angaben und Durchschnittswerten. Eine genaue Planung erfolgt durch den Fachbetrieb.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                © ${new Date().getFullYear()} meine-waermepumpe.at
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        });
        console.log(`Heizkostenrechner results email successfully sent to ${validatedData.email}`);
      } catch (emailError: any) {
        console.error("Email error (heizkosten-lead) - Details:", JSON.stringify(emailError, null, 2));
        console.error("Email error message:", emailError.message || emailError);
      }

      // Notify internal team
      try {
        const { client: resendClient, fromEmail } = await getUncachableResendClient();
        const { inputs, results, derived } = validatedData;
        
        await resendClient.emails.send({
          from: fromEmail || "meine-waermepumpe.at <anfrage@meine-waermepumpe.at>",
          to: NOTIFICATION_EMAIL,
          subject: `Heizkostenrechner Lead: ${validatedData.email}`,
          html: `
            <h2>Neuer Heizkostenrechner-Lead</h2>
            <p><strong>E-Mail:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
            <h3>Eingaben</h3>
            <ul>
              <li>Gebäude: ${inputs.buildingClass}, ${inputs.area_m2} m²</li>
              <li>Heizsystem: ${inputs.currentHeatingSystem}</li>
              <li>Vorlauf: ${inputs.vorlaufTemp}°C, FBH: ${inputs.fbhPercent}%</li>
              <li>WP-Strompreis: ${inputs.wpPowerPrice} €/kWh</li>
            </ul>
            <h3>Ergebnisse</h3>
            <ul>
              <li>Nutzwärme: ${results.nutzwaerme_kwh_a} kWh/a</li>
              <li>WP-Stromkosten: ${results.wpStromkosten_eur_a} €/a</li>
              <li>SCOP: ${results.scop}</li>
              ${derived.selectedPackage ? `<li>Paket: ${derived.selectedPackage}</li>` : ''}
              ${results.savings_eur_a !== null ? `<li>Ersparnis: ${results.savings_eur_a} €/a</li>` : ''}
            </ul>
            <p style="font-size: 12px; color: #666;">Einwilligung erteilt: ${validatedData.consent.timestamp}</p>
          `,
        });
      } catch (notifyError: any) {
        console.error("Internal notification error:", notifyError.message || notifyError);
      }

      res.json({ ok: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          ok: false, 
          message: "Validierungsfehler", 
          errors: error.errors 
        });
      } else {
        console.error("Error in heizkosten-lead:", error);
        res.status(500).json({ 
          ok: false, 
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
