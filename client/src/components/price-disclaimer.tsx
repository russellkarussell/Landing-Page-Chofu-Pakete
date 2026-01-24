import { Info } from "lucide-react";

export function PriceDisclaimer() {
  return (
    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-6 mb-4 px-4">
      <Info className="w-4 h-4 flex-shrink-0" />
      <p>Preise dienen als Orientierung. Verbindliches Angebot durch den ausführenden Fachbetrieb.</p>
    </div>
  );
}
