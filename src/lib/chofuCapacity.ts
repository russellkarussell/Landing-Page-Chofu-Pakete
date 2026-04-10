export type ChofuModelId = "AEYC-0449ZU-CH1" | "AEYC-0649ZU-CH1" | "AEYC-1049ZU-CH1";

export interface ChofuModel {
  label: string;
  capacitiesW: Record<number, Record<number, number>>;
}

export const MODELS: Record<ChofuModelId, ChofuModel> = {
  "AEYC-0449ZU-CH1": {
    label: "CHOFU 4 kW",
    capacitiesW: {
      35: { 7: 7050, 2: 5520, "-2": 5250, "-7": 5140, "-15": 4100, "-20": 3520 },
      45: { 7: 6250, 2: 5410, "-2": 5080, "-7": 4980, "-15": 3950, "-20": 3320 },
      55: { 7: 5690, 2: 5250, "-2": 4910, "-7": 4830, "-15": 3740, "-20": 3030 },
      75: { 7: 3340, 2: 3200, "-2": 3100, "-7": 2900 }
    }
  },
  "AEYC-0649ZU-CH1": {
    label: "CHOFU 6 kW",
    capacitiesW: {
      35: { 7: 11080, 2: 8020, "-2": 7360, "-7": 7250, "-15": 7220, "-20": 5920 },
      45: { 7: 10900, 2: 7880, "-2": 7180, "-7": 7020, "-15": 6910, "-20": 5800 },
      55: { 7: 10750, 2: 7710, "-2": 7000, "-7": 6770, "-15": 6440, "-20": 5480 },
      75: { 7: 7620, 2: 7060, "-2": 5260, "-7": 4650 }
    }
  },
  "AEYC-1049ZU-CH1": {
    label: "CHOFU 10 kW",
    capacitiesW: {
      35: { 7: 13590, 2: 11070, "-2": 10000, "-7": 10000, "-15": 8700, "-20": 7310 },
      45: { 7: 12920, 2: 11030, "-2": 9940, "-7": 9890, "-15": 8550, "-20": 7200 },
      55: { 7: 12460, 2: 10940, "-2": 9940, "-7": 9940, "-15": 8380, "-20": 7090 },
      75: { 7: 8620, 2: 7590, "-2": 7300, "-7": 5930 }
    }
  }
};

const AIR_TEMPS = [7, 2, -2, -7, -15, -20];
const WATER_TEMPS = [35, 45, 55];
const MODEL_ORDER: ChofuModelId[] = ["AEYC-0449ZU-CH1", "AEYC-0649ZU-CH1", "AEYC-1049ZU-CH1"];

