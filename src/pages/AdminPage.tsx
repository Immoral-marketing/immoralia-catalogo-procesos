import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Loader2, LogOut, Users, FileText, Euro, Plus, Check, X,
  ChevronDown, ToggleLeft, ToggleRight, Trophy, Copy, MoreHorizontal, Pencil, Trash2,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Partner {
  id: string;
  nombre: string;
  email: string;
  slug: string;
  activo: boolean;
  created_at: string;
}

interface SolicitudAdmin {
  id: string;
  partner_id: string | null;
  datos_formulario: Record<string, any>;
  estado: string;
  importe_cobrado: number | null;
  override_manual: boolean;
  created_at: string;
  partner?: { id: string; nombre: string; slug: string } | null;
}

interface ComisionAdmin {
  id: string;
  solicitud_id: string;
  partner_id: string;
  importe_base: number;
  importe_comision: number;
  estado: string;
  created_at: string;
  pagada_at: string | null;
  partner?: { nombre: string; slug: string } | null;
}

type AdminTab = 'partners' | 'solicitudes' | 'comisiones';
type AuthState = 'loading' | 'unauthenticated' | 'not_admin' | 'authenticated';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const ESTADO_SOLICITUD: Record<string, { label: string; className: string }> = {
  pendiente:   { label: 'Pendiente',   className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  en_proceso:  { label: 'En proceso',  className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  aprobada:    { label: 'Aprobada',    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  cerrada:     { label: 'Cerrada',     className: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  pagada:      { label: 'Pagada',      className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
};

const ESTADO_COMISION: Record<string, { label: string; className: string }> = {
  pendiente:   { label: 'Pendiente',   className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  confirmada:  { label: 'Confirmada',  className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  pagada:      { label: 'Pagada',      className: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
};

const ESTADOS_SOLICITUD_OPTIONS = ['pendiente', 'en_proceso', 'aprobada', 'cerrada', 'pagada'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setAuthState('unauthenticated'); return; }
      setSession(session);

      const { data } = await supabase.from('super_admins').select('user_id').eq('user_id', session.user.id).single();
      setAuthState(data ? 'authenticated' : 'not_admin');
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { setAuthState('unauthenticated'); setSession(null); }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authState === 'loading') {
    return <FullPageLoader />;
  }

  if (authState === 'unauthenticated') {
    return <AdminLogin onSuccess={(s) => { setSession(s); setAuthState('authenticated'); }} />;
  }

  if (authState === 'not_admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground mb-4">Esta cuenta no tiene permisos de administrador.</p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Cerrar sesión</Button>
        </div>
      </div>
    );
  }

  return <AdminDashboard session={session!} />;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
function AdminLogin({ onSuccess }: { onSuccess: (s: Session) => void }) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      setError('Email o contraseña incorrectos');
      setLoading(false);
      return;
    }

    const { data: isSA } = await supabase.from('super_admins').select('user_id').eq('user_id', data.session.user.id).single();
    if (!isSA) {
      await supabase.auth.signOut();
      setError('Esta cuenta no tiene permisos de administrador');
      setLoading(false);
      return;
    }

    toast({ title: 'Acceso concedido', description: 'Bienvenido al panel de administración' });
    onSuccess(data.session);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground mt-1">Sistema de Afiliados · Immoral Group</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Contraseña</Label>
              <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Accediendo...</> : 'Acceder'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard principal
// ---------------------------------------------------------------------------
function AdminDashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<AdminTab>('solicitudes');

  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Super Admin · Immoral Group</p>
            <h1 className="text-lg font-semibold text-foreground">Panel de Afiliados</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" />Salir
          </Button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px">
            {([
              { key: 'solicitudes', label: 'Solicitudes', icon: FileText },
              { key: 'partners',    label: 'Partners',    icon: Users },
              { key: 'comisiones',  label: 'Comisiones',  icon: Euro },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {tab === 'solicitudes' && <SolicitudesTab />}
        {tab === 'partners'    && <PartnersTab />}
        {tab === 'comisiones'  && <ComisionesTab />}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: Solicitudes
// ---------------------------------------------------------------------------
function SolicitudesTab() {
  const { toast } = useToast();
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterPartner, setFilterPartner] = useState('todos');
  const [aprobarModal, setAprobarModal] = useState<{ solicitud: SolicitudAdmin } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: sols }, { data: parts }] = await Promise.all([
      supabase.from('solicitudes').select('*, partner:partners(id, nombre, slug)').order('created_at', { ascending: false }),
      supabase.from('partners').select('*').order('nombre'),
    ]);
    setSolicitudes((sols as SolicitudAdmin[]) ?? []);
    setPartners(parts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateEstado = async (sol: SolicitudAdmin, nuevoEstado: string) => {
    if (nuevoEstado === 'aprobada') {
      setAprobarModal({ solicitud: sol });
      return;
    }
    await supabase.from('solicitudes').update({ estado: nuevoEstado }).eq('id', sol.id);
    toast({ title: 'Estado actualizado' });
    load();
  };

  const handleAprobar = async (solicitudId: string, partnerId: string | null, importe: number) => {
    await supabase.from('solicitudes').update({ estado: 'aprobada', importe_cobrado: importe }).eq('id', solicitudId);

    if (partnerId) {
      const { data: existing } = await supabase.from('comisiones').select('id').eq('solicitud_id', solicitudId).single();
      if (!existing) {
        const importeComision = importe * 0.15;
        await supabase.from('comisiones').insert({
          solicitud_id: solicitudId,
          partner_id: partnerId,
          importe_base: importe,
          importe_comision: importeComision,
          estado: importeComision >= 100 ? 'confirmada' : 'pendiente',
        });
      }
    }

    toast({ title: 'Solicitud aprobada', description: partnerId ? 'Comisión generada automáticamente' : 'Sin partner asignado — no se genera comisión' });
    setAprobarModal(null);
    load();
  };

  const overridePartner = async (solicitudId: string, newPartnerId: string | null) => {
    await supabase.from('solicitudes').update({ partner_id: newPartnerId, override_manual: true }).eq('id', solicitudId);
    toast({ title: 'Atribución actualizada' });
    load();
  };

  const filtered = solicitudes.filter((s) => {
    if (filterEstado !== 'todos' && s.estado !== filterEstado) return false;
    if (filterPartner === 'sin_partner' && s.partner_id !== null) return false;
    if (filterPartner !== 'todos' && filterPartner !== 'sin_partner' && s.partner_id !== filterPartner) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ESTADOS_SOLICITUD_OPTIONS.map((e) => (
              <SelectItem key={e} value={e}>{ESTADO_SOLICITUD[e]?.label ?? e}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPartner} onValueChange={setFilterPartner}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Partner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los partners</SelectItem>
            <SelectItem value="sin_partner">Sin partner (orgánica)</SelectItem>
            {partners.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="flex items-center text-sm text-muted-foreground ml-auto">
          {filtered.length} solicitud{filtered.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Tabla */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No hay solicitudes con estos filtros</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Ref.</th>
                  <th className="px-4 py-3 text-left">Lead</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Partner</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Cobrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((sol) => {
                  const fd = sol.datos_formulario as any;
                  const estadoConf = ESTADO_SOLICITUD[sol.estado] ?? ESTADO_SOLICITUD.pendiente;
                  return (
                    <tr key={sol.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{sol.id.slice(0, 8).toUpperCase()}
                        {sol.override_manual && (
                          <span className="ml-1 text-[10px] text-amber-400 border border-amber-400/30 rounded px-1">manual</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{fd?.nombre ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{fd?.empresa ?? ''}</p>
                        <p className="text-xs text-muted-foreground">{fd?.email ?? ''}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(sol.created_at)}</td>
                      <td className="px-4 py-3">
                        <PartnerOverrideSelect
                          currentPartnerId={sol.partner_id}
                          partners={partners}
                          onChange={(id) => overridePartner(sol.id, id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Select value={sol.estado} onValueChange={(v) => updateEstado(sol, v)}>
                          <SelectTrigger className={`w-36 h-7 text-xs border ${estadoConf.className} bg-transparent`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ESTADOS_SOLICITUD_OPTIONS.map((e) => (
                              <SelectItem key={e} value={e} className="text-xs">{ESTADO_SOLICITUD[e]?.label ?? e}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {sol.importe_cobrado != null ? (
                          <span className="font-medium text-emerald-400">{formatEur(sol.importe_cobrado)}</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Aprobar */}
      {aprobarModal && (
        <AprobarModal
          solicitud={aprobarModal.solicitud}
          onConfirm={(importe) => handleAprobar(aprobarModal.solicitud.id, aprobarModal.solicitud.partner_id, importe)}
          onCancel={() => setAprobarModal(null)}
        />
      )}
    </div>
  );
}

function PartnerOverrideSelect({
  currentPartnerId, partners, onChange,
}: {
  currentPartnerId: string | null;
  partners: Partner[];
  onChange: (id: string | null) => void;
}) {
  const current = partners.find((p) => p.id === currentPartnerId);
  return (
    <Select value={currentPartnerId ?? 'none'} onValueChange={(v) => onChange(v === 'none' ? null : v)}>
      <SelectTrigger className="w-36 h-7 text-xs">
        <SelectValue placeholder="Sin partner">
          {current ? current.nombre : <span className="text-muted-foreground">Orgánica</span>}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sin partner (orgánica)</SelectItem>
        {partners.map((p) => (
          <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AprobarModal({
  solicitud, onConfirm, onCancel,
}: {
  solicitud: SolicitudAdmin;
  onConfirm: (importe: number) => void;
  onCancel: () => void;
}) {
  const [importe, setImporte] = useState(solicitud.importe_cobrado?.toString() ?? '');

  const handleConfirm = () => {
    const n = parseFloat(importe.replace(',', '.'));
    if (isNaN(n) || n <= 0) return;
    onConfirm(n);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Aprobar solicitud</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Introduce el importe cobrado al cliente. Se calculará automáticamente la comisión (15%).
          </p>
          <div className="space-y-2">
            <Label>Importe cobrado (€)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={importe}
              onChange={(e) => setImporte(e.target.value)}
              autoFocus
            />
          </div>
          {importe && !isNaN(parseFloat(importe)) && (
            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Importe cobrado</span>
                <span className="font-medium">{formatEur(parseFloat(importe))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comisión partner (15%)</span>
                <span className="font-medium text-emerald-400">{formatEur(parseFloat(importe) * 0.15)}</span>
              </div>
              {solicitud.partner_id === null && (
                <p className="text-xs text-amber-400 pt-1">Sin partner asignado — no se genera comisión</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!importe || isNaN(parseFloat(importe)) || parseFloat(importe) <= 0}>
            Aprobar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// TAB: Partners
// ---------------------------------------------------------------------------
function PartnersTab() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [clicksByPartner, setClicksByPartner] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: parts }, { data: clicks }] = await Promise.all([
      supabase.from('partners').select('*').order('created_at', { ascending: false }),
      supabase.from('referral_clicks').select('partner_id'),
    ]);
    setPartners(parts ?? []);
    const counts: Record<string, number> = {};
    (clicks ?? []).forEach((c) => { counts[c.partner_id] = (counts[c.partner_id] ?? 0) + 1; });
    setClicksByPartner(counts);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActivo = async (partner: Partner) => {
    await supabase.from('partners').update({ activo: !partner.activo }).eq('id', partner.id);
    toast({ title: partner.activo ? 'Partner desactivado' : 'Partner activado' });
    load();
  };

  const deletePartner = async (partner: Partner) => {
    if (!window.confirm(`¿Eliminar a ${partner.nombre}? Esta acción no se puede deshacer.`)) return;
    await supabase.from('partners').delete().eq('id', partner.id);
    toast({ title: 'Partner eliminado' });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">{partners.length} partner{partners.length !== 1 ? 's' : ''}</h2>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />Nuevo partner
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : partners.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No hay partners aún</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Enlace</th>
                  <th className="px-4 py-3 text-right">Visitas</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{p.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      procesos.immoralia.es/?ref={p.slug}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {(clicksByPartner[p.id] ?? 0).toLocaleString('es-ES')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        p.activo
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                      }`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleActivo(p)}>
                            {p.activo
                              ? <><ToggleRight className="h-4 w-4 mr-2 text-emerald-400" />Desactivar</>
                              : <><ToggleLeft className="h-4 w-4 mr-2" />Activar</>}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deletePartner(p)} className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreatePartnerModal
          onCreated={() => { setShowCreate(false); load(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}

function CreatePartnerModal({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ nombre: '', email: '', slug: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Genera el slug automáticamente al escribir el nombre (nombre-apellido)
  const handleNombreChange = (value: string) => {
    const autoSlug = value.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)       // máximo nombre + primer apellido
      .join('-');
    setForm((f) => ({ ...f, nombre: value, slug: autoSlug }));
    setSlugError('');
  };

  // Valida que el slug no esté en uso al salir del campo
  const handleSlugBlur = async () => {
    const slug = form.slug.trim();
    if (!slug) return;
    setCheckingSlug(true);
    const { data } = await supabase.rpc('get_partner_id_by_slug', { p_slug: slug });
    setCheckingSlug(false);
    if (data) setSlugError(`El slug "${slug}" ya está en uso. Elige otro.`);
    else setSlugError('');
  };

  const referralUrl = form.slug ? `https://procesos.immoralia.es/?ref=${form.slug}` : '';

  const handleCopyUrl = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.functions.invoke('create-partner', {
      body: {
        nombre: form.nombre.trim(),
        email: form.email.trim().toLowerCase(),
        slug: form.slug.trim().toLowerCase(),
      },
    });

    if (error || data?.error) {
      setError(data?.error ?? error?.message ?? 'Error desconocido');
      setLoading(false);
      return;
    }

    toast({ title: 'Invitación enviada', description: `${form.nombre} recibirá un email para establecer su contraseña` });
    onCreated();
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo partner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Nombre</Label>
              <Input placeholder="Maggie García" value={form.nombre} onChange={(e) => handleNombreChange(e.target.value)} required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Email</Label>
              <Input type="email" placeholder="maggie@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Slug (URL) — editable</Label>
              <Input
                placeholder="maggie"
                value={form.slug}
                onChange={(e) => { setForm({ ...form, slug: e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase() }); setSlugError(''); }}
                onBlur={handleSlugBlur}
                required
                className={slugError ? 'border-destructive' : ''}
              />
              {checkingSlug && <p className="text-xs text-muted-foreground">Comprobando disponibilidad...</p>}
              {slugError && <p className="text-xs text-destructive">{slugError}</p>}
              {form.slug && !slugError && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex-1 font-mono text-xs text-primary bg-primary/10 border border-primary/20 rounded px-2 py-1 truncate">
                    {referralUrl}
                  </span>
                  <Button type="button" variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={handleCopyUrl}>
                    {copiedUrl ? <><Check className="h-3 w-3 mr-1" />Copiado</> : <><Copy className="h-3 w-3 mr-1" />Copiar</>}
                  </Button>
                </div>
              )}
            </div>
            <p className="col-span-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
              Se enviará un email de invitación al partner para que establezca su propia contraseña.
            </p>
          </div>
          {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={loading || !!slugError || checkingSlug}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</> : 'Crear partner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// TAB: Comisiones
// ---------------------------------------------------------------------------
function ComisionesTab() {
  const { toast } = useToast();
  const [comisiones, setComisiones] = useState<ComisionAdmin[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: coms }, { data: parts }] = await Promise.all([
      supabase.from('comisiones').select('*, partner:partners(nombre, slug)').order('created_at', { ascending: false }),
      supabase.from('partners').select('*').order('nombre'),
    ]);
    setComisiones((coms as ComisionAdmin[]) ?? []);
    setPartners(parts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const marcarPagada = async (comisionId: string) => {
    await supabase.from('comisiones').update({ estado: 'pagada', pagada_at: new Date().toISOString() }).eq('id', comisionId);
    toast({ title: 'Comisión marcada como pagada' });
    load();
  };

  // Totales por partner
  const totalesPorPartner = partners.map((p) => {
    const coms = comisiones.filter((c) => c.partner_id === p.id);
    const generada = coms.reduce((s, c) => s + c.importe_comision, 0);
    const pagada = coms.filter((c) => c.estado === 'pagada').reduce((s, c) => s + c.importe_comision, 0);
    const pendiente = generada - pagada;
    return { partner: p, generada, pagada, pendiente, total: coms.length };
  }).filter((r) => r.total > 0).sort((a, b) => b.generada - a.generada);

  return (
    <div className="space-y-8">
      {/* Resumen por partner */}
      {totalesPorPartner.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Resumen por partner</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {totalesPorPartner.map(({ partner, generada, pagada, pendiente }, i) => (
              <div key={partner.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  {i === 0 && <Trophy className="h-4 w-4 text-amber-400" />}
                  <span className="font-medium text-foreground">{partner.nombre}</span>
                  <span className="text-xs text-muted-foreground font-mono ml-auto">?ref={partner.slug}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generada</span>
                    <span className="font-medium text-foreground">{formatEur(generada)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagada</span>
                    <span className="text-purple-400">{formatEur(pagada)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 mt-1">
                    <span className="text-muted-foreground">Pendiente</span>
                    <span className="font-semibold text-amber-400">{formatEur(pendiente)}</span>
                  </div>
                  {pendiente > 0 && pendiente < 100 && (
                    <p className="text-xs text-muted-foreground pt-1">Falta {formatEur(100 - pendiente)} para el mínimo de pago</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tabla de comisiones */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3">Todas las comisiones</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : comisiones.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">No hay comisiones aún</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Partner</th>
                    <th className="px-4 py-3 text-left">Solicitud</th>
                    <th className="px-4 py-3 text-right">Base</th>
                    <th className="px-4 py-3 text-right">Comisión (15%)</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Fecha pago</th>
                    <th className="px-4 py-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comisiones.map((c) => {
                    const conf = ESTADO_COMISION[c.estado] ?? ESTADO_COMISION.pendiente;
                    return (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{c.partner?.nombre ?? '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          #{c.solicitud_id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{formatEur(c.importe_base)}</td>
                        <td className="px-4 py-3 text-right font-medium text-emerald-400">{formatEur(c.importe_comision)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${conf.className}`}>
                            {conf.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {c.pagada_at ? formatDate(c.pagada_at) : '—'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {c.estado !== 'pagada' && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => marcarPagada(c.id)}>
                              <Check className="h-3 w-3 mr-1" />Marcar pagada
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers UI
// ---------------------------------------------------------------------------
function FullPageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
