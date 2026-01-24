
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Packages from "@/pages/packages";
import Product4kW from "@/pages/product-4kw";
import Product6kW from "@/pages/product-6kw";
import Product10kW from "@/pages/product-10kw";
import HeatPumpOverview from "@/pages/waermepumpen";
import Contact from "@/pages/contact";
import Heizkostenrechner from "@/pages/calculator";
import ChofuBrandPage from "@/pages/chofu";
import Impressum from "@/pages/impressum";
import { useEffect } from "react";

function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pakete" component={Packages} />
        <Route path="/waermepumpe/4kw" component={Product4kW} />
        <Route path="/waermepumpe/6kw" component={Product6kW} />
        <Route path="/waermepumpe/10kw" component={Product10kW} />
        <Route path="/waermepumpen" component={HeatPumpOverview} />
        <Route path="/kontakt" component={Contact} />
        <Route path="/rechner" component={Heizkostenrechner} />
        <Route path="/chofu" component={ChofuBrandPage} />
        <Route path="/impressum" component={Impressum} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