function linearInterpolate(x: number, x1: number, y1: number, x2: number, y2: number): number {
  if (x1 === x2) return y1;
  return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function findBracket(value: number, sortedArray: number[]): [number, number] {
  const clamped = clamp(value, sortedArray[sortedArray.length - 1], sortedArray[0]);
  
  for (let i = 0; i < sortedArray.length - 1; i++) {
    if (clamped <= sortedArray[i] && clamped >= sortedArray[i + 1]) {
      return [sortedArray[i], sortedArray[i + 1]];
    }
  }
  return [sortedArray[0], sortedArray[0]];
}

function getCapacityForAirTemp(capacities: Record<number, number>, airTemp: number): number {
  const clampedAir = clamp(airTemp, -20, 7);
  
  const availableTemps = Object.keys(capacities).map(Number).sort((a, b) => b - a);
  
  if (availableTemps.length === 0) return 0;
  
  if (capacities[clampedAir] !== undefined) {
    return capacities[clampedAir];
  }
  
  let lower: number | null = null;
  let upper: number | null = null;
  
  for (const temp of availableTemps) {
    if (temp >= clampedAir) {
      upper = temp;
    }
    if (temp <= clampedAir && lower === null) {
      lower = temp;
    }
  }
  
  if (lower === null) lower = availableTemps[availableTemps.length - 1];
  if (upper === null) upper = availableTemps[0];
  
  if (lower === upper) {
    return capacities[lower];
  }
  
  return linearInterpolate(
    clampedAir,
    lower,
    capacities[lower],
    upper,
    capacities[upper]
  );
}

export function getCapacityAt(modelId: ChofuModelId, airTemp: number, waterTemp: number): number {
  const model = MODELS[modelId];
  if (!model) return 0;
  
  const clampedWater = clamp(waterTemp, 35, 55);
  const clampedAir = clamp(airTemp, -20, 7);
  
  if (model.capacitiesW[clampedWater]) {
    return getCapacityForAirTemp(model.capacitiesW[clampedWater], clampedAir);
  }
  
  let lowerWater: number | null = null;
  let upperWater: number | null = null;
  
  for (const wt of WATER_TEMPS) {
    if (wt <= clampedWater) {
      lowerWater = wt;
    }
    if (wt >= clampedWater && upperWater === null) {
      upperWater = wt;
    }
  }
  
  if (lowerWater === null) lowerWater = 35;
  if (upperWater === null) upperWater = 55;
  
  if (lowerWater === upperWater) {
    return getCapacityForAirTemp(model.capacitiesW[lowerWater], clampedAir);
  }
  
  const capLower = getCapacityForAirTemp(model.capacitiesW[lowerWater], clampedAir);
  const capUpper = getCapacityForAirTemp(model.capacitiesW[upperWater], clampedAir);
  
  return linearInterpolate(clampedWater, lowerWater, capLower, upperWater, capUpper);
}

export interface RecommendationResult {
  status: "ok" | "borderline" | "exceeds_10kw_package";
  modelId?: ChofuModelId;
  modelLabel?: string;
  capacityW?: number;
  requiredW: number;
  nominalW: number;
  marginPct?: number;
  message?: string;
}

export function recommendModel(params: {
  heizlastKw: number;
  designAirTemp?: number;
  designWaterTemp?: number;
  safetyFactor?: number;
}): RecommendationResult {
  const {
    heizlastKw,
    designAirTemp = -2,
    designWaterTemp = 55,
    safetyFactor = 1.05
  } = params;
  
  const nominalW = heizlastKw * 1000;
  const requiredW = nominalW * safetyFactor;
  
  // First, try to find a model that covers requiredW (with safety factor)
  for (const modelId of MODEL_ORDER) {
    const capacityW = getCapacityAt(modelId, designAirTemp, designWaterTemp);
    
    if (capacityW >= requiredW) {
      const marginPct = ((capacityW - requiredW) / requiredW) * 100;
      
      return {
        status: "ok",
        modelId,
        modelLabel: MODELS[modelId].label,
        capacityW,
        requiredW,
        nominalW,
        marginPct
      };
    }
  }
  
  // Check if the largest model (10kW) at least covers nominalW (without safety factor)
  const largestModelId: ChofuModelId = "AEYC-1049ZU-CH1";
  const largestCapacityW = getCapacityAt(largestModelId, designAirTemp, designWaterTemp);
  
  if (largestCapacityW >= nominalW) {
    // Borderline: covers nominal but not required (with safety)
    return {
      status: "borderline",
      modelId: largestModelId,
      modelLabel: MODELS[largestModelId].label,
      capacityW: largestCapacityW,
      requiredW,
      nominalW,
      marginPct: ((largestCapacityW - nominalW) / nominalW) * 100,
      message: "Im Grenzbereich. Für exakte Auslegung (Hydraulik, Heizflächen, Vorlauftemperaturen) empfehlen wir eine Projektprüfung/Besichtigung."
    };
  }
  
  // Exceeds package: even nominal load not covered
  return {
    status: "exceeds_10kw_package",
    requiredW,
    nominalW,
    message: "Der Wärmebedarf liegt über dem 10-kW-Paketbereich. Fragen Sie unser 16-kW CHOFU Modell an (nicht im Paket)."
  };
}

export const BUILDING_STANDARDS = {
  alt_unsaniert: { label: "Altbau unsaniert", specificHeatLoad: 100 },
  alt_teilsaniert: { label: "Altbau teilsaniert", specificHeatLoad: 70 },
  alt_saniert: { label: "Altbau saniert", specificHeatLoad: 50 },
  neubau: { label: "Neubau", specificHeatLoad: 40 },
  niedrigenergie: { label: "Niedrigenergie", specificHeatLoad: 30 }
} as const;

export type BuildingStandardKey = keyof typeof BUILDING_STANDARDS;

export function calculateHeizlast(wohnflaeche: number, buildingStandard: BuildingStandardKey): {
  heizlastKw: number;
  low: number;
  high: number;
} {
  const specificHeatLoad = BUILDING_STANDARDS[buildingStandard]?.specificHeatLoad || 50;
  const heizlastKw = (wohnflaeche * specificHeatLoad) / 1000;
  
  return {
    heizlastKw,
    low: heizlastKw * 0.85,
    high: heizlastKw * 1.15
  };
}
