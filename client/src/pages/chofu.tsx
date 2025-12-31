
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Globe, ArrowRight } from "lucide-react";
import chofuData from "@/content/brand/chofu.de.json";
import heroImage from "@assets/image_1767192343363.png";

export default function ChofuBrandPage() {
  const { pageTitle, pageIntro, sections, faq, brand } = chofuData;

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
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold leading-[1.1] mb-8">
              {pageTitle}
            </h1>
            <div className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed space-y-4">
              {pageIntro.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 grid lg:grid-cols-12 gap-12">
        
        {/* Left Column: Story */}
        <div className="lg:col-span-8 space-y-16">
          
          {sections.map((section) => (
            <section key={section.id} className="prose prose-lg prose-slate max-w-none">
              <h2 className="text-3xl font-heading font-bold text-slate-900 uppercase tracking-tight mb-6">
                {section.title}
              </h2>
              {section.text.map((p, i) => (
                <p key={i} className="text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* Bottom CTA Card */}
          <div className="bg-slate-50 border border-slate-200 p-8 md:p-10 rounded-xl mt-12">
            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-4">
              Interessiert an einem CHOFU System?
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl">
              Lassen Sie sich unverbindlich beraten und prüfen Sie, ob eine CHOFU Wärmepumpe zu Ihrem Gebäude passt.
            </p>
            <Button asChild size="lg" className="h-14 px-8 font-bold uppercase tracking-wide">
              <Link href="/kontakt">
                Kostenlosen Besichtigungstermin vereinbaren
              </Link>
            </Button>
          </div>

        </div>

        {/* Right Column: Sticky Sidebar / FAQ */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-50 border border-slate-200 p-6 sticky top-24">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-6">Häufige Fragen</h4>
              <Accordion type="single" collapsible className="w-full">
                {faq.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-slate-200">
                    <AccordionTrigger className="text-left font-bold text-slate-800 text-sm hover:text-primary hover:no-underline py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-sm pb-4">
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
