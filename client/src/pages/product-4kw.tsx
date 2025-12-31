import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  ArrowRight, 
  Download, 
  Smartphone, 
  Flame, 
  Snowflake, 
  Droplets, 
  Wifi, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Zap,
  Info,
  Home
} from "lucide-react";
import heroImage from "@assets/PXL_20250803_105021980-Photoroom_1767198306969.jpg";
import closeupImage from "@assets/R290_Premium_Black_Closeup_image_(1)_1767198326200.jpg";
import controllerImage from "@assets/CMR-4100M_Image_1767198341060.jpg";
import { useEffect } from "react";

export default function Product4kW() {
  useEffect(() => {
    document.title = "CHOFU AEYC-0449ZU-CH1 – 4 kW R290 Wärmepumpe | Heizkraft";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "4 kW CHOFU R290 Monoblock Wärmepumpe (Heizen & Kühlen). Made in Japan. Technische Daten, Funktionen, Downloads & Beratung.");
    }
  }, []);

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "CHOFU AEYC-0449ZU-CH1",
    "image": [heroImage],
    "description": "4 kW R290 Monoblock Wärmepumpe (Heizen & Kühlen). Made in Japan.",
    "brand": {
      "@type": "Brand",
      "name": "CHOFU"
    },
    "category": "Heat Pump",
    "model": "AEYC-0449ZU-CH1",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-white min-h-screen">
       {/* Schema */}
       <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>

      {/* A) Hero Section */}
      <section className="relative bg-slate-50 pt-12 pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 z-10">
              <Badge className="bg-[#E60012]/10 text-[#E60012] hover:bg-[#E60012]/20 border-none px-4 py-1 text-sm font-bold uppercase tracking-wider">
                Made in Japan
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 leading-tight">
                CHOFU AEYC-0449ZU-CH1 <span className="text-slate-400 block text-3xl mt-2 font-normal">4 kW R290 Wärmepumpe</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Monoblock Luft/Wasser – Heizen & Kühlen. Ideal für Neubau & Niedrigenergiehäuser. Flüsterleise und effizient.
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {["R290 (Propan)", "Monoblock", "Heizen & Kühlen", "DC Inverter", "Made in Japan"].map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-14 text-lg px-8 shadow-lg hover:shadow-xl transition-all font-bold" asChild>
                  <Link href="/kontakt">
                    Kostenlosen Besichtigungstermin vereinbaren
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 text-lg px-8 border-slate-300 text-slate-600 hover:text-slate-900" asChild>
                  <Link href="/pakete">
                    Pakete ansehen
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-3xl transform rotate-3 scale-105" />
              <img 
                src={heroImage} 
                alt="CHOFU R290 Monoblock Wärmepumpe im Außenbereich" 
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3] z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* B) Trust Strip */}
      <section className="bg-white border-y border-slate-100 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Trust 1 */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                <img src={closeupImage} alt="CHOFU Made in Japan – Detailansicht" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Made in Japan / CHOFU Qualität</h3>
                <p className="text-sm text-slate-500">Präzisionsfertigung für höchste Langlebigkeit.</p>
              </div>
            </div>
            
            {/* Trust 2 */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white flex items-center justify-center">
                <Smartphone className="text-primary w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Steuerung & App</h3>
                <p className="text-sm text-slate-500">Smarter Zugriff jederzeit via Comfy Connect.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* C) Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kurz erklärt: Was kann diese Wärmepumpe?</h2>
            <p className="text-slate-600">Alles was Sie für modernen Wohnkomfort brauchen.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Flame className="text-orange-500" />}
              title="Heizen"
              text="Effizient für Radiatoren und Fußbodenheizung."
            />
            <FeatureCard 
              icon={<Snowflake className="text-blue-500" />}
              title="Kühlen"
              text="Aktive Kühlung über Fan-Coils oder Flächensysteme."
            />
            <FeatureCard 
              icon={<Droplets className="text-cyan-500" />}
              title="Warmwasser"
              text="Bereitung über Speicher & 3-Wege-Ventil möglich (systemabhängig)."
            />
            <FeatureCard 
              icon={<Wifi className="text-primary" />}
              title="Smart Control"
              text="WLAN integriert für Zugriff über Comfy Connect CHOFU."
            />
          </div>
        </div>
      </section>

      {/* D) Controller Section */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                CMR-4100M Steuerung – <span className="text-primary">Bedienung & Automatik</span>
              </h2>
              <div className="space-y-4">
                {[
                  "WLAN (2.4 GHz) und Online-Steuerung über Comfy Connect CHOFU (Web/App)",
                  "Heiz- und Kühlbetrieb einfach umschaltbar",
                  "Zeitprogramme für Heizen, Kühlen und Warmwasser",
                  "Heizkurve (Climatic Curve) für effizienten witterungsgeführten Betrieb",
                  "Nachtmodus & Low-Tarif Zeitfenster konfigurierbar",
                  "Umfassende Frostschutzfunktionen (raum-, außen- & wasserseitig)"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1">
                      <Check size={14} />
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-4 bg-white rounded-2xl shadow-xl transform rotate-2" />
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img 
                  src={controllerImage} 
                  alt="CMR-4100M Controller – Bedienoberfläche" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E) Technical Data */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Technische Daten – AEYC-0449ZU-CH1</h2>
          
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-slate-100">
                  <TableRow label="Typ" value="Heating & Cooling Monoblock, DC Inverter (Reverse cycle)" />
                  <TableRow label="Netzspannung" value="1~ 230V 50Hz" />
                  <TableRow label="Heizleistung A7/W35" value="4.0 kW" />
                  <TableRow label="Leistungsaufnahme A7/W35" value="0.87 kW" />
                  <TableRow label="COP A7/W35" value="4.60" highlight />
                  <TableRow label="Kühlleistung A35/W18" value="4.0 kW" />
                  <TableRow label="Leistungsaufnahme A35/W18" value="1.00 kW" />
                  <TableRow label="EER A35/W18" value="4.00" highlight />
                  <TableRow label="Kältemittel" value="R290 (Propan), Füllmenge: 0.50 kg" />
                  <TableRow label="Abmessungen (H×B×T)" value="886 × 1000 × 330 mm" />
                  <TableRow label="Gewicht" value="66 kg" />
                  <TableRow label="Temperaturbereich (Außenluft)" value="Heizen –20…45 °C; Kühlen 15…45 °C" />
                  <TableRow label="Eintritt Wassertemperatur" value="18…65 °C (laut Herstellermanual)" />
                  <TableRow label="Wasseranschlüsse" value="R3/4 (20A) Vorlauf/Rücklauf" />
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Technische Änderungen und Irrtümer vorbehalten. Werte gemäß EN14511.
          </p>
        </div>
      </section>

      {/* F) Downloads */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Downloads & Dokumente</h2>
          <div className="grid md:grid-cols-2 gap-6">
             <DownloadCard 
               title="Installations- & Bedienungsanleitung" 
               subtitle="CHOFU AEYC (R290)" 
             />
             <DownloadCard 
               title="Installationsanleitung Controller" 
               subtitle="CMR-4100M" 
             />
          </div>
        </div>
      </section>

      {/* G) Suitable For */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Ideal geeignet für</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <UseCaseCard 
                icon={<Home className="w-8 h-8 text-green-600" />}
                title="Neubau"
                text="Perfekt dimensioniert für moderne Einfamilienhäuser mit geringem Wärmebedarf."
              />
              <UseCaseCard 
                icon={<ShieldCheck className="w-8 h-8 text-blue-600" />}
                title="Niedrigenergiehaus"
                text="Hocheffizienter Betrieb im Teillastbereich spart Stromkosten."
              />
              <UseCaseCard 
                icon={<Zap className="w-8 h-8 text-amber-600" />}
                title="Hybrid / Bestand"
                text="Möglich als Ergänzung zu bestehenden Systemen (Fachplanung erforderlich)."
              />
            </div>
         </div>
      </section>

      {/* H) FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Häufige Fragen</h2>
          <div className="space-y-6">
            <FAQItem question="Ist das eine Monoblock-Wärmepumpe?" answer="Ja, der Kältekreis ist komplett in der Außeneinheit geschlossen. Es führen nur Wasserleitungen ins Haus." />
            <FAQItem question="Kann sie auch kühlen?" answer="Ja, das Modell AEYC-0449ZU-CH1 ist serienmäßig für aktives Kühlen (Reverse Cycle) ausgestattet." />
            <FAQItem question="Wie laut ist sie?" answer="Das Gerät ist sehr leise, der genaue Schalldruckpegel ist abhängig von der Aufstellung und Entfernung. Detaillierte Schallwerte finden Sie im Datenblatt." />
            <FAQItem question="Brauche ich einen Pufferspeicher?" answer="Das ist systemabhängig. Für Abtauvorgänge und hydraulische Entkopplung wird oft ein kleiner Reihenrücklaufspeicher oder Trennspeicher empfohlen." />
            <FAQItem question="Wie läuft die Steuerung?" answer="Über den mitgelieferten Touch-Controller CMR-4100M sowie per App über Comfy Connect CHOFU (WLAN integriert)." />
            <FAQItem question="Was passiert bei Frost?" answer="Das Gerät verfügt über mehrstufige Frostschutzfunktionen. Bei Monoblock-Systemen empfehlen wir zusätzlich Frostschutzventile oder Glykol-Gemisch gemäß Fachpartner-Beratung." />
          </div>
        </div>
      </section>

      {/* I) Bottom CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Interesse an der 4 kW Lösung?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
            Lassen Sie sich von unseren Experten beraten und erhalten Sie ein Festpreis-Angebot inklusive Montage.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 mb-10 text-left max-w-md mx-auto">
             <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full text-primary"><Check /></div>
                <span>Auslegung & Prüfung vor Ort</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full text-primary"><Check /></div>
                <span>Fixpreisangebot vom Fachpartner</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 text-lg px-8 font-bold bg-primary hover:bg-primary/90 text-white" asChild>
              <Link href="/kontakt">
                Kostenlosen Besichtigungstermin vereinbaren
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 text-lg px-8 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" asChild>
              <Link href="/pakete">
                Pakete vergleichen
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-components for cleaner code
function FeatureCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
      <div className="mb-4 bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function TableRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-slate-50" : ""}>
      <td className="py-3 px-4 font-medium text-slate-600 w-1/2 border-r border-slate-50">{label}</td>
      <td className={`py-3 px-4 ${highlight ? "font-bold text-slate-900" : "text-slate-800"}`}>{value}</td>
    </tr>
  );
}

function DownloadCard({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
      <div>
        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="bg-slate-100 p-3 rounded-full text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Download size={20} />
      </div>
    </div>
  );
}

function UseCaseCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="bg-slate-50 p-6 rounded-xl text-center border border-slate-100">
      <div className="inline-flex justify-center items-center mb-4 bg-white p-3 rounded-full shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-2">
        <span className="text-primary mt-1"><Info size={16} /></span>
        {question}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed pl-6">
        {answer}
      </p>
    </div>
  );
}
