
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, Ruler, Download, Info } from "lucide-react";
import { PACKAGES, SUBSIDIES, formatEUR, getSubsidy, getNetPrice } from "@/lib/constants";
import { PackagesTrustRow } from "@/components/brand/PackagesTrustRow";
import chofu4kw from "@assets/image_1767196454458.png";
import chofu6kw from "@assets/image_1767196466560.png";
import chofu10kw from "@/assets/chofu-10kw.png";
import { PackageContentsAccordion } from "@/components/packages/PackageContentsAccordion";

export default function Packages() {
  const includeSolar = false;

  // Image mapping helper
  const getPackageImage = (kw: number) => {
    switch(kw) {
      case 4: return chofu4kw;
      case 6: return chofu6kw;
      case 10: return chofu10kw;
      default: return chofu6kw;
    }
  };

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

        {/* Packages Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {PACKAGES.map((pkg) => {
            const subsidy = getSubsidy(pkg.price, includeSolar);
            const netPrice = getNetPrice(pkg.price, subsidy);
            // Check if capped for UI message (subsidy is returned as min(funding, cap))
            const fundingPotential = SUBSIDIES.base + (includeSolar ? SUBSIDIES.solar : 0);
            const cap = pkg.price * SUBSIDIES.maxPercentage;
            const isCapped = subsidy === cap && cap < fundingPotential;
            
            return (
              <Card key={pkg.id} className={`flex flex-col border-0 shadow-xl overflow-hidden ${pkg.highlight ? 'ring-2 ring-primary relative scale-[1.02] z-10' : 'bg-white'}`}>
                {pkg.highlight && (
                  <div className="bg-primary text-white text-center py-2 text-sm font-bold uppercase tracking-wider">
                    Bestseller
                  </div>
                )}
                {/* Product Image Area */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img 
                    src={getPackageImage(pkg.kw)} 
                    alt={`CHOFU Wärmepumpe Außeneinheit – ${pkg.kw} kW Paket`}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-8 pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">{pkg.name}</h3>
                    <Badge variant="outline" className="font-mono">{pkg.kw} kW</Badge>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                     <div className="flex items-baseline gap-2 text-slate-400 line-through text-lg">
                        {formatEUR(pkg.price)}
                     </div>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-heading font-bold text-primary">{formatEUR(netPrice)}</span>
                        <span className="text-slate-500 font-medium">*</span>
                     </div>
                     <p className="text-sm text-slate-500">Endpreis ab (nach Förderung)</p>
                  </div>
                  
                  <div className="bg-green-100/50 text-green-800 text-xs font-bold px-3 py-2 rounded-lg inline-block border border-green-200 w-full">
                    <div className="flex justify-between items-center w-full">
                       <span>Abzgl. Förderung:</span>
                       <span>− {formatEUR(subsidy)}</span>
                    </div>
                    {includeSolar && <div className="text-[10px] text-green-700 font-normal mt-0.5">(inkl. Solarbonus)</div>}

                    {isCapped && (
                      <div className="text-amber-700 font-normal mt-1 border-t border-green-200 pt-1 flex items-start gap-1">
                        <span className="text-[10px] leading-tight">Maximal 30% der Investitionskosten förderbar.</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow pt-8 space-y-8">
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

                  <PackageContentsAccordion kw={pkg.kw} />
                </CardContent>

                <CardFooter className="pb-8 pt-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
                  <Button className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all" variant={pkg.highlight ? "default" : "outline"} asChild>
                    <Link href="/kontakt">
                      Termin vereinbaren
                    </Link>
                  </Button>
                  
                  {pkg.kw === 10 && (
                     <Button variant="ghost" className="w-full text-slate-500 hover:text-primary hover:bg-primary/5" asChild>
                        <Link href="/waermepumpe/10kw">
                          Details zur 10 kW Wärmepumpe <ArrowRight size={14} className="ml-1" />
                        </Link>
                     </Button>
                  )}
                  {pkg.kw === 6 && (
                     <Button variant="ghost" className="w-full text-slate-500 hover:text-primary hover:bg-primary/5" asChild>
                        <Link href="/waermepumpe/6kw">
                          Details zur 6 kW Wärmepumpe <ArrowRight size={14} className="ml-1" />
                        </Link>
                     </Button>
                  )}
                  {pkg.kw === 4 && (
                     <Button variant="ghost" className="w-full text-slate-500 hover:text-primary hover:bg-primary/5" asChild>
                        <Link href="/waermepumpe/4kw">
                          Details zur 4 kW Wärmepumpe <ArrowRight size={14} className="ml-1" />
                        </Link>
                     </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Trust Row (Funding + CHOFU) */}
        <PackagesTrustRow />

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
