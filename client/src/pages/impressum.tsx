import { Mail, Phone, Globe, MapPin, Building2 } from "lucide-react";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-heading font-bold text-slate-900 mb-8">Impressum</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Betreiber und verantwortlich für den Inhalt
            </h2>
            <div className="space-y-2 text-slate-700">
              <p className="font-semibold text-lg">Westech Solar e.U.</p>
              <p>Firmenbuchnummer: FN 389408 i</p>
              <p>Inhaber: Alexander Oprisan</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Anschrift
            </h2>
            <address className="not-italic text-slate-700">
              Wienersdorfer Strasse 20-24 M37<br />
              2514 Traiskirchen<br />
              Osterreich
            </address>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Kontakt</h2>
            <div className="space-y-3">
              <a 
                href="mailto:office@westech-solar.at" 
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
                data-testid="link-email"
              >
                <Mail className="w-5 h-5" />
                office@westech-solar.at
              </a>
              <a 
                href="tel:+436601209109" 
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
                data-testid="link-phone"
              >
                <Phone className="w-5 h-5" />
                +43 (0)660 120 91 09
              </a>
              <a 
                href="https://westech-solar.at" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
                data-testid="link-website"
              >
                <Globe className="w-5 h-5" />
                westech-solar.at
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Rechtliche Angaben</h2>
            <div className="space-y-2 text-slate-700">
              <p><span className="font-medium">UID-Nummer:</span> ATU 676 183 49</p>
              <p><span className="font-medium">Firmenbuchgericht:</span> Landesgericht Wiener Neustadt</p>
              <p><span className="font-medium">Unternehmensgegenstand:</span> Handel mit Photovoltaik- und Warmepumpensystemen</p>
              <p><span className="font-medium">Mitglied der WKO:</span> Wirtschaftskammer Niederosterreich</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Streitbeilegung</h2>
            <p className="text-slate-700 leading-relaxed">
              Die Europaische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a 
                href="https://ec.europa.eu/consumers/odr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className="text-slate-700 mt-2 leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Haftungsausschluss</h2>
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">Haftung für Inhalte</h3>
                <p>
                  Die Inhalte unserer Seiten wurden mit grosster Sorgfalt erstellt. Für die Richtigkeit, Vollstandigkeit und Aktualitat der Inhalte konnen wir jedoch keine Gewahr ubernehmen.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-1">Haftung für Links</h3>
                <p>
                  Unser Angebot enthalt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-1">Urheberrecht</h3>
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem osterreichischen Urheberrecht. Die Vervielfaltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </section>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Stand: Januar 2026
        </p>
      </div>
    </div>
  );
}
