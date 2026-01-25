import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  Flame, 
  Zap, 
  Leaf, 
  Check, 
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- Configuration & Constants ---

const CONFIG = {
  energyFactors: { heizoel: 9.9, erdgas_h: 10.6, erdgas_l: 9.2, fluessiggas: 6.7, pellets: 4.9, strom: 1.0, keine: 0 },
  defaultPrices: {
    heizoel: 1.03, erdgas_h: 1.166, erdgas_l: 1.012, 
    fluessiggas: 0.70, pellets: 0.30, strom: 0.25, keine: 0
  },
  defaultWirkungsgrade: {
    heizoel: 80, erdgas_h: 82, erdgas_l: 82, fluessiggas: 85, pellets: 88, strom: 100, keine: 100
  },
  co2FactorsKwhInput: {
    heizoel: 0.269, erdgas_h: 0.202, erdgas_l: 0.202, fluessiggas: 0.230,
    pellets: 0.02, strom: 0.22, keine: 0
  },
  stromCo2Faktor: 0.22,
  heatingHoursPerYear: 2000,
  specificHeatLoad: { alt_unsaniert: 100, alt_teilsaniert: 70, alt_saniert: 50, neubau: 40, niedrigenergie: 30 },
  solarYieldFactors: { flach: 350, roehren: 450 },
  heizkoerperventilatorEffekt: 5,
};

// Energy demand derived: specificHeatLoad(W/m²) × heatingHoursPerYear(2000) / 1000 = kWh/m²·a
const BUILDING_CLASSES = [
  { value: "alt_unsaniert", label: "Altbau, unsaniert", desc: "~200 kWh/m²·a", load: "~100 W/m²" },
  { value: "alt_teilsaniert", label: "Altbau, teilsaniert", desc: "~140 kWh/m²·a", load: "~70 W/m²" },
  { value: "alt_saniert", label: "Altbau, saniert", desc: "~100 kWh/m²·a", load: "~50 W/m²" },
  { value: "neubau", label: "Neubau", desc: "~80 kWh/m²·a", load: "~40 W/m²" },
  { value: "niedrigenergie", label: "Niedrigenergiehaus", desc: "~60 kWh/m²·a", load: "~30 W/m²" }
];

const HEATING_SYSTEMS = [
  { value: "heizoel", label: "Heizöl (EL)" },
  { value: "erdgas_h", label: "Erdgas (H-Gas)" },
  { value: "erdgas_l", label: "Erdgas (L-Gas)" },
  { value: "fluessiggas", label: "Flüssiggas" },
  { value: "pellets", label: "Holzpellets" },
  { value: "strom", label: "Strom (Direkt)" },
  { value: "keine", label: "Keine / Neubau" }
];

// --- Helper Components ---

const StepHeader = ({ step, title }: { step: number; title: string }) => (
  <div className="mb-8 text-center">
    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
      Schritt {step} von 4
    </span>
    <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">{title}</h2>
  </div>
);

const ResultRow = ({ label, value, unit, highlight = false, negative = false }: any) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
    <span className="text-slate-600 font-medium">{label}</span>
    <span className={cn(
      "font-bold text-lg",
      highlight ? "text-primary" : "text-slate-900",
      negative ? "text-red-500" : ""
    )}>
      {value} <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
    </span>
  </div>
);

// --- Main Component ---

