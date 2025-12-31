
import { 
  Globe, 
  Award, 
  CheckCircle, 
  Wrench, 
  ArrowRight 
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import chofuData from "@/content/brand/chofu.de.json";

// Map icon strings to components
const IconMap: Record<string, React.ComponentType<any>> = {
  Globe,
  Award,
  CheckCircle,
  Wrench
};

export function BrandSection() {
  const { sections, benefits } = chofuData;
  const introSection = sections.find(s => s.id === "intro");

  if (!introSection) return null;

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-4">
            <div className="h-px w-8 bg-primary"></div>
            <span>{chofuData.brand.name} Japan</span>
            <div className="h-px w-8 bg-primary"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-6 leading-tight">
            {introSection.title}
          </h2>
          <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
            {introSection.text?.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, idx) => {
            const Icon = IconMap[benefit.icon] || CheckCircle;
            return (
              <Card key={idx} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow rounded-none">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">{benefit.title}</h4>
                  <p className="text-sm text-slate-500 leading-snug">{benefit.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="h-14 px-8 font-bold uppercase tracking-wide rounded-none shadow-lg">
            <Link href="/kontakt">
              Kostenlosen Besichtigungstermin vereinbaren
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 font-bold uppercase tracking-wide rounded-none border-2">
            <Link href="/chofu">
              Mehr über CHOFU
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}

export function TrustCallout() {
  return (
    <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-none">
      <div className="flex items-start gap-4">
        <div className="bg-primary text-white p-2 mt-1">
          <Globe size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 uppercase text-sm mb-1">Chofu Technologie</h4>
          <p className="text-sm text-slate-600 mb-3">
            Entwickelt in Japan, bewährt in Österreich. Profitieren Sie von der Erfahrung aus über 5.000 installierten Systemen.
          </p>
          <Link href="/chofu" className="text-primary text-sm font-bold uppercase tracking-wide flex items-center gap-1 hover:underline">
            Herstellerprofil ansehen <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
