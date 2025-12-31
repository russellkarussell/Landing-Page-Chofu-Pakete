import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Info } from "lucide-react";

interface PackageContentItem {
  category: string;
  items: string[];
}

const PACKAGE_CONTENTS: Record<number, PackageContentItem[]> = {
  4: [
    {
      category: "Wärmepumpe & Regelung",
      items: [
        "CHOFU AEYC-0449ZU-CH1 – 4 kW R290 Monoblock-Wärmepumpe (Made in Japan, Inverter, bis 75 °C Vorlauf)",
        "CHOFU Steuerung CMR-4100M – Touchdisplay mit WLAN"
      ]
    },
    {
      category: "Hydraulik / Innenmodul",
      items: [
        "HEIZKRAFT compact² Hydrobox (Systemtrennung + Sicherheitstechnik)",
        "1,6 m² Edelstahl-Plattenwärmetauscher (hydraulische Trennung)",
        "3 kW Heizstab (elektrische Zusatzheizung)",
        "3-Wege-Ventil (Danfoss) für Warmwasser-Umschaltung",
        "10 l Ausdehnungsgefäß (wärmepumpenseitig)",
        "Manometer, 2 Entlüfter, 3 bar Sicherheitsventil",
        "2 Umwälzpumpen (je 4,2 m³/h)"
      ]
    },
    {
      category: "Speicher & Systemschutz",
      items: [
        "HEIZKRAFT WP1 300-GR – 300 l emaillierter Wärmepumpenspeicher (4 m² Wärmetauscherfläche)",
        "Fish S4 30 – 30 l Rücklaufspeicher (Taktschutz & Abtaureserve)",
        "IVAR Dirtstop 1″ Magnetfilter"
      ]
    },
    {
      category: "Verbindungskomponenten",
      items: [
        "Solarleitung DN20 (2×) inkl. Verschraubungssatz",
        "Reduzierstück 1″ AG × 3/4″ IG",
        "Frostschutz-Konzentrat 10 l",
        "Dämpfungssockel 600×180×95 mm (2 Stk.) für Außeneinheit"
      ]
    }
  ],
  6: [
    {
      category: "Wärmepumpe & Regelung",
      items: [
        "CHOFU AEYC-0649ZU-CH1 – 6 kW R290 Monoblock-Wärmepumpe (Made in Japan, Inverter, bis 75 °C Vorlauf)",
        "CHOFU Steuerung CMR-4100M – Touchdisplay mit WLAN"
      ]
    },
    {
      category: "Hydraulik / Innenmodul",
      items: [
        "HEIZKRAFT compact² Hydrobox (Systemtrennung + Sicherheitstechnik)",
        "1,6 m² Edelstahl-Plattenwärmetauscher (hydraulische Trennung)",
        "3 kW Heizstab integriert",
        "3-Wege-Ventil (Danfoss) Warmwasser-Umschaltung",
        "10 l Ausdehnungsgefäß, Manometer, 2 Entlüfter, 3 bar Sicherheitsventil",
        "2 Umwälzpumpen (je 4,2 m³/h)"
      ]
    },
    {
      category: "Speicher & Systemschutz",
      items: [
        "HEIZKRAFT WP1 300-GR – 300 l emaillierter Wärmepumpenspeicher (4 m² Wärmetauscherfläche)",
        "Fish S4 30 – 30 l Rücklaufspeicher (Taktschutz & Abtaureserve)",
        "IVAR Dirtstop 1″ Magnetfilter"
      ]
    },
    {
      category: "Verbindungskomponenten",
      items: [
        "Solarleitung DN20 (2×) inkl. Verschraubungssatz",
        "Reduzierstück 1″ AG × 3/4″ IG",
        "Frostschutz-Konzentrat 10 l",
        "Dämpfungssockel Set (2 Stk.) für Außeneinheit"
      ]
    }
  ],
  10: [
    {
      category: "Wärmepumpe & Regelung",
      items: [
        "CHOFU AEYC-1049ZU-CH1 – 10 kW R290 Monoblock-Wärmepumpe (Made in Japan, Inverter, bis 75 °C Vorlauf) (Mockup)",
        "CHOFU Steuerung CMR-4100M – Touchdisplay mit WLAN (Mockup)"
      ]
    },
    {
      category: "Hydraulik / Innenmodul",
      items: [
        "HEIZKRAFT compact² Hydrobox (Systemtrennung + Sicherheitstechnik) (Mockup)"
      ]
    },
    {
      category: "Speicher & Systemschutz",
      items: [
        "HEIZKRAFT WP1 300-GR – 300 l Wärmepumpenspeicher (4 m² WT) (Mockup)",
        "Fish S4 30 Rücklaufspeicher (Mockup)",
        "IVAR Dirtstop 1″ Magnetfilter (Mockup)"
      ]
    },
    {
      category: "Verbindungskomponenten",
      items: [
        "Solarleitung DN20 (2×) inkl. Verschraubungssatz (Mockup)",
        "Reduzierstücke / Anschlussset passend zur Hydrobox (Mockup)",
        "Frostschutz-Konzentrat 10 l (Mockup)",
        "Dämpfungssockel Set für Außeneinheit (Mockup)"
      ]
    }
  ]
};

export function PackageContentsAccordion({ kw }: { kw: number }) {
  const contents = PACKAGE_CONTENTS[kw];
  const isMockup = kw === 10;

  if (!contents) return null;

  return (
    <Accordion type="single" collapsible className="w-full mt-4 border-t border-slate-100">
      <AccordionItem value="contents" className="border-b-0">
        <AccordionTrigger className="hover:no-underline py-3 text-slate-900 font-bold text-sm">
          <span>Im Paket enthalten</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-1 pb-2">
            {isMockup && (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 mb-3">
                <Info size={14} />
                <span>Mockup (wird final nach Projektcheck definiert)</span>
              </div>
            )}
            
            {contents.map((section, idx) => (
              <div key={idx}>
                <h5 className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-2">
                  {section.category}
                </h5>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug">
                      <div className="mt-0.5 rounded-full bg-slate-100 p-0.5 shrink-0">
                        <Check className="text-slate-600 w-2.5 h-2.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="pt-2 text-[10px] text-slate-400 text-center italic">
               Quelle: westech.shop
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