export default function Heizkostenrechner() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    method: "flaeche", // "flaeche" | "verbrauch"
    verbrauch: 2000,
    flaeche: 150,
    gebaeudeklasse: "alt_unsaniert",
    heizsystem: "heizoel",
    wirkungsgradAlt: 80,
    preisAlt: 1.03,
    
    // Step 2
    strompreisWP: 0.25,
    anteilFussboden: 50,
    vorlaufTemp: 55,
    warmwasserAnteilPct: 20,
    
    // Step 2 - Optimization
    hasSolarthermie: false,
    solarType: "flach",
    solarArea: 4,
    hasFans: false,
    
    // Step 3
    investition: 22000,
    foerderung: 16000,
    wartungAlt: 150,
    wartungNeu: 250,
  });

  const [results, setResults] = useState<any>({});
  const [hasUserModifiedInvest, setHasUserModifiedInvest] = useState(false);
  const [preisManuellGeaendert, setPreisManuellGeaendert] = useState(false);
  const [etaManuellGeaendert, setEtaManuellGeaendert] = useState(false);

  // Calculations
  useEffect(() => {
    calculateResults();
  }, [data]);

  // Handle heating system change - auto-update defaults unless manually modified
  const handleHeizsystemChange = (newSystem: string) => {
    const updates: any = { heizsystem: newSystem };
    
    // Force flaeche method for "keine"
    if (newSystem === "keine") {
      updates.method = "flaeche";
    }
    
    // Update defaults if not manually changed
    if (!preisManuellGeaendert) {
      updates.preisAlt = CONFIG.defaultPrices[newSystem as keyof typeof CONFIG.defaultPrices] || 0;
    }
    if (!etaManuellGeaendert) {
      updates.wirkungsgradAlt = CONFIG.defaultWirkungsgrade[newSystem as keyof typeof CONFIG.defaultWirkungsgrade] || 100;
    }
    
    setData(prev => ({ ...prev, ...updates }));
  };

  // Update defaults for Investment based on calculated load
  useEffect(() => {
    // Calculate load immediately based on current data
    const specLoad = CONFIG.specificHeatLoad[data.gebaeudeklasse as keyof typeof CONFIG.specificHeatLoad] || 50;
    const estimatedLoadKw = (data.flaeche * specLoad) / 1000;

    if (!hasUserModifiedInvest) {
       let suggestedInvest = 22000;
       
       if (estimatedLoadKw < 5) suggestedInvest = 20000; // 4kW Package
       else if (estimatedLoadKw < 8) suggestedInvest = 22000; // 6kW Package
       else suggestedInvest = 23000; // 10kW Package

       // Calculate Subsidy (User Logic: 30% max 7500)
       // Base: 30% of Invest, capped at 7500
       const calculatedPercentage = suggestedInvest * 0.30;
       let maxCap = 7500;
       
       // Assuming Solar Bonus increases the cap or is added on top?
       // Usually flat rate bonuses are added ON TOP of percentage calcs or limits.
       // Let's assume 30% rule applies to base, then + bonus.
       // But user said "invest 20k -> 6k funding", which is exactly 30%.
       
       let suggestedSubsidy = Math.min(calculatedPercentage, maxCap);
       
       if (data.hasSolarthermie) suggestedSubsidy += 2500;

       setData(prev => ({
         ...prev,
         investition: suggestedInvest,
         foerderung: Math.round(suggestedSubsidy / 100) * 100 // Round to nearest 100
       }));
    }
  }, [data.flaeche, data.gebaeudeklasse, data.hasSolarthermie, hasUserModifiedInvest]);

  const calculateResults = () => {
    let nutzwaermeBedarf = 0;
    let kostenAktuell = 0;
    let co2Alt = 0;
    
    // 1. Demand & Old System
    if (data.method === "verbrauch" && data.heizsystem !== "keine") {
      const factor = CONFIG.energyFactors[data.heizsystem as keyof typeof CONFIG.energyFactors];
      const energieInput = data.verbrauch * factor; // kWh
      nutzwaermeBedarf = energieInput * (data.wirkungsgradAlt / 100);
      
      kostenAktuell = data.verbrauch * data.preisAlt;
      
      const co2Factor = CONFIG.co2FactorsKwhInput[data.heizsystem as keyof typeof CONFIG.co2FactorsKwhInput];
      co2Alt = energieInput * co2Factor;
    } else {
      // Area based (also forced for "keine" heating system)
      // Derive energy demand from specificHeatLoad (W/m²) using heating hours
      const specLoad = CONFIG.specificHeatLoad[data.gebaeudeklasse as keyof typeof CONFIG.specificHeatLoad] || 50;
      nutzwaermeBedarf = (data.flaeche * specLoad * CONFIG.heatingHoursPerYear) / 1000;
      
      if (data.heizsystem !== "keine") {
        // Reverse calculate equivalent consumption for cost
        // Nutzwärme = Input * Efficiency => Input = Nutzwärme / Efficiency
        const efficiency = data.wirkungsgradAlt > 0 ? data.wirkungsgradAlt / 100 : 1;
        const impliedInputKwh = nutzwaermeBedarf / efficiency;
        
        const factor = CONFIG.energyFactors[data.heizsystem as keyof typeof CONFIG.energyFactors];
        const impliedUnits = factor > 0 ? impliedInputKwh / factor : 0;
        
        kostenAktuell = impliedUnits * data.preisAlt;
        
        const co2Factor = CONFIG.co2FactorsKwhInput[data.heizsystem as keyof typeof CONFIG.co2FactorsKwhInput];
        co2Alt = impliedInputKwh * co2Factor;
      } else {
        // No old system - no old costs or CO2
        kostenAktuell = 0;
        co2Alt = 0;
      }
    }

    // 2. Solar Contribution - only reduce hot water portion
    let solarNutzbar = 0;
    let solarErtrag = 0;
    if (data.hasSolarthermie) {
      const yieldFactor = CONFIG.solarYieldFactors[data.solarType as keyof typeof CONFIG.solarYieldFactors];
      solarErtrag = data.solarArea * yieldFactor;
      
      // Solar thermal only reduces warm water portion
      const wwBedarf = nutzwaermeBedarf * (data.warmwasserAnteilPct / 100);
      const solarNutzungsgrad = 0.70; // Fixed utilization rate
      solarNutzbar = Math.min(wwBedarf, solarErtrag * solarNutzungsgrad);
    }
    
    const remainingHeatDemand = Math.max(0, nutzwaermeBedarf - solarNutzbar);

    // 3. Heat Pump Efficiency (SCOP)
    // Calculate effective flow temp based on floor heating share
    const deltaT = (data.anteilFussboden / 100) * 5; // Max 5K reduction
    let effVorlauf = Math.max(30, Math.min(70, data.vorlaufTemp - deltaT));
    
    // Apply fans effect on top
    if (data.hasFans) {
      effVorlauf = Math.max(30, effVorlauf - CONFIG.heizkoerperventilatorEffekt);
    }
    
    // SCOP model: Base at 35C = 4.8, drops 0.07 per degree
    const baseSCOP35 = 4.8;
    const dropPerDegree = 0.07; 
    let estimatedSCOP = baseSCOP35 - ((effVorlauf - 35) * dropPerDegree);
    if (estimatedSCOP < 2.0) estimatedSCOP = 2.0;
    if (estimatedSCOP > 6.0) estimatedSCOP = 6.0;

    // 4. New Costs
    const electricityNeeded = remainingHeatDemand / estimatedSCOP;
    const kostenNeu = (electricityNeeded * data.strompreisWP);

    // 5. CO2 New
    const co2Neu = electricityNeeded * CONFIG.stromCo2Faktor;

    // 6. Savings
    const ersparnis = Math.round((kostenAktuell + data.wartungAlt) - (kostenNeu + data.wartungNeu));
    const co2Ersparnis = Math.round(co2Alt - co2Neu);
    
    // 7. Amortization (ensure investNetto >= 0)
    const investNetto = Math.max(0, data.investition - data.foerderung);
    let amortizationYears: number | null = null;
    if (ersparnis > 0 && investNetto > 0) {
      amortizationYears = investNetto / ersparnis;
    }
    
    // 8. Size Estimate
    const specLoad = CONFIG.specificHeatLoad[data.gebaeudeklasse as keyof typeof CONFIG.specificHeatLoad] || 50;
    const estimatedLoadKw = (data.flaeche * specLoad) / 1000;

    setResults({
      nutzwaermeBedarf: Math.round(nutzwaermeBedarf),
      kostenAktuell: Math.round(kostenAktuell),
      co2Alt: Math.round(co2Alt),
      solarErtrag: Math.round(solarErtrag),
      solarNutzbar: Math.round(solarNutzbar),
      effectiveSCOP: estimatedSCOP.toFixed(2),
      effectiveFlowTemp: effVorlauf,
      kostenNeu: Math.round(kostenNeu),
      co2Neu: Math.round(co2Neu),
      ersparnis,
      co2Ersparnis,
      amortizationYears: amortizationYears === null ? null : (amortizationYears > 100 ? "> 100" : amortizationYears.toFixed(1)),
      estimatedLoadKw: estimatedLoadKw.toFixed(1),
      investNetto
    });
  };

  const updateData = (key: string, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className={step >= 1 ? "text-primary" : ""}>Basisdaten</span>
            <span className={step >= 2 ? "text-primary" : ""}>System & Optimierung</span>
            <span className={step >= 3 ? "text-primary" : ""}>Finanzen</span>
            <span className={step >= 4 ? "text-primary" : ""}>Ergebnis</span>
          </div>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-6 md:p-10 min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* --- STEP 1: BASISDATEN --- */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-grow"
                >
                  <StepHeader step={1} title="Ihre aktuellen Daten" />
                  
                  {/* Calculation Method */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => updateData("method", "flaeche")}
                      data-testid="method-flaeche"
                      className={cn(
                        "flex flex-col items-center p-6 border-2 rounded-xl transition-all",
                        data.method === "flaeche" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <Home size={32} className={data.method === "flaeche" ? "text-primary" : "text-slate-400"} />
                      <span className="mt-3 font-bold text-slate-700">Nach Wohnfläche</span>
                      <span className="text-xs text-slate-500 mt-1">Ideal wenn Verbrauch unbekannt</span>
                    </button>
                    
                    <button 
                      onClick={() => data.heizsystem !== "keine" && updateData("method", "verbrauch")}
                      disabled={data.heizsystem === "keine"}
                      data-testid="method-verbrauch"
                      className={cn(
                        "flex flex-col items-center p-6 border-2 rounded-xl transition-all",
                        data.method === "verbrauch" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 hover:border-slate-300",
                        data.heizsystem === "keine" ? "opacity-50 cursor-not-allowed" : ""
                      )}
                    >
                      <Flame size={32} className={data.method === "verbrauch" ? "text-primary" : "text-slate-400"} />
                      <span className="mt-3 font-bold text-slate-700">Nach Verbrauch</span>
                      <span className="text-xs text-slate-500 mt-1">
                        {data.heizsystem === "keine" ? "Nicht verfügbar (Neubau)" : "Für genauere Ergebnisse"}
                      </span>
                    </button>
                  </div>

                  {/* Dynamic Inputs */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                    {data.method === "flaeche" ? (
                      <>
                        <div className="space-y-3">
                          <Label>Gebäudeklasse</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                             {BUILDING_CLASSES.map(cls => (
                               <button
                                 key={cls.value}
                                 onClick={() => updateData("gebaeudeklasse", cls.value)}
                                 className={cn(
                                   "text-left p-3 text-sm border rounded-lg transition-all",
                                   data.gebaeudeklasse === cls.value ? "border-primary bg-white shadow-sm ring-1 ring-primary" : "border-slate-200 hover:bg-white"
                                 )}
                               >
                                 <div className="font-bold text-slate-900">{cls.label}</div>
                                 <div className="text-xs text-slate-500">{cls.desc}</div>
                               </button>
                             ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label>Beheizbare Fläche</Label>
                            <span className="font-bold text-primary">{data.flaeche} m²</span>
                          </div>
                          <Slider 
                            value={[data.flaeche]} 
                            onValueChange={(val) => updateData("flaeche", val[0])} 
                            min={50} max={500} step={10} 
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Label>Jährlicher Verbrauch</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            value={data.verbrauch} 
                            onChange={(e) => updateData("verbrauch", parseFloat(e.target.value) || 0)} 
                            className="text-lg font-bold"
                          />
                          <div className="flex items-center px-4 bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-600">
                             {data.heizsystem === "erdgas_h" || data.heizsystem === "erdgas_l" ? "m³" : 
                              data.heizsystem === "pellets" ? "kg" :
                              data.heizsystem === "strom" ? "kWh" : "Liter"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Heating System */}
                  <div className="space-y-4">
                    <Label className="text-base">Aktuelles Heizsystem</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {HEATING_SYSTEMS.map(sys => (
                        <button
                          key={sys.value}
                          onClick={() => handleHeizsystemChange(sys.value)}
                          data-testid={`heating-system-${sys.value}`}
                          className={cn(
                            "p-3 text-sm border rounded-lg text-center transition-all font-medium",
                            data.heizsystem === sys.value ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {sys.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.heizsystem !== "keine" && (
                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                       <div className="space-y-4">
                          <div className="flex justify-between">
                             <Label>Wirkungsgrad Altanlage</Label>
                             <span className="font-bold text-primary">{data.wirkungsgradAlt}%</span>
                          </div>
                          <Slider 
                             value={[data.wirkungsgradAlt]} 
                             onValueChange={(val) => {
                               setEtaManuellGeaendert(true);
                               updateData("wirkungsgradAlt", val[0]);
                             }} 
                             min={50} max={100} step={1} 
                          />
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between">
                             <Label>Aktueller Preis / Einheit</Label>
                             <span className="font-bold text-primary">{data.preisAlt.toFixed(2)} €</span>
                          </div>
                          <Slider 
                             value={[data.preisAlt]} 
                             onValueChange={(val) => {
                               setPreisManuellGeaendert(true);
                               updateData("preisAlt", val[0]);
                             }} 
                             min={0.05} max={3.00} step={0.01} 
                          />
                       </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- STEP 2: NEUE ANLAGE --- */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-grow"
                >
                  <StepHeader step={2} title="System & Optimierung" />

                  <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                      <Zap size={20} className="text-primary" /> Wärmepumpe Parameter
                    </h3>
                    
                    <div className="space-y-4">
                       <div className="flex justify-between">
                          <Label>Strompreis (Netz) für WP</Label>
                          <span className="font-bold text-primary">{data.strompreisWP} €/kWh</span>
                       </div>
                       <Slider 
                          value={[data.strompreisWP]} 
                          onValueChange={(val) => updateData("strompreisWP", val[0])} 
                          min={0.10} max={0.80} step={0.01} 
                       />
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between">
                          <Label>Vorlauftemperatur (bei Auslegung)</Label>
                          <span className="font-bold text-primary">{data.vorlaufTemp} °C</span>
                       </div>
                       <Slider 
                          value={[data.vorlaufTemp]} 
                          onValueChange={(val) => updateData("vorlaufTemp", val[0])} 
                          min={30} max={75} step={1} 
                       />
                       <p className="text-xs text-slate-500">Niedrigere Vorlauftemperaturen erhöhen die Effizienz (SCOP) der Wärmepumpe massiv.</p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between">
                          <Label>Anteil Fußbodenheizung</Label>
                          <span className="font-bold text-primary">{data.anteilFussboden}%</span>
                       </div>
                       <Slider 
                          value={[data.anteilFussboden]} 
                          onValueChange={(val) => updateData("anteilFussboden", val[0])} 
                          min={0} max={100} step={5} 
                       />
                       <p className="text-xs text-slate-500">Höherer FBH-Anteil senkt die effektive Vorlauftemperatur und verbessert den SCOP.</p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between">
                          <Label>Warmwasseranteil am Wärmebedarf</Label>
                          <span className="font-bold text-primary">{data.warmwasserAnteilPct}%</span>
                       </div>
                       <Slider 
                          value={[data.warmwasserAnteilPct]} 
                          onValueChange={(val) => updateData("warmwasserAnteilPct", val[0])} 
                          min={10} max={35} step={1} 
                       />
                       <p className="text-xs text-slate-500">Typisch 15-25% des Gesamtwärmebedarfs für Warmwasser.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                       <Leaf size={20} className="text-green-500" /> Optimierungs-Optionen
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Solarthermie Toggle */}
                      <div className={cn(
                        "border-2 rounded-xl p-4 cursor-pointer transition-all",
                        data.hasSolarthermie ? "border-primary bg-primary/5" : "border-slate-200"
                      )} onClick={() => updateData("hasSolarthermie", !data.hasSolarthermie)}>
                        <div className="flex items-center gap-3 mb-3">
                           <div className={cn("w-6 h-6 rounded border flex items-center justify-center", data.hasSolarthermie ? "bg-primary border-primary text-white" : "border-slate-300")}>
                             {data.hasSolarthermie && <Check size={16} />}
                           </div>
                           <span className="font-bold text-slate-700">Solarthermie Unterstützung</span>
                        </div>
                        {data.hasSolarthermie && (
                           <div className="pl-9 space-y-3" onClick={e => e.stopPropagation()}>
                              <p className="text-xs text-slate-500 mb-2">
                                Solarthermie wird vereinfacht als Warmwasser-Unterstützung gerechnet.
                              </p>
                              <div className="flex gap-2">
                                 <button onClick={() => updateData("solarType", "flach")} className={cn("text-xs px-2 py-1 rounded border", data.solarType === "flach" ? "bg-white border-primary text-primary" : "bg-slate-50")}>Flachkollektor</button>
                                 <button onClick={() => updateData("solarType", "roehren")} className={cn("text-xs px-2 py-1 rounded border", data.solarType === "roehren" ? "bg-white border-primary text-primary" : "bg-slate-50")}>Röhrenkollektor</button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs w-8">{data.solarArea} m²</span>
                                <Slider value={[data.solarArea]} onValueChange={v => updateData("solarArea", v[0])} min={2} max={20} step={1} className="flex-1" />
                              </div>
                           </div>
                        )}
                      </div>

                      {/* Fans Toggle */}
                      <div className={cn(
                        "border-2 rounded-xl p-4 cursor-pointer transition-all",
                        data.hasFans ? "border-primary bg-primary/5" : "border-slate-200"
                      )} onClick={() => updateData("hasFans", !data.hasFans)}>
                        <div className="flex items-center gap-3">
                           <div className={cn("w-6 h-6 rounded border flex items-center justify-center", data.hasFans ? "bg-primary border-primary text-white" : "border-slate-300")}>
                             {data.hasFans && <Check size={16} />}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-700">Heizkörperlüfter</span>
                             <span className="text-xs text-slate-500">Senkt nötige Vorlauftemp. um ca. 5°C</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 3: INVESTITION --- */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-grow"
                >
                  <StepHeader step={3} title="Investition & Wartung" />
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-8">
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <Label>Investitionskosten (inkl. Montage)</Label>
                           <span className="font-bold text-primary">{data.investition.toLocaleString()} €</span>
                        </div>
                        <Slider 
                           value={[data.investition]} 
                           onValueChange={(val) => {
                             // User manually changed investment
                             setHasUserModifiedInvest(true);
                             
                             // Recalculate subsidy dynamically even when manual, 
                             // to keep it compliant with guidelines (30% max 7500)
                             const newInvest = val[0];
                             
                             const calculatedPercentage = newInvest * 0.30;
                             let maxCap = 7500;
                             
                             let newSubsidy = Math.min(calculatedPercentage, maxCap);
                             
                             if (data.hasSolarthermie) newSubsidy += 2500;
                             
                             setData(prev => ({ 
                               ...prev, 
                               investition: newInvest,
                               foerderung: Math.round(newSubsidy / 100) * 100
                             }));
                           }} 
                           min={10000} max={40000} step={500} 
                        />
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <Label>Erwartete Förderung</Label>
                           <span className="font-bold text-green-600">- {data.foerderung.toLocaleString()} €</span>
                        </div>
                        <Slider 
                           value={[data.foerderung]} 
                           onValueChange={(val) => {
                             updateData("foerderung", val[0]);
                             setHasUserModifiedInvest(true);
                           }} 
                           min={0} max={25000} step={100} 
                        />
                     </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900">Jährliche Wartungskosten</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div className="flex justify-between">
                             <Label>Altanlage</Label>
                             <span className="font-bold text-slate-700">{data.wartungAlt} €</span>
                          </div>
                          <Slider 
                             value={[data.wartungAlt]} 
                             onValueChange={(val) => updateData("wartungAlt", val[0])} 
                             min={0} max={1000} step={10} 
                          />
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between">
                             <Label>Neue Wärmepumpe</Label>
                             <span className="font-bold text-slate-700">{data.wartungNeu} €</span>
                          </div>
                          <Slider 
                             value={[data.wartungNeu]} 
                             onValueChange={(val) => updateData("wartungNeu", val[0])} 
                             min={0} max={1000} step={10} 
                          />
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- STEP 4: ERGEBNIS --- */}
              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-grow"
                >
                  <StepHeader step={4} title="Ihr Sparpotenzial" />

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Old System Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b pb-2">Aktueller Status</h3>
                      <ResultRow label="Nutzwärmebedarf" value={results.nutzwaermeBedarf?.toLocaleString()} unit="kWh/a" />
                      <ResultRow label="Aktuelle Kosten" value={results.kostenAktuell?.toLocaleString()} unit="€/a" />
                      <ResultRow label="CO₂ Emissionen" value={results.co2Alt?.toLocaleString()} unit="kg/a" />
                    </div>

                    {/* New System Card */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 border-b border-primary/20 pb-2">Mit Chofu Wärmepumpe</h3>
                      <ResultRow label="Stromkosten" value={results.kostenNeu?.toLocaleString()} unit="€/a" highlight />
                      <ResultRow label="CO₂ Emissionen" value={results.co2Neu?.toLocaleString()} unit="kg/a" highlight />
                      <div className="mt-4 pt-4 border-t border-primary/20">
                         <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700">Effizienz (JAZ/SCOP)</span>
                            <span className="font-bold text-primary text-xl">{results.effectiveSCOP}</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Result Highlight */}
                  <div className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl relative overflow-hidden">
                     <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
                        <div>
                           <div className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Jährliche Ersparnis</div>
                           <div className={cn(
                             "text-4xl md:text-5xl font-heading font-extrabold",
                             results.ersparnis > 0 ? "text-green-400" : "text-amber-400"
                           )}>
                             {results.ersparnis?.toLocaleString()} €
                           </div>
                           <div className="text-xs text-slate-400 mt-2">Betriebskosten + Wartung</div>
                        </div>
                        <div>
                           <div className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Amortisation</div>
                           {results.amortizationYears !== null ? (
                             <>
                               <div className="text-4xl md:text-5xl font-heading font-extrabold text-white">
                                 {results.amortizationYears}
                               </div>
                               <div className="text-xs text-slate-400 mt-2">Jahre (nach Förderung)</div>
                             </>
                           ) : (
                             <>
                               <div className="text-xl font-bold text-amber-400">
                                 k.A.
                               </div>
                               <div className="text-xs text-amber-300 mt-2">
                                 Unter diesen Annahmen keine wirtschaftliche Amortisation.
                               </div>
                             </>
                           )}
                        </div>
                        <div>
                           <div className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">CO₂ Reduktion</div>
                           <div className={cn(
                             "text-4xl md:text-5xl font-heading font-extrabold",
                             results.co2Ersparnis > 0 ? "text-blue-300" : "text-amber-400"
                           )}>
                             {Math.round(results.co2Ersparnis / 1000 * 10) / 10} t
                           </div>
                           <div className="text-xs text-slate-400 mt-2">pro Jahr</div>
                        </div>
                     </div>
                     {/* Background Pattern */}
                     <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Leaf size={200} />
                     </div>
                  </div>

                  <div className="text-center">
                     <p className="text-sm text-slate-500 mb-6 max-w-2xl mx-auto">
                        * Die berechneten Werte sind Schätzungen basierend auf Ihren Angaben und Durchschnittswerten. 
                        Eine genaue Heizlastberechnung durch einen Fachpartner ist für die finale Planung notwendig.
                     </p>
                     <Button className="font-bold uppercase tracking-wide" size="lg" onClick={() => window.print()}>
                        <Download className="mr-2" size={18} /> Ergebnis drucken / PDF
                     </Button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </CardContent>
          
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
             <Button 
               variant="outline" 
               onClick={prevStep} 
               disabled={step === 1}
               className="gap-2"
             >
               <ArrowLeft size={16} /> Zurück
             </Button>

             {step < 4 ? (
               <Button onClick={nextStep} className="gap-2 px-8">
                 Weiter <ArrowRight size={16} />
               </Button>
             ) : (
               <Button onClick={() => setStep(1)} variant="ghost" className="text-primary hover:text-primary/80">
                 Neu berechnen
               </Button>
             )}
          </div>
        </Card>

      </div>
    </div>
  );
}
