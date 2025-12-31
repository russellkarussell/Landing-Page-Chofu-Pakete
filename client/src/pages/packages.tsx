
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, X, ArrowRight, Zap, Thermometer, Ruler, Download, Coins } from "lucide-react";
import { PACKAGES, SUBSIDIES } from "@/lib/constants";
import { TrustCallout } from "@/components/brand-modules";
import { ChofuTrustBox } from "@/components/brand/ChofuTrustBox";

export default function Packages() {
  const [includeSolar, setIncludeSolar] = useState(false);

  // Helper to calculate effective price
  const getEffectivePrice = (price: number) => {
    // Logic: Max 30% funding cap is usually on TOTAL project cost.
    // Here we simplify for the mockup: Price - Flat Subsidy.
    // If solar is added, we assume the package price would technically increase (hardware costs), 
    // but for this "what-if" visualizer we'll just show the bonus effect on the funding side for simplicity,
    // OR we should be transparent that this is just the funding bonus.
    
    // Let's keep it simple: Show Price vs. Funding Amount.
    // Funding = Base + (Solar ? Bonus : 0)
    
    const funding = SUBSIDIES.base + (includeSolar ? SUBSIDIES.solar : 0);
    // Cap funding at 30% of price? 
    // The PDF says "max 30% of eligible costs".
    // Let's calculate the cap.
    const cap = price * SUBSIDIES.maxPercentage;
    const actualFunding = Math.min(funding, cap);
    
    return price - actualFunding;
  };

  const getFundingAmount = (price: number) => {
    const funding = SUBSIDIES.base + (includeSolar ? SUBSIDIES.solar : 0);
    const cap = price * SUBSIDIES.maxPercentage;
    return Math.min(funding, cap);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 text-sm font-medium">
            Fixpreis-Garantie
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
            Transparente Pakete für jedes Haus
          </h1>
          <p className="text-xl text-slate-600">
            Wählen Sie das passende System für Ihre Bedürfnisse. Inklusive Montage, Inbetriebnahme und Einschulung durch zertifizierte Fachpartner.
          </p>
        </div>

        {/* Subsidy Toggle */}
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="text-primary" />
              <h3 className="font-bold text-slate-900">Förder-Rechner</h3>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Kesseltausch 2026</Badge>
          </div>
          
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="space-y-1">
              <Label htmlFor="solar-mode" className="font-medium text-slate-900">Inklusive Solarthermie?</Label>
              <p className="text-xs text-slate-500">Zusätzlicher Bonus von € {SUBSIDIES.solar.toLocaleString()}</p>
            </div>
            <Switch 
              id="solar-mode" 
              checked={includeSolar}
              onCheckedChange={setIncludeSolar}
            />
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            *Die Berechnung berücksichtigt die maximale Förderung von 30% der Investitionskosten bzw. die Pauschalsätze.
          </p>
        </div>

        {/* CHOFU Trust Box - Compact Version */}
        <ChofuTrustBox />

        {/* Packages Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {PACKAGES.map((pkg) => {
            const funding = SUBSIDIES.base + (includeSolar ? SUBSIDIES.solar : 0);
            const cap = pkg.price * SUBSIDIES.maxPercentage;
            const fundingAmount = Math.min(funding, cap);
            const isCapped = fundingAmount === cap;
            
            const effectivePrice = pkg.price - fundingAmount;

            return (
              <Card key={pkg.id} className={`flex flex-col border-0 shadow-xl overflow-hidden ${pkg.highlight ? 'ring-2 ring-primary relative scale-[1.02] z-10' : 'bg-white'}`}>
                {pkg.highlight && (
                  <div className="bg-primary text-white text-center py-2 text-sm font-bold uppercase tracking-wider">
                    Bestseller
                  </div>
                )}
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">{pkg.name}</h3>
                    <Badge variant="outline" className="font-mono">{pkg.kw} kW</Badge>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                     <div className="flex items-baseline gap-2 text-slate-400 line-through text-lg">
                        € {pkg.price.toLocaleString()}
                     </div>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-heading font-bold text-primary">€ {effectivePrice.toLocaleString()}</span>
                        <span className="text-slate-500 font-medium">*</span>
                     </div>
                     <p className="text-sm text-slate-500">Effektiver Preis nach Förderung</p>
                  </div>
                  
                  <div className="bg-green-100/50 text-green-800 text-xs font-bold px-3 py-2 rounded-lg inline-block border border-green-200">
                    - € {fundingAmount.toLocaleString()} Förderung {includeSolar && "+ Solarbonus"} abgezogen
                    {isCapped && (
                      <div className="text-amber-700 font-normal mt-1 border-t border-green-200 pt-1 flex items-start gap-1">
                        <span className="text-[10px] leading-tight">Maximal 30% der Investitionskosten förderbar.</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow pt-8 space-y-8">
                  <TrustCallout />
                  
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Ruler size={16} className="text-primary" /> Geeignet für:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.suitability.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Im Paket enthalten:</h4>
                    <ul className="space-y-3">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                          <div className="mt-0.5 rounded-full bg-green-100 p-0.5">
                            <Check className="text-green-600 w-3 h-3" />
                          </div>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="pb-8 pt-4 bg-slate-50/50 border-t border-slate-100">
                  <Button className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all" variant={pkg.highlight ? "default" : "outline"} asChild>
                    <Link href="/kontakt">
                      Termin vereinbaren
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Detailed Comparison Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="p-8 border-b border-slate-200 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-900">Leistungsumfang im Detail</h3>
            <p className="text-slate-500">Was Sie bekommen – und was bauseits zu erledigen ist.</p>
          </div>
          
          <div className="grid md:grid-cols-2">
            <div className="p-8 space-y-6">
              <h4 className="font-bold text-green-700 flex items-center gap-2 text-lg">
                <Check className="h-6 w-6" /> Enthaltene Leistungen
              </h4>
              <ul className="space-y-4">
                {[
                  "Lieferung und Einbringung der Wärmepumpe",
                  "Montage des Monoblocks auf vorbereitetem Fundament",
                  "Anschluss an das bestehende Heizungssystem (bis 5m)",
                  "Elektrischer Anschluss (ab Sicherheitsschalter)",
                  "Inbetriebnahme durch zertifizierten Techniker",
                  "Einschulung in die Bedienung",
                  "Entsorgung der Verpackungsmaterialien"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <Check className="text-green-600 h-5 w-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 space-y-6 bg-slate-50/50 border-l border-slate-200">
              <h4 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
                <X className="h-6 w-6 text-slate-400" /> Bauseits zu leisten / Nicht enthalten
              </h4>
              <ul className="space-y-4">
                {[
                  "Betonfundament für Außeneinheit",
                  "Hauptstromzuleitung bis zum Aufstellort",
                  "Demontage & Entsorgung des alten Kessels",
                  "Hydraulischer Abgleich der Heizkörper",
                  "Wanddurchbrüche (falls notwendig)",
                  "Stemmarbeiten und Wiederherstellung"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-500">
                    <X className="text-slate-300 h-5 w-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Datasheet Download Mockup */}
        <div className="mt-16 text-center">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-900 gap-2">
            <Download size={18} />
            Technisches Datenblatt (PDF) herunterladen
          </Button>
        </div>

      </div>
    </div>
  );
}
