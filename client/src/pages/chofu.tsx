
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Globe, Settings, ShieldCheck, ArrowRight } from "lucide-react";
import chofuData from "@/content/brand/chofu.de.json";
import { motion } from "framer-motion";
import heroImage from "@assets/image_1767192343363.png";

export default function ChofuBrandPage() {
  const { sections, faq, brand } = chofuData;
  
  const intro = sections.find(s => s.id === "intro");
  const why = sections.find(s => s.id === "why_chofu");
  const tech = sections.find(s => s.id === "technology");
  const service = sections.find(s => s.id === "service_at");

  return (
    <div className="bg-white min-h-screen">
      
      {/* Brand Hero */}
      <section className="bg-slate-900 text-white py-20 md:py-32 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40 grayscale" 
          style={{ backgroundImage: `url(${heroImage})` }} 
        />
        <div className="absolute inset-0 bg-slate-900/70 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-0" />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 text-primary-foreground/80 font-bold uppercase tracking-wider text-sm mb-6 border border-white/20 px-4 py-2 bg-white/5 backdrop-blur-sm">
              <Globe size={16} />
              <span>Seit {brand.founded} • {brand.origin}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold leading-[1.1] mb-8">
              Wer ist <span className="text-primary">{brand.name}?</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed">
              {brand.tagline} Ein tiefer Einblick in die Geschichte und Philosophie eines japanischen Haustechnik-Pioniers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 grid lg:grid-cols-12 gap-12">
        
        {/* Left Column: Story */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Intro Block */}
          <section className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-3xl font-heading font-bold text-slate-900 uppercase tracking-tight mb-6">
              {intro?.title}
            </h2>
            {intro?.text?.map((p, i) => (
              <p key={i} className="text-slate-600 leading-relaxed">{p}</p>
            ))}
          </section>

          {/* Why Chofu Block */}
          <section className="bg-slate-50 p-8 border-l-4 border-primary">
            <h3 className="text-2xl font-heading font-bold text-slate-900 uppercase tracking-tight mb-4">
              {why?.title}
            </h3>
            <div className="space-y-4">
              {why?.text?.map((p, i) => (
                <p key={i} className="text-slate-700">{p}</p>
              ))}
            </div>
          </section>

          {/* Technology Grid */}
          <section>
            <h3 className="text-2xl font-heading font-bold text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Settings className="text-primary" />
              {tech?.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {tech?.features?.map((feat, i) => (
                <Card key={i} className="border border-slate-200 bg-white rounded-none shadow-sm">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-slate-900 uppercase text-sm mb-2">{feat.title}</h4>
                    <p className="text-sm text-slate-600">{feat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Service & Proof */}
          <section className="bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
             <div className="relative z-10">
              <h3 className="text-2xl font-heading font-bold uppercase tracking-tight mb-6 flex items-center gap-3">
                <ShieldCheck className="text-primary" />
                {service?.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                   <span className="block text-5xl font-heading font-extrabold text-primary mb-2">&gt;5.000</span>
                   <span className="text-sm uppercase tracking-wider font-medium text-slate-400">Systeme im Feldbetrieb</span>
                </div>
                <div className="space-y-4 text-slate-300">
                  {service?.text?.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <Button asChild size="lg" className="h-14 px-8 font-bold uppercase tracking-wide rounded-none bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/kontakt">
                  Beratungstermin vereinbaren
                </Link>
              </Button>
             </div>
          </section>
        </div>

        {/* Right Column: Sticky Sidebar / FAQ */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-50 border border-slate-200 p-6 sticky top-24">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-6">Häufige Fragen</h4>
              <Accordion type="single" collapsible className="w-full">
                {faq.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-slate-200">
                    <AccordionTrigger className="text-left font-bold text-slate-800 text-sm hover:text-primary hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-sm">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-4">
                  Noch Fragen zur Marke oder Technologie?
                </p>
                <Link href="/kontakt" className="text-primary font-bold uppercase text-sm flex items-center gap-2 hover:underline">
                  Kontakt aufnehmen <ArrowRight size={16} />
                </Link>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}
