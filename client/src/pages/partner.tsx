import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Globe, MapPin, ArrowLeft, CheckCircle } from "lucide-react";
import type { Partner, PartnerReference } from "@shared/schema";

type PartnerWithRefs = Partner & { references?: PartnerReference[] };

export default function PartnerProfile() {
  const [, params] = useRoute("/partner/:slug");
  const slug = params?.slug;

  const { data: partner, isLoading, error } = useQuery<PartnerWithRefs>({
    queryKey: [`/api/partners/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Laden...</div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Partner nicht gefunden</h1>
        <Link href="/fachpartner">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Übersicht
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <Link href="/fachpartner">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Alle Fachpartner
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {partner.logoUrl ? (
              <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="w-32 h-32 object-contain bg-white rounded-xl shadow-lg p-4"
              />
            ) : (
              <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">{partner.name.charAt(0)}</span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" data-testid="text-partner-name">
                {partner.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-lg">{partner.bundesland}</span>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl" data-testid="text-partner-description">
                {partner.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {partner.services && partner.services.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Leistungen</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {partner.services.map((service, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {partner.references && partner.references.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Referenzprojekte</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partner.references.map((ref) => (
                    <div key={ref.id} className="group relative overflow-hidden rounded-xl">
                      <img 
                        src={ref.imageUrl} 
                        alt={ref.caption || "Referenzprojekt"} 
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      {ref.caption && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm">{ref.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Kontakt</h2>
                {partner.phone && (
                  <a 
                    href={`tel:${partner.phone}`} 
                    className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors"
                    data-testid="link-phone"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{partner.phone}</span>
                  </a>
                )}
                {partner.website && (
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors"
                    data-testid="link-website"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Website besuchen</span>
                  </a>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Jetzt Anfrage stellen</h3>
                <p className="text-sm text-white/80 mb-4">
                  Lassen Sie sich unverbindlich zu Ihrer neuen Wärmepumpe beraten.
                </p>
                <Link href="/kontakt">
                  <Button variant="secondary" className="w-full" data-testid="button-contact">
                    Anfrage senden
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
