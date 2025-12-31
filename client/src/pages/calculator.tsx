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
  kgCo2ProFussballfeldWaldProJahr: 5600,
  klasseFactors: { alt_unsaniert: 200, alt_teilsaniert: 150, alt_saniert: 100, neubau: 70, niedrigenergie: 30 },
  specificHeatLoad: { alt_unsaniert: 100, alt_teilsaniert: 70, alt_saniert: 50, neubau: 40, niedrigenergie: 30 },
  solarYieldFactors: { flach: 350, roehren: 450 },
  heizkoerperventilatorEffekt: 5,
};

const BUILDING_CLASSES = [
  { value: "alt_unsaniert", label: "Altbau, unsaniert", desc: "~200 kWh/m²·a", load: "~100 W/m²" },
  { value: "alt_teilsaniert", label: "Altbau, teilsaniert", desc: "~150 kWh/m²·a", load: "~70 W/m²" },
  { value: "alt_saniert", label: "Altbau, saniert", desc: "~100 kWh/m²·a", load: "~50 W/m²" },
  { value: "neubau", label: "Neubau", desc: "~70 kWh/m²·a", load: "~40 W/m²" },
  { value: "niedrigenergie", label: "Niedrigenergiehaus", desc: "~30 kWh/m²·a", load: "~30 W/m²" }
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

  // Calculations
  useEffect(() => {
    calculateResults();
  }, [data]);

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

       // Calculate Subsidy (Kesseltausch 2026 Logic: 75% max, or Flat Rate)
       // Base: 16.000 + Solar 2.500
       let suggestedSubsidy = 16000; 
       if (data.hasSolarthermie) suggestedSubsidy += 2500;
       
       // Cap subsidy at 75% of invest (Current Guideline)
       // User asked for "30% max 7500" logic, but we use current 2026 values with same logic structure
       const maxSubsidy = suggestedInvest * 0.75;
       if (suggestedSubsidy > maxSubsidy) suggestedSubsidy = maxSubsidy;

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
    if (data.method === "verbrauch") {
      const factor = CONFIG.energyFactors[data.heizsystem as keyof typeof CONFIG.energyFactors];
      const energieInput = data.verbrauch * factor; // kWh
      nutzwaermeBedarf = energieInput * (data.wirkungsgradAlt / 100);
      
      kostenAktuell = data.verbrauch * data.preisAlt;
      
      const co2Factor = CONFIG.co2FactorsKwhInput[data.heizsystem as keyof typeof CONFIG.co2FactorsKwhInput];
      co2Alt = energieInput * co2Factor;
    } else {
      // Area based
      const demandPerSqm = CONFIG.klasseFactors[data.gebaeudeklasse as keyof typeof CONFIG.klasseFactors];
      nutzwaermeBedarf = data.flaeche * demandPerSqm;
      
      // Reverse calculate equivalent consumption for cost
      // Nutzwärme = Input * Efficiency => Input = Nutzwärme / Efficiency
      const efficiency = data.wirkungsgradAlt > 0 ? data.wirkungsgradAlt / 100 : 1;
      const impliedInputKwh = nutzwaermeBedarf / efficiency;
      
      const factor = CONFIG.energyFactors[data.heizsystem as keyof typeof CONFIG.energyFactors];
      const impliedUnits = factor > 0 ? impliedInputKwh / factor : 0;
      
      kostenAktuell = impliedUnits * data.preisAlt;
      
      const co2Factor = CONFIG.co2FactorsKwhInput[data.heizsystem as keyof typeof CONFIG.co2FactorsKwhInput];
      co2Alt = impliedInputKwh * co2Factor;
    }

    // 2. Solar Contribution
    let solarErtrag = 0;
    if (data.hasSolarthermie) {
      const yieldFactor = CONFIG.solarYieldFactors[data.solarType as keyof typeof CONFIG.solarYieldFactors];
      solarErtrag = data.solarArea * yieldFactor;
    }
    
    const remainingHeatDemand = Math.max(0, nutzwaermeBedarf - solarErtrag);

    // 3. Heat Pump Efficiency (SCOP)
    // Simple model: SCOP drops as flow temp rises
    // Base SCOP at 35C = 4.8, at 55C = 3.6 (approx)
    // Linear interpolation model for demo
    let flowTemp = data.vorlaufTemp;
    if (data.hasFans) {
        flowTemp = Math.max(30, flowTemp - CONFIG.heizkoerperventilatorEffekt);
    }
    
    // Very rough COP estimation formula: COP = 8.0 - (0.1 * deltaT) where deltaT = Flow - Source(approx 2 for year avg)
    // Better simplified: 
    // 35C -> 4.5
    // 55C -> 3.0
    // 20 diff -> 1.5 diff
    // factor = 0.075 per degree
    const baseSCOP35 = 4.8;
    const dropPerDegree = 0.07; 
    let estimatedSCOP = baseSCOP35 - ((flowTemp - 35) * dropPerDegree);
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
    
    // 7. Amortization
    const investNetto = data.investition - data.foerderung;
    const amortizationYears = ersparnis > 0 ? (investNetto / ersparnis) : 999;
    
    // 8. Size Estimate
    const specLoad = CONFIG.specificHeatLoad[data.gebaeudeklasse as keyof typeof CONFIG.specificHeatLoad] || 50;
    const estimatedLoadKw = (data.flaeche * specLoad) / 1000;

    setResults({
      nutzwaermeBedarf: Math.round(nutzwaermeBedarf),
      kostenAktuell: Math.round(kostenAktuell),
      co2Alt: Math.round(co2Alt),
      solarErtrag: Math.round(solarErtrag),
      effectiveSCOP: estimatedSCOP.toFixed(2),
      effectiveFlowTemp: flowTemp,
      kostenNeu: Math.round(kostenNeu),
      co2Neu: Math.round(co2Neu),
      ersparnis,
      co2Ersparnis,
      amortizationYears: amortizationYears > 100 ? "> 100" : amortizationYears.toFixed(1),
      estimatedLoadKw: estimatedLoadKw.toFixed(1),
      trees: (co2Ersparnis / (CONFIG.kgCo2ProFussballfeldWaldProJahr / 1000)).toFixed(1) // Just reusing the constant name as factor logic
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
                      onClick={() => updateData("method", "verbrauch")}
                      className={cn(
                        "flex flex-col items-center p-6 border-2 rounded-xl transition-all",
                        data.method === "verbrauch" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <Flame size={32} className={data.method === "verbrauch" ? "text-primary" : "text-slate-400"} />
                      <span className="mt-3 font-bold text-slate-700">Nach Verbrauch</span>
                      <span className="text-xs text-slate-500 mt-1">Für genauere Ergebnisse</span>
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
                          onClick={() => updateData("heizsystem", sys.value)}
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

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <Label>Wirkungsgrad Altanlage</Label>
                           <span className="font-bold text-primary">{data.wirkungsgradAlt}%</span>
                        </div>
                        <Slider 
                           value={[data.wirkungsgradAlt]} 
                           onValueChange={(val) => updateData("wirkungsgradAlt", val[0])} 
                           min={50} max={100} step={1} 
                        />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <Label>Aktueller Preis / Einheit</Label>
                           <span className="font-bold text-primary">{data.preisAlt} €</span>
                        </div>
                        <Slider 
                           value={[data.preisAlt]} 
                           onValueChange={(val) => updateData("preisAlt", val[0])} 
                           min={0.05} max={3.00} step={0.01} 
                        />
                     </div>
                  </div>
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
                             // to keep it compliant with guidelines (max 75%)
                             const newInvest = val[0];
                             let newSubsidy = 16000;
                             if (data.hasSolarthermie) newSubsidy += 2500;
                             
                             const max = newInvest * 0.75;
                             if (newSubsidy > max) newSubsidy = max;
                             
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
                           <div className="text-4xl md:text-5xl font-heading font-extrabold text-green-400">
                             {results.ersparnis?.toLocaleString()} €
                           </div>
                           <div className="text-xs text-slate-400 mt-2">Betriebskosten + Wartung</div>
                        </div>
                        <div>
                           <div className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Amortisation</div>
                           <div className="text-4xl md:text-5xl font-heading font-extrabold text-white">
                             {results.amortizationYears}
                           </div>
                           <div className="text-xs text-slate-400 mt-2">Jahre (nach Förderung)</div>
                        </div>
                        <div>
                           <div className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">CO₂ Reduktion</div>
                           <div className="text-4xl md:text-5xl font-heading font-extrabold text-blue-300">
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
