import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { BUNDESLAENDER } from "@/lib/constants";
import { Plus, Pencil, Trash2, Upload, Image, ExternalLink, LogOut, Loader2 } from "lucide-react";
import type { Partner, PartnerReference } from "@shared/schema";

type PartnerWithRefs = Partner & { references?: PartnerReference[] };

export default function AdminPartners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, session, loading, signOut } = useAuth();
  const [, navigate] = useLocation();
  
  const getAuthHeaders = () => ({
    "Authorization": `Bearer ${session?.access_token}`,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerWithRefs | null>(null);
  const [selectedBundeslaender, setSelectedBundeslaender] = useState<string[]>([]);

  useEffect(() => {
    if (editingPartner) {
      setSelectedBundeslaender(editingPartner.bundeslaender || []);
    } else {
      setSelectedBundeslaender([]);
    }
  }, [editingPartner]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  const createPartner = useMutation({
    mutationFn: async (data: Partial<Partner>) => {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Fehler beim Erstellen");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      setIsDialogOpen(false);
      toast({ title: "Partner erstellt" });
    },
  });

  const updatePartner = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Partner> }) => {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      setIsDialogOpen(false);
      setEditingPartner(null);
      toast({ title: "Partner aktualisiert" });
    },
  });

  const deletePartner = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/partners/${id}`, { 
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({ title: "Partner gelöscht" });
    },
  });

  const uploadLogo = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await fetch(`/api/admin/partners/${id}/logo`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });
      if (!res.ok) throw new Error("Fehler beim Hochladen");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({ title: "Logo hochgeladen" });
    },
  });

  const uploadReference = useMutation({
    mutationFn: async ({ id, file, caption }: { id: string; file: File; caption?: string }) => {
      const formData = new FormData();
      formData.append("image", file);
      if (caption) formData.append("caption", caption);
      const res = await fetch(`/api/admin/partners/${id}/references`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });
      if (!res.ok) throw new Error("Fehler beim Hochladen");
      return res.json();
    },
    onSuccess: () => {
      if (selectedPartner) {
        fetchPartnerDetails(selectedPartner.id);
      }
      toast({ title: "Referenzbild hochgeladen" });
    },
  });

  const deleteReference = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/references/${id}`, { 
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      return res.json();
    },
    onSuccess: () => {
      if (selectedPartner) {
        fetchPartnerDetails(selectedPartner.id);
      }
      toast({ title: "Referenzbild gelöscht" });
    },
  });

  const fetchPartnerDetails = async (id: string) => {
    const partner = partners.find(p => p.id === id);
    if (!partner) return;
    const res = await fetch(`/api/partners/${partner.slug}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedPartner(data);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedBundeslaender.length === 0) {
      toast({ title: "Fehler", description: "Bitte wählen Sie mindestens ein Bundesland aus.", variant: "destructive" });
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      bundeslaender: selectedBundeslaender,
      website: formData.get("website") as string || null,
      phone: formData.get("phone") as string || null,
      services: (formData.get("services") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
    };

    if (editingPartner) {
      updatePartner.mutate({ id: editingPartner.id, data });
    } else {
      createPartner.mutate(data);
    }
  };

  const toggleBundesland = (bl: string) => {
    setSelectedBundeslaender(prev => 
      prev.includes(bl) 
        ? prev.filter(b => b !== bl) 
        : [...prev, bl]
    );
  };

  const handleLogoUpload = (partnerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadLogo.mutate({ id: partnerId, file });
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPartner) return;
    const file = e.target.files?.[0];
    if (file) {
      const caption = prompt("Bildunterschrift (optional):");
      uploadReference.mutate({ id: selectedPartner.id, file, caption: caption || undefined });
    }
  };

  if (isLoading) {
    return <div className="p-8">Laden...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Fachpartner verwalten</h1>
          <p className="text-sm text-slate-500">Angemeldet als {user.email}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={signOut} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPartner(null);
            setSelectedBundeslaender([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-partner">
              <Plus className="w-4 h-4 mr-2" />
              Neuer Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPartner ? "Partner bearbeiten" : "Neuen Partner anlegen"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Unternehmensname *</Label>
                <Input id="name" name="name" defaultValue={editingPartner?.name} required data-testid="input-partner-name" />
              </div>
              <div>
                <Label>Bundesländer * <span className="text-sm font-normal text-slate-500">(mehrere möglich)</span></Label>
                <div className="grid grid-cols-2 gap-2 mt-2 p-3 border rounded-lg max-h-48 overflow-y-auto">
                  {BUNDESLAENDER.map((bl) => (
                    <div key={bl} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bl-${bl}`}
                        checked={selectedBundeslaender.includes(bl)}
                        onCheckedChange={() => toggleBundesland(bl)}
                        data-testid={`checkbox-${bl}`}
                      />
                      <label htmlFor={`bl-${bl}`} className="text-sm cursor-pointer">{bl}</label>
                    </div>
                  ))}
                </div>
                {selectedBundeslaender.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">Ausgewählt: {selectedBundeslaender.join(", ")}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Beschreibung *</Label>
                <Textarea id="description" name="description" defaultValue={editingPartner?.description} required data-testid="input-description" />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" defaultValue={editingPartner?.phone || ""} data-testid="input-phone" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" type="url" defaultValue={editingPartner?.website || ""} placeholder="https://" data-testid="input-website" />
              </div>
              <div>
                <Label htmlFor="services">Leistungen (kommagetrennt)</Label>
                <Input id="services" name="services" defaultValue={editingPartner?.services?.join(", ") || ""} placeholder="Wärmepumpen, Photovoltaik, Solar" data-testid="input-services" />
              </div>
              <Button type="submit" className="w-full" data-testid="button-save-partner">
                {editingPartner ? "Speichern" : "Erstellen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} data-testid={`card-partner-${partner.id}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="w-12 h-12 object-contain rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center">
                      <Image className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                    <p className="text-sm text-slate-500">{partner.bundeslaender?.join(", ")}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600 line-clamp-2">{partner.description}</p>
              {partner.services && partner.services.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {partner.services.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(partner.id, e)} />
                  <Button variant="outline" size="sm" asChild>
                    <span><Upload className="w-3 h-3 mr-1" /> Logo</span>
                  </Button>
                </label>
                <Button variant="outline" size="sm" onClick={() => {
                  fetchPartnerDetails(partner.id);
                }} data-testid={`button-references-${partner.id}`}>
                  <Image className="w-3 h-3 mr-1" /> Referenzen
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingPartner(partner);
                  setIsDialogOpen(true);
                }} data-testid={`button-edit-${partner.id}`}>
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {
                  if (confirm("Partner wirklich löschen?")) {
                    deletePartner.mutate(partner.id);
                  }
                }} data-testid={`button-delete-${partner.id}`}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              {partner.website && (
                <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Website
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p>Noch keine Partner vorhanden.</p>
          <p className="text-sm">Klicken Sie auf "Neuer Partner" um einen hinzuzufügen.</p>
        </div>
      )}

      <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Referenzfotos - {selectedPartner?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleReferenceUpload} />
              <Button variant="outline" asChild>
                <span><Upload className="w-4 h-4 mr-2" /> Neues Referenzbild hochladen</span>
              </Button>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedPartner?.references?.map((ref) => (
                <div key={ref.id} className="relative group">
                  <img src={ref.imageUrl} alt={ref.caption || ""} className="w-full h-32 object-cover rounded-lg" />
                  {ref.caption && <p className="text-xs text-slate-500 mt-1">{ref.caption}</p>}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteReference.mutate(ref.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            {(!selectedPartner?.references || selectedPartner.references.length === 0) && (
              <p className="text-center text-slate-500 py-8">Noch keine Referenzfotos vorhanden.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
