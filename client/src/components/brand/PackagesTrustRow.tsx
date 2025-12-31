import { Link } from "wouter";
import { Info, Globe, ArrowRight } from "lucide-react";
import chofuData from "@/content/brand/chofu.de.json";

export function PackagesTrustRow() {
  const { packagesFundingNotice, packagesChofuTrust } = chofuData as { packagesFundingNotice: any, packagesChofuTrust: any };

  if (!packagesFundingNotice || !packagesChofuTrust) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-24 max-w-5xl mx-auto">
      {/* Funding Trust Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 flex items-start gap-4">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full shrink-0 mt-0.5">
          <Info size={18} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-1">
            {packagesFundingNotice.title}
          </h4>
          <p className="text-sm text-slate-600 mb-2 leading-relaxed">
            {packagesFundingNotice.text}
          </p>
          <Link href="/rechner" className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1">
            {packagesFundingNotice.linkLabel} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* CHOFU Trust Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-start gap-4">
        <div className="bg-slate-200 text-slate-700 p-2 rounded-full shrink-0 mt-0.5">
          <Globe size={18} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-1">
            {packagesChofuTrust.title}
          </h4>
          <p className="text-sm text-slate-600 mb-2 leading-relaxed">
            {packagesChofuTrust.text}
          </p>
          <Link href="/chofu" className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1">
            {packagesChofuTrust.linkLabel} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
