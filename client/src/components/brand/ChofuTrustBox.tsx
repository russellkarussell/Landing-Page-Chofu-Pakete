import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ArrowRight } from "lucide-react";
import chofuData from "@/content/brand/chofu.de.json";

export function ChofuTrustBox() {
  const { packagesTrust } = chofuData as { packagesTrust: any };

  if (!packagesTrust) return null;

  return (
    <Card className="border border-slate-200 bg-white shadow-sm mb-12">
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-primary/10 text-primary p-1.5 rounded-full">
               <Globe size={18} />
             </div>
             <h3 className="font-heading font-bold text-slate-900 text-lg uppercase tracking-wide">
               {packagesTrust.title}
             </h3>
          </div>
          <div className="space-y-1 text-slate-600">
             {packagesTrust.text?.map((line: string, i: number) => (
               <p key={i} className="leading-relaxed text-sm md:text-base">{line}</p>
             ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
           <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:text-primary hover:border-primary">
             <Link href="/chofu" className="flex items-center gap-2">
               {packagesTrust.linkLabel} <ArrowRight size={16} />
             </Link>
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
