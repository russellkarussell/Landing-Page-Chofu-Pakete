
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowRight, Calculator, CheckCircle2, AlertCircle } from "lucide-react";

export default function Heizkostenrechner() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [data, setData] = useState({
    area: 140,
    year: 1990,
    type: "efh", // efh, rh, dh
    heating: "gas", // gas, oil, pellets
    people: 3,
  });

  const handleCalculate = () => {
    setLoading(true);
    // Simulate calculation delay
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  // Mock Calculation Logic
  const calculateSavings = () => {
    // Very rough estimation logic for mockup purposes
    // Oil: ~12-14 ct/kWh equivalent (approx 1.2€/liter, 10kWh/l) -> let's say 12ct
    // Gas: ~10-12 ct/kWh -> 11ct
    // WP: SCOP 3.5, Strom ~30ct -> ~8.5ct/kWh effective

    let consumptionKwh = data.area * (data.year < 1995 ? 150 : data.year < 2010 ? 100 : 50);
    
    // Adjust for people (hot water)
    consumptionKwh += data.people * 800;

    let currentCost = 0;
    let wpCost = consumptionKwh * 0.085; // 8.5 cents effective

    if (data.heating === "oil") currentCost = consumptionKwh * 0.13;
    if (data.heating === "gas") currentCost = consumptionKwh * 0.11;
    if (data.heating === "pellets") currentCost = consumptionKwh * 0.09;
    if (data.heating === "electric") currentCost = consumptionKwh * 0.30;

    return {
      current: Math.round(currentCost),
      wp: Math.round(wpCost),
      savings: Math.round(currentCost - wpCost),
      tenYearSavings: Math.round((currentCost - wpCost) * 10)
    };
  };

  const results = calculateSavings();

  const chartData = [
    { name: 'Aktuell', cost: results.current, fill: '#64748b' },
    { name: 'Wärmepumpe', cost: results.wp, fill: '#16a34a' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-4">
            <Calculator className="text-primary h-8 w-8" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">
            Heizkostenrechner
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Ermitteln Sie Ihr Sparpotenzial in wenigen Schritten.
            Die Berechnung basiert auf Durchschnittswerten und dient als erste Orientierung.
          </p>
        </div>

        <Card className="shadow-xl border-0 overflow-hidden">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-white border-b border-slate-100">
                <CardTitle>Ihre Gebäudedaten</CardTitle>
                <CardDescription>Bitte füllen Sie die folgenden Felder möglichst genau aus.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Wohnfläche (m²)</Label>
                      <div className="flex items-center gap-4">
                        <Slider 
                          value={[data.area]} 
                          onValueChange={(val) => setData({...data, area: val[0]})} 
                          min={50} max={400} step={10} 
                          className="flex-grow"
                        />
                        <Input 
                          type="number" 
                          value={data.area} 
                          onChange={(e) => setData({...data, area: Number(e.target.value)})} 
                          className="w-20 font-bold text-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Baujahr</Label>
                      <Input 
                        type="number" 
                        value={data.year} 
                        onChange={(e) => setData({...data, year: Number(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Aktuelles Heizsystem</Label>
                      <Select value={data.heating} onValueChange={(val) => setData({...data, heating: val})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oil">Öl-Heizung</SelectItem>
                          <SelectItem value="gas">Gas-Heizung</SelectItem>
                          <SelectItem value="pellets">Pellets</SelectItem>
                          <SelectItem value="electric">Strom-Direktheizung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Bewohner im Haushalt</Label>
                      <Select value={String(data.people)} onValueChange={(val) => setData({...data, people: Number(val)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6].map(n => (
                            <SelectItem key={n} value={String(n)}>{n} Person{n > 1 && 'en'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold" 
                    onClick={handleCalculate}
                    disabled={loading}
                  >
                    {loading ? "Berechne..." : "Jetzt Ersparnis berechnen"}
                  </Button>
                </div>
              </CardContent>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <CardHeader className="bg-primary/5 border-b border-primary/10 text-center py-8">
                <CardTitle className="text-3xl font-heading text-primary mb-2">
                  € {results.savings.toLocaleString()} Ersparnis / Jahr
                </CardTitle>
                <CardDescription className="text-lg">
                  Mit einer modernen Wärmepumpe könnten Sie Ihre Heizkosten deutlich senken.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                
                <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickFormatter={(val) => `€${val}`} tickLine={false} axisLine={false} />
                        <Tooltip 
                          formatter={(value) => [`€ ${Number(value).toLocaleString()}`, 'Kosten pro Jahr']}
                          cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Aktuelle Kosten (ca.):</span>
                        <span className="font-bold text-slate-900">€ {results.current.toLocaleString()} / Jahr</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600">Wärmepumpe (ca.):</span>
                        <span className="font-bold text-green-600">€ {results.wp.toLocaleString()} / Jahr</span>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg text-slate-900">Ersparnis in 10 Jahren:</span>
                          <span className="font-bold text-2xl text-primary">€ {results.tenYearSavings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                      <AlertCircle className="flex-shrink-0 h-5 w-5" />
                      <p>
                        Dies ist eine unverbindliche Schätzung. Die tatsächliche Ersparnis hängt von der Dämmung, dem Nutzerverhalten und den tatsächlichen Energiepreisen ab.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4 max-w-md mx-auto">
                  <h3 className="font-bold text-xl text-slate-900">Nächster Schritt</h3>
                  <p className="text-slate-600 mb-6">
                    Lassen Sie Ihr Haus von einem Experten prüfen und erhalten Sie ein verbindliches Fixpreis-Angebot.
                  </p>
                  <Button asChild size="lg" className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                    <Link href="/kontakt">
                      Kostenlosen Besichtigungstermin vereinbaren
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600">
                    Berechnung anpassen
                  </Button>
                </div>

              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
