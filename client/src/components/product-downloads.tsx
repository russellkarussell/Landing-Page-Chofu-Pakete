import { Download, FileText, Award, Zap, BookOpen } from "lucide-react";

const DOCUMENT_LINKS = {
  manual: "https://yeaxuexfornuxvcldtux.supabase.co/storage/v1/object/public/documents/02072025%20Final%20R290%20Manual%20DE.pdf",
  datasheet: "https://yeaxuexfornuxvcldtux.supabase.co/storage/v1/object/public/documents/Chofu%20R290%20Produktdatenblatt.pdf",
  flyer: "https://yeaxuexfornuxvcldtux.supabase.co/storage/v1/object/public/documents/Chofu%20R290Flyer%20DE.pdf",
  ehpa: "https://yeaxuexfornuxvcldtux.supabase.co/storage/v1/object/public/documents/AT-HP-01236.pdf",
  sgReady: "https://yeaxuexfornuxvcldtux.supabase.co/storage/v1/object/public/documents/SG-R_H0817.pdf",
};

interface DownloadItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function DownloadItem({ href, icon, title, subtitle }: DownloadItemProps) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-white p-5 border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all group"
      data-testid={`download-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-slate-100 p-3 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="text-slate-400 group-hover:text-primary transition-colors">
        <Download size={20} />
      </div>
    </a>
  );
}

export function ProductDownloads() {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Downloads & Dokumente</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <DownloadItem 
            href={DOCUMENT_LINKS.manual}
            icon={<BookOpen size={20} />}
            title="Bedienungsanleitung"
            subtitle="Installations- & Bedienungsanleitung (DE)"
          />
          <DownloadItem 
            href={DOCUMENT_LINKS.datasheet}
            icon={<FileText size={20} />}
            title="Produktdatenblatt"
            subtitle="Technische Spezifikationen"
          />
          <DownloadItem 
            href={DOCUMENT_LINKS.flyer}
            icon={<FileText size={20} />}
            title="Produktflyer"
            subtitle="CHOFU R290 Monoblock Serie"
          />
          <DownloadItem 
            href={DOCUMENT_LINKS.ehpa}
            icon={<Award size={20} />}
            title="EHPA Gütesiegel"
            subtitle="Zertifikat AT-HP-01236"
          />
          <DownloadItem 
            href={DOCUMENT_LINKS.sgReady}
            icon={<Zap size={20} />}
            title="SG Ready Zertifikat"
            subtitle="Smart-Grid-Kompatibilität"
          />
        </div>
      </div>
    </section>
  );
}
