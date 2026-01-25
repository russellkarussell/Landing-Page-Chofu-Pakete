
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUNDESLAENDER } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { submitContactRequest } from "@/lib/api";
import { insertContactRequestSchema } from "@shared/schema";
import { useTurnstile } from "@/hooks/useTurnstile";

export default function Contact() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { containerRef: turnstileRef, token: turnstileToken, isValid: turnstileIsValid, reset: resetTurnstile } = useTurnstile();

  const form = useForm<z.infer<typeof insertContactRequestSchema>>({
    resolver: zodResolver(insertContactRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bundesland: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: submitContactRequest,
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Anfrage gesendet!",
        description: "Wir haben Ihre Anfrage erhalten und melden uns in Kürze.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const area = searchParams.get("area");
    const type = searchParams.get("type");
    const recommendation = searchParams.get("recommendation");

    if (area || type || recommendation) {
      const message = `Effizienz-Check Ergebnis:
Wohnfläche: ${area ? area + ' m²' : '-'}
Gebäudetyp: ${type || '-'}
Empfehlung: ${recommendation || '-'}

Bitte um Beratung zu diesem Objekt.`;
      
      form.setValue("message", message);
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof insertContactRequestSchema>) {
    if (!turnstileIsValid) {
      toast({
        title: "Sicherheitsprüfung erforderlich",
        description: "Bitte warten Sie, bis die Sicherheitsprüfung abgeschlossen ist.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({ ...values, turnstileToken: turnstileToken || "" }, {
      onSuccess: () => {
        resetTurnstile();
      }
    });
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">
            Kostenloses Erstgespräch vereinbaren
          </h1>
          <p className="text-lg text-slate-600">
            Starten Sie jetzt Ihr Wärmepumpen-Projekt. Wir verbinden Sie mit einem geprüften Installationspartner in Ihrer Region.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Ihr Weg zur neuen Heizung</CardTitle>
                <CardDescription>
                  In 3 einfachen Schritten zur fertigen Installation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: "Anfrage senden", desc: "Füllen Sie das Formular aus." },
                  { title: "Partner-Match", desc: "Wir suchen den passenden Installateur in Ihrem Bundesland." },
                  { title: "Besichtigung & Angebot", desc: "Kostenloser Termin vor Ort und verbindliches Angebot." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{step.title}</h4>
                      <p className="text-sm text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
              <h3 className="font-heading font-bold text-xl mb-4 text-slate-900">Warum meine-waermepumpe.at?</h3>
              <ul className="space-y-3">
                {[
                  "Geprüfte regionale Partnerbetriebe",
                  "Transparente Paketpreise",
                  "Schnelle Verfügbarkeit",
                  "Unabhängige Beratung"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 size={18} className="text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-xl border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Kontaktformular</CardTitle>
              <CardDescription>Unverbindlich & kostenlos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Max Mustermann" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-Mail</FormLabel>
                          <FormControl>
                            <Input placeholder="max@beispiel.at" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="+43 664 123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bundesland"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bundesland</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Bitte wählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BUNDESLAENDER.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachricht / Projektdetails (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Kurze Beschreibung Ihres Hauses (z.B. Baujahr, aktuelle Heizung)..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div ref={turnstileRef} className="flex justify-center" />
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                    disabled={mutation.isPending || !turnstileIsValid}
                    data-testid="button-submit-contact"
                  >
                    {mutation.isPending ? "Wird gesendet..." : "Termin anfragen"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Mit dem Absenden stimmen Sie zu, dass wir Ihre Daten an einen Partner in Ihrer Region weiterleiten.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
