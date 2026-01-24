
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowRight, Zap, ShieldCheck, Euro, Coins, Info, Home as HomeIcon, Building, Loader2, Calculator } from "lucide-react";
import { BUNDESLAENDER, PACKAGES, SUBSIDIES, formatEUR, getSubsidy, getNetPrice } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import type { Partner } from "@shared/schema";
import heroImage from "@/assets/hero-modern-house-bg.png";
import { motion } from "framer-motion";
import ehpaLabel from "@assets/image_1767188918778.png";
import { ChofuHomepageTeaser } from "@/components/brand/ChofuHomepageTeaser";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PriceDisclaimer } from "@/components/price-disclaimer";

// Custom Icons for Building Types
const IconAltbau = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10L12 3L21 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10V21H19V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="8" y="14" width="3" height="3" stroke="currentColor" strokeWidth="1.5" />
    <rect x="13" y="14" width="3" height="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 21H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconSaniert = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10L12 3L21 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10V21H19V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="7" y="13" width="10" height="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 13V19" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M19 5L22 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

const IconNeubau = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="6" width="16" height="15" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 10H20" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="7" y="13" width="10" height="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 2L10 5H14L16 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Home() {
  const [selectedBundesland, setSelectedBundesland] = useState<string>("Wien");
  
  const { data: allPartners = [] } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });
  
  const partnersForBundesland = allPartners.filter(p => p.bundeslaender?.includes(selectedBundesland));
  const [calcStep, setCalcStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  // Mini Calculator State
  const [calcData, setCalcData] = useState({ size: "140", type: "Saniert" });
  const [result, setResult] = useState<{
    low: string;
    high: string;
    recommendation: string;
    suitability: "Sehr gut geeignet" | "Geeignet" | "Details prüfen";
    suitabilityColor: string;
  } | null>(null);

  const handleCalc = () => {
    // Validation
    const area = parseFloat(calcData.size);
    if (!area || area < 40 || area > 350) {
      // Input validation handled by UI feedback or simple return for now
      return;
    }

    setIsCalculating(true);

    // Factors
    const factors: Record<string, number> = {
      "Altbau": 80,
      "Saniert": 60,
      "Neubau": 40
    };
    
    const factor = factors[calcData.type] || 60;
    const heatLoadkW = (area * factor) / 1000;
    
    // Uncertainty band +/- 15%
    const low = heatLoadkW * 0.85;
    const high = heatLoadkW * 1.15;

    // Recommendation logic
    let recommendation = "";
    if (high <= 4.5) {
      recommendation = "CHOFU 4 kW";
    } else if (high <= 7.0) {
      recommendation = "CHOFU 6 kW";
    } else {
      recommendation = "CHOFU 10 kW";
    }

    // Suitability logic
    let suitability: "Sehr gut geeignet" | "Geeignet" | "Details prüfen" = "Geeignet";
    let suitabilityColor = "bg-blue-100 text-blue-700 border-blue-200";

    if (calcData.type === "Neubau" && high <= 4.5) {
      suitability = "Sehr gut geeignet";
      suitabilityColor = "bg-green-100 text-green-700 border-green-200";
    } else if (calcData.type === "Saniert" && high <= 7.0) {
      suitability = "Geeignet";
      suitabilityColor = "bg-blue-100 text-blue-700 border-blue-200";
    } else if (calcData.type === "Altbau" && high >= 9.0) {
      suitability = "Details prüfen";
      suitabilityColor = "bg-amber-100 text-amber-700 border-amber-200";
    }

    // Simulate delay
    setTimeout(() => {
      setResult({
        low: low.toFixed(1),
        high: high.toFixed(1),
        recommendation,
        suitability,
        suitabilityColor
      });
      setCalcStep(2);
      setIsCalculating(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-50 overflow-hidden">
        {/* Technical Grid Background */}
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />
           <img 
            src={heroImage} 
            alt="Moderne Wärmepumpe Österreich Hintergrund" 
            className="w-full h-full object-cover object-center grayscale-[10%]"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20">
          
          {/* Left: Text Content */}
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-3 bg-white text-slate-700 px-4 py-2 text-sm font-bold border border-slate-200 shadow-sm rounded-none tracking-wide">
              <Zap size={16} className="text-accent fill-accent" />
              <span>JAPANISCHE TECHNOLOGIE. ÖSTERREICHISCHER SERVICE.</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight text-[#e5232b]">
              <span className="font-black">CHOFU</span> Wärmepumpen. <br/>
              <span className="text-primary">Präzision zum Fixpreis.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
              Hocheffiziente R290 Monoblock-Systeme. Robust, langlebig und perfekt abgestimmt auf Ihr Zuhause. Inklusive Installation durch zertifizierte Partner.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-none rounded-none bg-primary hover:bg-primary/90 text-white">
                <Link href="/kontakt">
                  Beratung anfordern
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary hover:bg-white rounded-none">
                <Link href="/pakete">
                  Modelle & Preise
                </Link>
              </Button>
            </div>
            
          </div>

          {/* Right: Technical Stats / Calc */}
          <div className="lg:pl-12 animate-in slide-in-from-right duration-700 delay-200 lg:bg-transparent">
             {/* Efficiency Check Module */}
            <Card className="bg-white border border-slate-200 shadow-xl rounded-xl relative overflow-hidden max-w-md mx-auto lg:ml-auto">
              {/* Header Row */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-none mb-1">Effizienz-Check</h3>
                  <p className="text-xs text-slate-500 font-medium">Prüfen Sie Ihre Eignung (Orientierungswert)</p>
                </div>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 cursor-help transition-colors">
                        <Info size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-[200px] text-xs">
                      Der Check liefert eine grobe Orientierung. Die finale Auslegung erfolgt bei der Besichtigung.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <CardContent className="p-6">
                {calcStep === 1 ? (
                  <div className="space-y-6">
                    {/* Wohnfläche Input */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="area" className="text-xs uppercase font-bold text-slate-500 tracking-wider">Wohnfläche</Label>
                        <span className="font-bold text-primary text-lg">{calcData.size || 140} <span className="text-sm font-normal text-slate-400">m²</span></span>
                      </div>
                      
                      <div className="px-1">
                        <Slider 
                          defaultValue={[parseInt(calcData.size || "140")]} 
                          max={350} 
                          min={40} 
                          step={10} 
                          onValueChange={(vals) => setCalcData({...calcData, size: vals[0].toString()})}
                          className="py-4"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 pl-1">Beheizte Wohnfläche (ca.)</p>
                    </div>

                    {/* Gebäudetyp Input */}
                    <div className="space-y-4">
                      <Label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Gebäudetyp</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "Altbau", label: "Altbau (vor 1990)", Icon: IconAltbau },
                          { id: "Saniert", label: "Teilsaniert", Icon: IconSaniert },
                          { id: "Neubau", label: "Neubau (nach 2010)", Icon: IconNeubau },
                        ].map((type) => {
                          const isSelected = calcData.type === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => setCalcData({...calcData, type: type.id})}
                              className={`
                                relative rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-3 h-28 transition-all duration-300 group
                                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                                ${isSelected 
                                  ? 'border-primary bg-primary/5 shadow-md' 
                                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                }
                              `}
                              type="button"
                              aria-pressed={isSelected}
                              aria-label={type.label}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2 text-primary animate-in fade-in zoom-in duration-300">
                                  <Check size={14} strokeWidth={4} />
                                </div>
                              )}
                              
                              <type.Icon 
                                className={`w-10 h-10 transition-colors duration-300 ${
                                  isSelected 
                                    ? 'text-primary' 
                                    : 'text-slate-300 group-hover:text-slate-500'
                                }`} 
                              />
                              
                              <span className={`text-[11px] font-bold leading-tight transition-colors duration-300 ${
                                isSelected ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700'
                              }`}>
                                {type.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-slate-400 pl-1 text-center">Wärmeschutz grob (für erste Einschätzung)</p>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      className="w-full h-12 mt-2 rounded-lg font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" 
                      onClick={handleCalc}
                      disabled={!calcData.size || isCalculating || parseInt(calcData.size) < 40 || parseInt(calcData.size) > 350}
                    >
                      {isCalculating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Berechne...
                        </>
                      ) : (
                        <>
                          Potenzial berechnen <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    
                    {/* Validation Error Message */}
                    {calcData.size && (parseInt(calcData.size) < 40 || parseInt(calcData.size) > 350) && (
                      <p className="text-xs text-red-500 text-center font-medium mt-2">
                        Bitte geben Sie eine Wohnfläche zwischen 40 und 350 m² ein.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    {/* Result Header Badge */}
                    <div className="flex justify-center mb-2">
                      <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${result?.suitabilityColor} flex items-center gap-2`}>
                        {result?.suitability === "Sehr gut geeignet" && <Check size={16} strokeWidth={3} />}
                        {result?.suitability === "Geeignet" && <Check size={16} strokeWidth={3} />}
                        {result?.suitability === "Details prüfen" && <Info size={16} strokeWidth={3} />}
                        {result?.suitability}
                      </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Heizlast</div>
                        <div className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                          {result?.low}–{result?.high} <span className="text-xs text-slate-500 font-normal">kW</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center ring-1 ring-primary/20 bg-primary/5">
                        <div className="text-[10px] uppercase text-primary font-bold mb-1">Empfehlung</div>
                        <div className="font-bold text-primary text-sm md:text-base leading-tight">
                          {result?.recommendation}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Gebäude</div>
                        <div className="font-bold text-slate-900 text-sm md:text-base leading-tight truncate">
                          {calcData.type}
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-slate-500 leading-relaxed text-center px-2">
                      Die Empfehlung basiert auf einer konservativen Heizlast-Schätzung. Für exakte Auslegung (Hydraulik, Heizflächen, Vorlauftemperaturen) empfehlen wir die Besichtigung.
                    </p>

                    {/* CTAs */}
                    <div className="space-y-3 pt-2">
                      <Button asChild className="w-full h-12 rounded-lg font-bold shadow-md hover:shadow-lg transition-all">
                         <Link href={`/kontakt?area=${calcData.size}&type=${calcData.type}&recommendation=${encodeURIComponent(result?.recommendation || "")}`}>Kostenlosen Besichtigungstermin</Link>
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        className="w-full h-10 rounded-lg text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Link href="/rechner">
                          <Calculator size={16} className="mr-2" /> Zum Heizkostenrechner
                        </Link>
                      </Button>
                      
                      <button 
                        onClick={() => setCalcStep(1)}
                        className="w-full text-center text-xs text-slate-400 hover:text-primary transition-colors mt-2"
                      >
                        Neu berechnen
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Brand Section (New) */}

      <ChofuHomepageTeaser />
      {/* Subsidy Info Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
             <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-wider text-sm">
                  <div className="h-px w-8 bg-primary"></div>
                  <span>Förderoffensive 2026</span>
                </div>
                <h2 className="text-3xl font-heading font-extrabold text-slate-900 leading-tight">
                  Staatliche Förderung für <br/>klimafreundliche Technologie.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Nutzen Sie die aktuelle Förderaktion "Kesseltausch". Chofu Wärmepumpen erfüllen alle technischen Voraussetzungen für die maximale Förderhöhe.
                </p>
                <a 
                  href="https://www.sanierungsoffensive.gv.at/kesseltausch/ein-zweifamilienhaus-oder-reihenhaus" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                >
                  Mehr Informationen zur Förderung <ArrowRight size={16} />
                </a>
                <div className="flex gap-8 pt-4">
                  <div>
                    <span className="block text-4xl font-heading font-bold text-slate-900">€{SUBSIDIES.base.toLocaleString()}</span>
                    <span className="text-sm text-slate-500 uppercase tracking-wide font-medium">Basis-Förderung</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-heading font-bold text-slate-900">+€{SUBSIDIES.solar.toLocaleString()}</span>
                    <span className="text-sm text-slate-500 uppercase tracking-wide font-medium">Solar-Bonus</span>
                  </div>
                </div>
             </div>
             
             {/* Tech Badge */}
             <div className="relative p-1 bg-gradient-to-br from-slate-100 to-slate-200 rounded-none border border-slate-200 w-full max-w-sm">
                <div className="bg-white p-6 text-center space-y-4">
                  <div className="mx-auto flex items-center justify-center">
                    <img src={ehpaLabel} alt="EHPA Gütesiegel" className="h-32 w-auto object-contain" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg uppercase tracking-wide">EHPA Gütesiegel</h3>
                  <p className="text-sm text-slate-500">Unsere Anlagen sind zertifiziert und voll förderfähig in ganz Österreich.</p>
                </div>
             </div>
          </div>
        </div>
      </section>
      {/* Packages Preview Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4 uppercase tracking-tight">
              Modelle & Ausstattung
            </h2>
            <p className="text-lg text-slate-600">
              Wählen Sie die passende Leistungsklasse für Ihr Objekt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => {
               const subsidy = getSubsidy(pkg.price);
               const netPrice = getNetPrice(pkg.price, subsidy);
               
               return (
              <Card key={pkg.id} className={`flex flex-col border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative rounded-none ${pkg.highlight ? 'ring-2 ring-primary z-10' : 'bg-white'}`}>
                {pkg.highlight && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                    Empfehlung
                  </div>
                )}
                <CardHeader className="bg-white border-b border-slate-100 pt-8 pb-6">
                  <div className="mb-2 text-primary font-mono text-sm font-bold uppercase tracking-wider">Serie {pkg.kw}KW</div>
                  <CardTitle className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{pkg.name}</CardTitle>
                  <div className="mt-6 flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                       <span className="text-sm text-slate-500 font-medium uppercase">ab</span>
                       <span className="text-2xl font-bold text-slate-700">{formatEUR(pkg.price)}</span>
                    </div>
                    <div className="text-sm text-green-600 font-bold">
                       abzgl. Förderung: − {formatEUR(subsidy)}
                    </div>
                    <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-slate-100">
                        <span className="text-sm text-slate-500 font-bold uppercase">Endpreis ab:</span>
                        <span className="text-4xl font-heading font-extrabold text-primary">{formatEUR(netPrice)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-8 bg-slate-50/50">
                  <ul className="space-y-4">
                    {pkg.features.slice(0, 5).map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 bg-primary mt-2 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 pb-8 bg-white border-t border-slate-100">
                  <Button asChild variant={pkg.highlight ? "default" : "outline"} className={`w-full h-12 rounded-none font-bold uppercase tracking-wide ${pkg.highlight ? '' : 'border-slate-300 text-slate-700'}`}>
                    <Link href={`/pakete`}>
                      Details ansehen
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )})}
          </div>
          <PriceDisclaimer />
        </div>
      </section>
      {/* Partners Section (Redesigned) */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-wider text-sm mb-4">
                <div className="h-px w-8 bg-primary"></div>
                <span>Installation & Service</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-6 leading-tight">
                Zertifizierte <br/>Fachpartner.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Die Qualität der Installation ist entscheidend für die Effizienz der Anlage. Deshalb arbeiten wir nur mit geschulten Fachbetrieben, die unsere hohen Qualitätsstandards erfüllen.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 border border-slate-200 bg-slate-50">
                   <h4 className="font-bold text-slate-900 mb-2 uppercase text-sm">Meisterbetriebe</h4>
                   <p className="text-sm text-slate-500">Ausgewählte Partner mit langjähriger Erfahrung.</p>
                </div>
                <div className="p-4 border border-slate-200 bg-slate-50">
                   <h4 className="font-bold text-slate-900 mb-2 uppercase text-sm">Faire Preise</h4>
                   <p className="text-sm text-slate-500">Transparente Kosten für Material und Arbeit.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-none text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 font-heading">Partner finden</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-xs uppercase font-bold">Bundesland</Label>
                    <Select value={selectedBundesland} onValueChange={setSelectedBundesland}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12 rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white rounded-none">
                        {BUNDESLAENDER.map(b => (
                          <SelectItem key={b} value={b} className="focus:bg-slate-700 focus:text-white">{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 pt-4">
                    {partnersForBundesland.length > 0 ? (
                      partnersForBundesland.map((partner, i) => (
                        <Link key={partner.id} href={`/partner/${partner.slug}`}>
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <div>
                              <p className="font-bold text-white text-sm">{partner.name}</p>
                              <p className="text-xs text-slate-400">{partner.description}</p>
                            </div>
                            <ArrowRight size={16} className="text-primary" />
                          </motion.div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm py-4">Noch keine Partner in {selectedBundesland} vorhanden.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-8 tracking-tight">
            Starten Sie Ihr Projekt.
          </h2>
          <Button asChild size="lg" className="h-16 px-10 text-lg font-bold bg-white text-primary hover:bg-slate-100 rounded-none shadow-xl">
            <Link href="/kontakt">
              Kostenloses Erstgespräch vereinbaren
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
