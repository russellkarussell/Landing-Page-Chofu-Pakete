
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowRight, Zap, ShieldCheck, Euro } from "lucide-react";
import { BUNDESLAENDER, PACKAGES, PARTNERS } from "@/lib/constants";
import heroImage from "@assets/generated_images/modern_austrian_house_with_heat_pump.png";
import { motion } from "framer-motion";

export default function Home() {
  const [selectedBundesland, setSelectedBundesland] = useState<string>("Wien");
  const [calcStep, setCalcStep] = useState(1);

  // Mini Calculator State
  const [calcData, setCalcData] = useState({ size: "", type: "Altbau" });

  const handleCalc = () => {
    setCalcStep(2);
  };

  return (
    <div className="flex flex-col gap-0">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Moderne Wärmepumpe Österreich" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20">
          
          {/* Left: Text Content */}
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium border border-primary/30 backdrop-blur-sm">
              <Zap size={14} className="fill-current" />
              <span>Jetzt Förderung sichern!</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.1]">
              Wärmepumpen zum <span className="text-primary transparent-text-stroke">Fixpreis.</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
              Transparent, planbar und installiert von zertifizierten Partnern aus Ihrer Region. Der einfachste Weg zur neuen Heizung in Österreich.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-shadow">
                <Link href="/kontakt">
                  Kostenloses Erstgespräch
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                <Link href="/pakete">
                  Pakete ansehen
                </Link>
              </Button>
            </div>
            
            <div className="pt-8 flex items-center gap-6 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Check className="text-primary" size={18} />
                <span>Alles aus einer Hand</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-primary" size={18} />
                <span>Regionale Partner</span>
              </div>
            </div>
          </div>

          {/* Right: Mini Calculator Card */}
          <div className="lg:pl-12 animate-in slide-in-from-right duration-700 delay-200">
            <Card className="backdrop-blur-md bg-white/95 border-none shadow-2xl overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-heading text-slate-900">
                  Sparpotenzial prüfen
                </CardTitle>
                <p className="text-slate-500 text-sm">
                  Finden Sie heraus, ob sich eine Wärmepumpe für Sie lohnt.
                </p>
              </CardHeader>
              <CardContent>
                {calcStep === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Wohnfläche (m²)</Label>
                      <Input 
                        id="area" 
                        placeholder="z.B. 140" 
                        type="number"
                        value={calcData.size}
                        onChange={(e) => setCalcData({...calcData, size: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gebäudetyp</Label>
                      <Select 
                        defaultValue={calcData.type} 
                        onValueChange={(val) => setCalcData({...calcData, type: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Altbau">Altbau (vor 1990)</SelectItem>
                          <SelectItem value="Saniert">Teilsaniert</SelectItem>
                          <SelectItem value="Neubau">Neubau (nach 2010)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full text-lg h-12 mt-2" 
                      onClick={handleCalc}
                      disabled={!calcData.size}
                    >
                      Jetzt berechnen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-primary mb-4">
                      <Check size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Hohes Potenzial!</h3>
                      <p className="text-slate-600 text-sm mb-4">
                        Basierend auf Ihren Angaben ({calcData.size}m², {calcData.type}) eignet sich Ihr Haus hervorragend für eine Wärmepumpe.
                      </p>
                      <p className="font-bold text-primary text-lg mb-6">
                        Ersparnis bis zu 50% möglich.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button asChild className="w-full h-12">
                         <Link href="/kontakt">Termin vereinbaren</Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full text-slate-500 hover:text-slate-900"
                        onClick={() => setCalcStep(1)}
                      >
                        Neu berechnen
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Preview Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
              Unsere Fixpreis-Pakete
            </h2>
            <p className="text-lg text-slate-600">
              Keine versteckten Kosten. Wählen Sie das Paket, das zu Ihrem Haus passt. Inklusive Montage und Inbetriebnahme.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <Card key={pkg.id} className={`flex flex-col border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative ${pkg.highlight ? 'ring-2 ring-primary scale-105 z-10' : 'bg-white'}`}>
                {pkg.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                    Beliebteste Wahl
                  </div>
                )}
                <CardHeader className={`${pkg.highlight ? 'bg-primary/5' : ''}`}>
                  <CardTitle className="text-xl font-bold text-slate-900">{pkg.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-heading font-bold text-slate-900">€ {pkg.price.toLocaleString()}</span>
                    <span className="text-slate-500 ml-2">inkl. MwSt.</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">zzgl. allfälliger Förderungen</p>
                </CardHeader>
                <CardContent className="flex-grow pt-6">
                  <p className="text-slate-600 mb-6 text-sm">{pkg.description}</p>
                  <ul className="space-y-3">
                    {pkg.features.slice(0, 4).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 pb-8">
                  <Button asChild variant={pkg.highlight ? "default" : "outline"} className="w-full">
                    <Link href={`/pakete`}>
                      Details ansehen
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="link" className="text-slate-600 hover:text-primary mx-auto">
              <Link href="/pakete" className="flex items-center gap-2">
                Alle technischen Details vergleichen <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">
                Regionale Installation. <br/>
                <span className="text-primary">Österreichweit.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Wir arbeiten ausschließlich mit geprüften Meisterbetrieben aus Ihrer Umgebung zusammen. 
                Sie profitieren von unserem günstigen Einkaufsvorteil beim Material und der handwerklichen Qualität unserer Partner vor Ort.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Geprüfte Qualität</h4>
                    <p className="text-sm text-slate-600">Alle Partner durchlaufen unser strenges Auswahlverfahren.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Euro size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Fixpreis-Garantie</h4>
                    <p className="text-sm text-slate-600">Keine Nachträge, keine Überraschungen auf der Rechnung.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Unsere Partner in Ihrer Nähe</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bundesland wählen:</Label>
                  <Select value={selectedBundesland} onValueChange={setSelectedBundesland}>
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUNDESLAENDER.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6 space-y-3">
                  {PARTNERS[selectedBundesland as keyof typeof PARTNERS]?.map((partner, i) => (
                    <motion.div 
                      key={partner.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{partner.name}</p>
                        <p className="text-xs text-slate-500">{partner.desc}</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500" title="Verfügbar" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Bereit für die Zukunft?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Vereinbaren Sie jetzt Ihren kostenlosen Besichtigungstermin und erhalten Sie ein unverbindliches Angebot.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold text-primary hover:bg-white">
            <Link href="/kontakt">
              Jetzt Termin vereinbaren
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
