import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

const CONSENT_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Kurze Verzoegerung, damit der Banner nicht sofort beim Laden aufpoppt
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0">
      <div className="container mx-auto md:px-4 md:pb-4">
        <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-2xl ml-auto">
          <p className="text-sm text-slate-600 leading-relaxed flex-1">
            Diese Website verwendet technisch notwendige Cookies.{" "}
            <Link href="/datenschutz" className="text-primary hover:underline">
              Datenschutz
            </Link>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5"
            >
              Ablehnen
            </button>
            <button
              onClick={accept}
              className="bg-primary text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-primary/90 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
