import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  ArrowRight, 
  Flame, 
  Snowflake, 
  Droplets, 
  Wifi, 
  Calculator,
  Leaf,
  Zap,
  LayoutGrid
} from "lucide-react";
import heroImage4kW from "@assets/image_1767196454458.png";
import heroImage6kW from "@assets/PXL_20250803_105021980-Photoroom_1767199080674.jpg";
import heroImage10kW from "@/assets/chofu-10kw.png";
import { useEffect } from "react";

export default function HeatPumpOverview() {
  useEffect(() => {
    document.title = "CHOFU Wärmepumpen 4–10 kW | Vergleich & technische Daten | Heizkraft";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Vergleichen Sie CHOFU R290 Wärmepumpen (4, 6, 10 kW). Technische Daten, Funktionen, Downloads und Beratung in Österreich.");
    }
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-[#E60012]/10 text-[#E60012] hover:bg-[#E60012]/20 border-none px-4 py-1 text-sm font-bold uppercase tracking-wider mb-6">
            Made in Japan
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 leading-tight mb-6">
            CHOFU Wärmepumpen <span className="text-slate-400 font-normal block text-3xl md:text-4xl mt-2">4 kW, 6 kW, 10 kW</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            R290 Monoblock. Made in Japan. Heizen & Kühlen. Technische Daten & Downloads.
          </p>
        </div>
      </section>

      {/* Product Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 4kW Card */}
            <ProductCard 
              title="CHOFU AEYC-0449ZU" 
              kw="4" 
              image={heroImage4kW}
              link="/waermepumpe/4kw"
              features={[
                "R290 (Propan)",
                "Monoblock",
                "Max. Vorlauf 75 °C",
                "Energieeffizienz A+++ (35 °C)",
                "Ideal für Neubau"
              ]}
            />
            {/* 6kW Card */}
            <ProductCard 
              title="CHOFU AEYC-0649ZU" 
              kw="6" 
              image={heroImage6kW}
              link="/waermepumpe/6kw"
              features={[
                "R290 (Propan)",
                "Monoblock",
                "Max. Vorlauf 75 °C",
                "Energieeffizienz A+++ (35 °C)",
                "Leise im Nachtmodus"
              ]}
              highlight
            />
            {/* 10kW Card */}
            <ProductCard 
              title="CHOFU AEYC-1049ZU" 
              kw="10" 
              image={heroImage10kW}
              link="/waermepumpe/10kw"
              features={[
                "R290 (Propan)",
                "Monoblock",
                "Max. Vorlauf 75 °C",
                "Volle Leistung bei -5°C",
                "Leise im Nachtmodus"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Technische Daten im Vergleich</h2>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-xs">
                  <tr>
                    <th className="py-4 px-6 w-1/4">Modell</th>
                    <th className="py-4 px-6 w-1/4">4 kW</th>
                    <th className="py-4 px-6 w-1/4 bg-primary/5">6 kW</th>
                    <th className="py-4 px-6 w-1/4">10 kW</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <TableRow label="Heizleistung A7/W35" val4="4.0 kW" val6="6.0 kW" val10="10.0 kW" />
                  <TableRow label="COP A7/W35" val4="4.60" val6="4.88" val10="4.95" highlight />
                  <TableRow label="Max. Vorlauf" val4="75 °C" val6="75 °C" val10="75 °C" />
                  <TableRow label="Empfohlen für" val4="Neubau / Niedrigenergie" val6="EFH / Sanierung" val10="Sanierung / MFH" />
                  <TableRow label="Abmessungen (HxBxT)" val4="886 x 1000 x 330 mm" val6="886 x 1000 x 330 mm" val10="886 x 1000 x 330 mm" />
                  <TableRow label="Gewicht" val4="66 kg" val6="82 kg" val10="117 kg" />
                  <TableRow label="Geräusch Nachtmodus @5m" val4="—" val6="33 dB(A)" val10="34 dB(A)" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="bg-primary/5 rounded-2xl p-10 border border-primary/10">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Welche Leistung passt?</h2>
            <div className="grid gap-4 text-left max-w-lg mx-auto mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-1 shrink-0" size={18} />
                <span className="text-slate-700">Die passende Dimensionierung ist entscheidend für Effizienz & Lebensdauer.</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-1 shrink-0" size={18} />
                <span className="text-slate-700">Nutzen Sie unseren Rechner für eine erste Einschätzung.</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-1 shrink-0" size={18} />
                <span className="text-slate-700">Genaue Heizlastberechnung erfolgt durch unsere Fachpartner.</span>
              </div>
            </div>
            
            <Button size="lg" className="h-14 text-lg px-8 font-bold shadow-lg" asChild>
              <Link href="/rechner">
                <Calculator className="mr-2" size={20} /> Zum Heizkostenrechner
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Kostenlosen Besichtigungstermin vereinbaren</h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
            Starten Sie jetzt Ihr Projekt mit einer unverbindlichen Beratung vor Ort.
          </p>
          <Button size="lg" className="h-14 text-lg px-10 font-bold bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl transition-all" asChild>
            <Link href="/kontakt">
              Termin vereinbaren
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ title, kw, image, link, features, highlight = false }: { 
  title: string, 
  kw: string, 
  image: string, 
  link: string, 
  features: string[],
  highlight?: boolean 
}) {
  return (
    <div className={`flex flex-col h-full bg-white rounded-xl border transition-all hover:shadow-xl ${highlight ? 'border-primary shadow-lg scale-105 z-10' : 'border-slate-200 hover:border-slate-300'}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100">
        <img src={image} alt={title} className="w-full h-full object-cover object-center" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-slate-200">
          {kw} kW
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 font-medium">{kw} kW Leistungsklasse</p>
        
        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <div className="grid gap-3 mt-auto">
          <Button className="w-full font-bold" asChild>
            <Link href={link}>
              Produktdetails
            </Link>
          </Button>
          <Button variant="outline" className="w-full text-slate-600" asChild>
            <Link href="/pakete">
              Zum Paket
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function TableRow({ label, val4, val6, val10, highlight = false }: { label: string, val4: string, val6: string, val10: string, highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-slate-50 font-medium" : ""}>
      <td className="py-4 px-6 text-slate-600 border-r border-slate-100">{label}</td>
      <td className="py-4 px-6 text-slate-900 border-r border-slate-100">{val4}</td>
      <td className={`py-4 px-6 text-slate-900 border-r border-slate-100 ${highlight ? 'bg-primary/5' : 'bg-slate-50'}`}>{val6}</td>
      <td className="py-4 px-6 text-slate-900">{val10}</td>
    </tr>
  );
}
