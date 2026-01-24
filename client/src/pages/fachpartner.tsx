import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Globe, ArrowRight, Users } from "lucide-react";
import { BUNDESLAENDER } from "@/lib/constants";
import type { Partner } from "@shared/schema";

export default function Fachpartner() {
  const [selectedBundesland, setSelectedBundesland] = useState<string>("all");

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const filteredPartners = selectedBundesland === "all" 
    ? partners 
    : partners.filter(p => p.bundeslaender?.includes(selectedBundesland));

  const partnersByBundesland = BUNDESLAENDER.reduce((acc, bl) => {
    acc[bl] = filteredPartners.filter(p => p.bundeslaender?.includes(bl));
    return acc;
  }, {} as Record<string, Partner[]>);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Zertifizierte Installateure
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Unsere Fachpartner in<br />ganz Österreich
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Qualifizierte Installateure für Ihre neue Wärmepumpe. 
              Alle Partner sind von uns geschult und zertifiziert.
            </p>
            
            <div className="max-w-xs mx-auto">
              <Select value={selectedBundesland} onValueChange={setSelectedBundesland}>
                <SelectTrigger className="bg-white" data-testid="select-filter-bundesland">
                  <SelectValue placeholder="Bundesland filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Bundesländer</SelectItem>
                  {BUNDESLAENDER.map((bl) => (
                    <SelectItem key={bl} value={bl}>{bl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Partner werden geladen...</div>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                {selectedBundesland === "all" 
                  ? "Noch keine Partner vorhanden." 
                  : `Noch keine Partner in ${selectedBundesland} vorhanden.`}
              </p>
            </div>
          ) : selectedBundesland === "all" ? (
            <div className="space-y-12">
              {BUNDESLAENDER.filter(bl => partnersByBundesland[bl].length > 0).map((bundesland) => (
                <div key={bundesland}>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-slate-900">{bundesland}</h2>
                    <span className="text-sm text-slate-500">({partnersByBundesland[bundesland].length} Partner)</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partnersByBundesland[bundesland].map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Sie sind Installateur?</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Werden Sie Teil unseres Partnernetzwerks und profitieren Sie von unseren hochwertigen Produkten und Schulungen.
          </p>
          <Link href="/kontakt">
            <Button size="lg" data-testid="button-become-partner">
              Partner werden
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow" data-testid={`card-partner-${partner.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {partner.logoUrl ? (
            <img 
              src={partner.logoUrl} 
              alt={partner.name} 
              className="w-16 h-16 object-contain rounded-lg bg-slate-50 p-1"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{partner.name.charAt(0)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 truncate" data-testid={`text-name-${partner.id}`}>
              {partner.name}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {partner.bundeslaender?.join(", ")}
            </p>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{partner.description}</p>

        {partner.services && partner.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {partner.services.slice(0, 3).map((s, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {s}
              </span>
            ))}
            {partner.services.length > 3 && (
              <span className="text-xs text-slate-400">+{partner.services.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-3">
            {partner.phone && (
              <a href={`tel:${partner.phone}`} className="text-slate-400 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            )}
            {partner.website && (
              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
          <Link href={`/partner/${partner.slug}`}>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors" data-testid={`button-view-${partner.id}`}>
              Profil ansehen
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
