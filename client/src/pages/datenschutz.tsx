import { Mail, Phone, Globe, MapPin, Shield, ExternalLink } from "lucide-react";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-heading font-bold text-slate-900 mb-8">Datenschutzerklärung</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-10">
          
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Verantwortlicher</h2>
            <div className="space-y-2 text-slate-700">
              <p className="font-semibold text-lg">Westech Solar e.U.</p>
              <p>Firmenbuchnummer: FN 389408 i</p>
              <p>Inhaber: Alexander Oprisan</p>
              <address className="not-italic mt-4">
                Wienersdorfer Straße 20–24 M37<br />
                2514 Traiskirchen<br />
                Österreich
              </address>
              <div className="mt-4 space-y-1">
                <p>E-Mail: <a href="mailto:office@westech-solar.at" className="text-primary hover:underline">office@westech-solar.at</a></p>
                <p>Telefon: <a href="tel:+436601209109" className="text-primary hover:underline">+43 (0)660 120 91 09</a></p>
                <p>Website: <a href="https://westech-solar.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">westech-solar.at</a></p>
                <p>UID-Nummer: ATU 676 183 49</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Allgemeines zur Datenverarbeitung</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten Ihre Daten ausschließlich im Einklang mit der Datenschutz-Grundverordnung (DSGVO) und dem österreichischen Datenschutzgesetz (DSG).
              </p>
              <p>
                Personenbezogene Daten werden nur verarbeitet, wenn dies zur Erfüllung eines Vertrags, aufgrund einer rechtlichen Verpflichtung oder auf Grundlage Ihrer Einwilligung erforderlich ist. Wir halten die Grundsätze der Zweckbindung und Datensparsamkeit strikt ein und erheben nur jene Daten, die für den jeweiligen Zweck notwendig sind.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Zugriffsdaten / Server-Logs</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Beim Besuch unserer Website werden automatisch technische Zugriffsdaten erfasst, die Ihr Browser an unseren Server übermittelt:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>IP-Adresse (sofern möglich anonymisiert/gekürzt)</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Browsertyp und -version</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer-URL (zuvor besuchte Seite)</li>
                <li>Besuchte Seiten auf unserer Website</li>
              </ul>
              <p>
                Diese Daten werden ausschließlich zur Gewährleistung der technischen Sicherheit, Stabilität und Fehleranalyse verwendet. Eine Zusammenführung mit anderen Datenquellen erfolgt nicht.
              </p>
              <p className="text-sm text-slate-500">
                Rechtsgrundlage: Berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Kontaktaufnahme und Formulare</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Wenn Sie uns über ein Kontaktformular, per E-Mail oder telefonisch kontaktieren, werden die von Ihnen angegebenen Daten (z. B. Name, E-Mail-Adresse, Telefonnummer, Nachricht) zur Bearbeitung Ihrer Anfrage verarbeitet und gespeichert.
              </p>
              <p>
                Die Speicherung erfolgt nur so lange, wie es für die Bearbeitung Ihrer Anfrage erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Nach Wegfall des Zwecks werden die Daten gelöscht.
              </p>
              <p className="text-sm text-slate-500">
                Rechtsgrundlage: Vertragsanbahnung gemäß Art. 6 Abs. 1 lit. b DSGVO bzw. berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Weitergabe an Installations- und Vertriebspartner</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Wenn Sie über unsere Website ein Formular absenden oder einen Projektcheck anfragen, können Ihre Kontaktdaten an ausgewählte Installations- und Vertriebspartner in Ihrer Region weitergegeben werden.
              </p>
              <p>
                <strong>Zweck der Weitergabe:</strong> Kontaktaufnahme, Erstberatung und Erstellung eines individuellen Angebots für Ihr Wärmepumpenprojekt.
              </p>
              <p>
                Die Weitergabe erfolgt ausschließlich zweckgebunden. Unsere Partner sind vertraglich zur Einhaltung der DSGVO verpflichtet und dürfen Ihre Daten nicht zu anderen Zwecken verwenden. Eine Weitergabe zu Werbezwecken an unbeteiligte Dritte erfolgt nicht.
              </p>
              <p className="text-sm text-slate-500">
                Rechtsgrundlage: Vertragsanbahnung gemäß Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Effizienz-Check / Rechner</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Eingaben in unsere Rechner und Effizienz-Checks (z. B. Wohnfläche, Gebäudetyp, Heizverhalten) dienen ausschließlich der unverbindlichen Orientierung und Dimensionierung.
              </p>
              <p>
                Diese Eingaben werden grundsätzlich anonym verarbeitet. Personenbezogene Daten werden nur dann erfasst, wenn Sie freiwillig Ihre Kontaktdaten angeben, um ein persönliches Angebot zu erhalten.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Cookies</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.
              </p>
              <p>
                <strong>Technisch notwendige Cookies:</strong> Diese sind für den Betrieb der Website erforderlich und werden ohne Ihre Zustimmung gesetzt.
              </p>
              <p>
                <strong>Analyse- und Marketing-Cookies:</strong> Diese werden nur nach Ihrer aktiven Einwilligung über unser Cookie-Banner gesetzt. Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie die Cookie-Einstellungen erneut aufrufen oder Ihre Browser-Einstellungen anpassen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Einsatz von Google Analytics und Google Ads</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Wir nutzen Google Analytics, einen Webanalysedienst der Google Ireland Limited. Google Analytics verwendet Cookies, um eine Analyse der Benutzung unserer Website zu ermöglichen.
              </p>
              <p>
                Wir haben die IP-Anonymisierung aktiviert, sodass Ihre IP-Adresse innerhalb der EU/EWR gekürzt wird, bevor sie an Google-Server übertragen wird. Die gewonnenen Informationen werden verwendet, um die Nutzung unserer Website auszuwerten und zu optimieren.
              </p>
              <p>
                Zusätzlich setzen wir Google Ads ein, um unsere Angebote auf externen Websites zu bewerben. Diese Dienste werden nur aktiviert, wenn Sie über unser Cookie-Banner Ihre Einwilligung erteilt haben.
              </p>
              <p className="text-sm text-slate-500">
                Rechtsgrundlage: Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Einsatz des Meta Pixels (Facebook / Instagram)</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Auf unserer Website wird das Meta Pixel (ehemals Facebook Pixel) eingesetzt, um die Wirksamkeit unserer Werbekampagnen auf Facebook und Instagram zu analysieren und zu optimieren.
              </p>
              <p>
                Es kann nicht ausgeschlossen werden, dass Meta Platforms Ireland Ltd. Daten an Server in den USA überträgt. Durch den Einsatz des Pixels können Besucheraktionen auf unserer Website erfasst und für Werbezwecke genutzt werden.
              </p>
              <p>
                Das Meta Pixel wird nur aktiviert, wenn Sie über unser Cookie-Banner Ihre ausdrückliche Einwilligung erteilt haben.
              </p>
              <p className="text-sm text-slate-500">
                Rechtsgrundlage: Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Hosting der Website</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Unsere Website wird bei einem professionellen Hostinganbieter betrieben. Das Hosting dient der sicheren, stabilen und effizienten Bereitstellung unserer Online-Präsenz.
              </p>
              <p>
                Mit unserem Hostinganbieter besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO, der den datenschutzkonformen Umgang mit Ihren Daten sicherstellt.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Rechte der betroffenen Personen</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>Sie haben gemäß DSGVO folgende Rechte:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO) – Sie können Auskunft über Ihre bei uns gespeicherten Daten verlangen.</li>
                <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO) – Sie können die Korrektur unrichtiger Daten verlangen.</li>
                <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO) – Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                <li><strong>Recht auf Einschränkung</strong> (Art. 18 DSGVO) – Sie können die Einschränkung der Verarbeitung verlangen.</li>
                <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO) – Sie können Ihre Daten in einem strukturierten Format erhalten.</li>
                <li><strong>Recht auf Widerruf</strong> – Sie können eine erteilte Einwilligung jederzeit widerrufen.</li>
              </ul>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-medium text-slate-900 mb-2">Beschwerderecht bei der Datenschutzbehörde</p>
                <p>
                  Wenn Sie der Meinung sind, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich an die zuständige Aufsichtsbehörde wenden:
                </p>
                <address className="not-italic mt-3">
                  Österreichische Datenschutzbehörde<br />
                  Barichgasse 40–42<br />
                  1030 Wien<br />
                  <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.dsb.gv.at</a>
                </address>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Datensicherheit</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufällige oder vorsätzliche Manipulation, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen.
              </p>
              <p>
                Unsere Website verwendet eine SSL-Verschlüsselung (erkennbar an „https://" in der Adresszeile). Dadurch werden alle Daten, die Sie an uns übermitteln, verschlüsselt übertragen.
              </p>
              <p>
                Der Zugriff auf personenbezogene Daten ist nur autorisierten Mitarbeitern gestattet, die diese zur Erfüllung ihrer Aufgaben benötigen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Aktualität dieser Datenschutzerklärung</h2>
            <div className="text-slate-700 space-y-4 leading-relaxed">
              <p>
                Diese Datenschutzerklärung hat den Stand März 2026. Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an geänderte rechtliche Anforderungen oder an Änderungen unserer Dienste anzupassen.
              </p>
              <p>
                Die aktuelle Version finden Sie stets auf dieser Seite.
              </p>
            </div>
          </section>

        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Stand: März 2026
        </p>
      </div>
    </div>
  );
}
