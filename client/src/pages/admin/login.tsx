import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, CheckCircle, Lock, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithMagicLink, signInWithPassword, user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  if (user) {
    navigate('/admin/partners');
    return null;
  }

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signInWithMagicLink(email);

    if (error) {
      toast({
        title: 'Fehler',
        description: error.message || 'Login-Link konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } else {
      setEmailSent(true);
    }

    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signInWithPassword(email, password);

    if (error) {
      toast({
        title: 'Login fehlgeschlagen',
        description: error.message || 'E-Mail oder Passwort ist falsch.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>E-Mail gesendet!</CardTitle>
            <CardDescription>
              Wir haben einen Login-Link an <strong>{email}</strong> gesendet.
              Bitte prüfen Sie Ihren Posteingang.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              Zurück zum Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Admin-Bereich</CardTitle>
          <CardDescription>
            Melden Sie sich an, um Fachpartner zu verwalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" title="Login Methode">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password">Passwort</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-pw">E-Mail-Adresse</Label>
                  <Input
                    id="email-pw"
                    type="email"
                    placeholder="ihre@email.at"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird angemeldet...
                    </>
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="magic">
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-magic">E-Mail-Adresse</Label>
                  <Input
                    id="email-magic"
                    type="email"
                    placeholder="ihre@email.at"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Login-Link senden
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-slate-500 mt-4">
                  Hinweis: Magic Links sind auf wenige E-Mails pro Stunde begrenzt.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
