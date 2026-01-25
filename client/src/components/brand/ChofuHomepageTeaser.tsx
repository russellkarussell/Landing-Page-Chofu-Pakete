import { 
  Globe, 
  Award, 
  CheckCircle, 
  Wrench, 
  ArrowRight,
  Zap,
  Package
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import chofuData from "@/content/brand/chofu.de.json";
import chofuPremiumImage from "@/assets/chofu-premium.jpg";

// Map icon strings to components
const IconMap: Record<string, React.ComponentType<any>> = {
  Globe,
  Award,
  CheckCircle,
  Wrench,
  Zap,
  Package
};

export function ChofuHomepageTeaser() {
  const { homepage } = chofuData as { homepage: any };

  if (!homepage) return null;

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-4">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Text Column */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-4">
              <div className="h-px w-8 bg-primary"></div>
              <span>{chofuData.brand.name} Japan</span>
              <div className="h-px w-8 bg-primary"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-6 leading-tight">
              {homepage.title}
            </h2>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              {homepage.intro?.map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* Image Column */}
          <div className="mt-8 lg:mt-0">
            <img 
              src={chofuPremiumImage}
              alt="CHOFU Wärmepumpe – Premium Wärmepumpentechnik Made in Japan"
              className="w-full h-auto rounded-xl shadow-lg shadow-slate-900/10 object-contain"
              loading="lazy"
              data-testid="img-chofu-premium"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {homepage.benefits.map((benefit: any, idx: number) => {
            const Icon = IconMap[benefit.icon] || CheckCircle;
            return (
              <Card key={idx} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow rounded-none flex items-center p-4">
                 <div className="w-12 h-12 bg-primary/5 text-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-slate-900 text-sm uppercase tracking-wide">{benefit.text}</span>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="h-14 px-8 font-bold uppercase tracking-wide rounded-none shadow-lg">
            <Link href="/kontakt">
              {homepage.ctaPrimary}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 font-bold uppercase tracking-wide rounded-none border-2">
            <Link href="/chofu">
              {homepage.ctaSecondary} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
