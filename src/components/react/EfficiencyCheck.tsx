import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, Info, Loader2, Calculator } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { recommendModel } from "@/lib/chofuCapacity";

type BuildingTypeKey = "altbau" | "teilsaniert" | "neubau";

const BUILDING_TYPES: Record<BuildingTypeKey, {
  id: BuildingTypeKey;
  label: string;
  specificHeatLoad: number;
  designWaterTemp: number;
}> = {
  altbau: { id: "altbau", label: "Altbau", specificHeatLoad: 100, designWaterTemp: 55 },
  teilsaniert: { id: "teilsaniert", label: "Teilsaniert", specificHeatLoad: 70, designWaterTemp: 45 },
  neubau: { id: "neubau", label: "Neubau", specificHeatLoad: 40, designWaterTemp: 35 }
};

export default function EfficiencyCheck() {
  const EFF_CHECK_AIR_TEMP = -2;
  const [calcStep, setCalcStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcData, setCalcData] = useState({ size: "120", buildingType: "neubau" as BuildingTypeKey });

  const calculateResult = (area: number, buildingTypeKey: BuildingTypeKey) => {
    const buildingType = BUILDING_TYPES[buildingTypeKey];
    const heizlastKw = (area * buildingType.specificHeatLoad) / 1000;
    const low = heizlastKw * 0.85;
    const high = heizlastKw * 1.15;

    const modelResult = recommendModel({
      heizlastKw,
      designAirTemp: EFF_CHECK_AIR_TEMP,
      designWaterTemp: buildingType.designWaterTemp,
      safetyFactor: 1.05
    });

    let recommendation = "";
    let suitability: "Geeignet" | "Empfohlen" | "Mehr Leistung" = "Geeignet";
    let suitabilityColor = "bg-green-100 text-green-700 border-green-200";
    let message = "";

    if (modelResult.status === "ok") {
      recommendation = modelResult.modelLabel || "CHOFU";
      suitability = "Geeignet";
    } else if (modelResult.status === "borderline") {
      recommendation = modelResult.modelLabel || "CHOFU 10 kW";
      suitability = "Empfohlen";
      message = "Für maximale Effizienz, leisen Betrieb und optimale Förderung empfehlen wir eine kurze Projektprüfung/Besichtigung.";
    } else {
      recommendation = "16 kW anfragen";
      suitability = "Mehr Leistung";
      suitabilityColor = "bg-blue-100 text-blue-700 border-blue-200";
      message = "Für mehr Leistungsreserve empfehlen wir unser 16-kW CHOFU Modell (nicht im Paket).";
    }

    return {
      low: low.toFixed(1), high: high.toFixed(1), heizlastKw, recommendation,
      modelId: modelResult.modelId, marginPct: modelResult.marginPct, status: modelResult.status,
      suitability, suitabilityColor, buildingLabel: buildingType.label, message
    };
  };

  const [result, setResult] = useState<ReturnType<typeof calculateResult> | null>(() => calculateResult(120, "neubau"));

  const handleCalc = () => {
    const area = parseFloat(calcData.size);
    if (!area || area < 40 || area > 350) return;
    setIsCalculating(true);
    setTimeout(() => {
      setResult(calculateResult(area, calcData.buildingType));
      setCalcStep(2);
      setIsCalculating(false);
    }, 300);
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-xl rounded-xl relative overflow-hidden max-w-md mx-auto lg:ml-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Wohnfläche</label>
                <span className="font-bold text-primary text-lg">{calcData.size || 120} <span className="text-sm font-normal text-slate-400">m²</span></span>
              </div>
              <div className="px-1">
                <Slider
                  defaultValue={[parseInt(calcData.size || "120")]}
                  max={350} min={40} step={10}
                  onValueChange={(vals) => setCalcData({ ...calcData, size: vals[0].toString() })}
                  className="py-4"
                />
              </div>
              <p className="text-[11px] text-slate-400 pl-1">Beheizte Wohnfläche (ca.)</p>
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Gebäudetyp</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(BUILDING_TYPES) as BuildingTypeKey[]).map((key) => {
                  const type = BUILDING_TYPES[key];
                  const isSelected = calcData.buildingType === key;
                  return (
                    <button key={key} type="button"
                      onClick={() => setCalcData({ ...calcData, buildingType: key })}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${isSelected ? "border-primary bg-primary/5 text-primary shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-slate-700"}`}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              className="w-full h-12 mt-2 rounded-lg font-bold text-base bg-primary text-white shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              onClick={handleCalc}
              disabled={!calcData.size || isCalculating || parseInt(calcData.size) < 40 || parseInt(calcData.size) > 350}
            >
              {isCalculating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Berechne...</>) : (<>Potenzial berechnen <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center mb-2">
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${result?.suitabilityColor} flex items-center gap-2`}>
                {(result?.status === "ok" || result?.status === "borderline") && <Check size={16} strokeWidth={3} />}
                {result?.status === "exceeds_10kw_package" && <Info size={16} strokeWidth={3} />}
                {result?.suitability}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Heizlast</div>
                <div className="font-bold text-slate-900 text-sm leading-tight">{result?.low}–{result?.high} <span className="text-xs text-slate-500 font-normal">kW</span></div>
              </div>
              <div className={`p-3 rounded-lg border text-center ${result?.status === "exceeds_10kw_package" ? "bg-blue-50 border-blue-200" : "ring-1 ring-primary/20 bg-primary/5 border-slate-100"}`}>
                <div className={`text-[10px] uppercase font-bold mb-1 ${result?.status === "exceeds_10kw_package" ? "text-blue-700" : "text-primary"}`}>Empfehlung</div>
                <div className={`font-bold text-sm leading-tight ${result?.status === "exceeds_10kw_package" ? "text-blue-700" : "text-primary"}`}>{result?.recommendation}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Gebäude</div>
                <div className="font-bold text-slate-900 text-sm leading-tight truncate">{result?.buildingLabel}</div>
              </div>
            </div>

            {result?.message && (
              <div className={`rounded-lg p-4 ${result.status === "exceeds_10kw_package" ? "bg-blue-50 border border-blue-200" : "bg-green-50 border border-green-200"}`}>
                <p className={`text-sm leading-relaxed text-center ${result.status === "exceeds_10kw_package" ? "text-blue-800" : "text-green-800"}`}>{result.message}</p>
              </div>
            )}

            {!result?.message && result?.status === "ok" && (
              <p className="text-xs text-slate-500 leading-relaxed text-center px-2">
                Orientierungswert. Die Empfehlung basiert auf typischen Bedingungen. Exakte Auslegung durch Fachbetrieb empfohlen.
              </p>
            )}

            <div className="space-y-3 pt-2">
              <a href={`/kontakt?area=${calcData.size}&type=${result?.buildingLabel}&recommendation=${encodeURIComponent(result?.recommendation || "")}`}
                className="w-full h-12 rounded-lg font-bold shadow-md hover:shadow-lg transition-all bg-primary text-white flex items-center justify-center">
                {result?.status === "exceeds_10kw_package" ? "16-kW Modell anfragen" : "Kostenlosen Besichtigungstermin"}
              </a>
              <a href="/rechner" className="w-full h-10 rounded-lg text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-sm">
                <Calculator size={16} /> Zum Heizkostenrechner
              </a>
              <button onClick={() => setCalcStep(1)} className="w-full text-center text-xs text-slate-400 hover:text-primary transition-colors mt-2">Neu berechnen</button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
