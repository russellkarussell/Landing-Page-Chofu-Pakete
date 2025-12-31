
import { Link, useLocation } from "wouter";
import { Leaf, Menu, X, Phone, Calculator, Package, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Startseite", icon: Home },
    { href: "/pakete", label: "Pakete", icon: Package },
    { href: "/rechner", label: "Heizkostenrechner", icon: Calculator },
    { href: "/kontakt", label: "Kontakt", icon: Phone },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Leaf size={24} strokeWidth={2.5} />
            </div>
            <span className={`text-xl font-heading font-bold tracking-tight transition-colors ${isScrolled ? "text-slate-900" : "text-slate-900"}`}>
              EcoHeat<span className="text-primary">Austria</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary font-bold" : "text-slate-600"
              }`}>
                {link.label}
              </Link>
            ))}
            <Button className="shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/kontakt">
                Termin vereinbaren
              </Link>
            </Button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="text-slate-800" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-10">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={`text-lg font-medium flex items-center gap-3 ${
                      location === link.href ? "text-primary" : "text-slate-600"
                    }`}>
                      <link.icon size={20} />
                      {link.label}
                    </Link>
                  ))}
                  <Button className="w-full mt-4" asChild>
                    <Link href="/kontakt">Termin vereinbaren</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="text-primary" />
              <span className="text-xl font-heading font-bold text-white">
                EcoHeat<span className="text-primary">Austria</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Ihr Partner für den einfachen Umstieg auf Wärmepumpen in Österreich. 
              Transparente Fixpreise, regionale Installation.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Startseite</Link></li>
              <li><Link href="/pakete" className="hover:text-primary transition-colors">Pakete</Link></li>
              <li><Link href="/rechner" className="hover:text-primary transition-colors">Heizkostenrechner</Link></li>
              <li><Link href="/kontakt" className="hover:text-primary transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AGB</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} EcoHeat Austria. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
