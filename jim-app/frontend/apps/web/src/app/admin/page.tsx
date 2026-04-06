// Dashboard admin — Epic 12, Story 12.1
// Metriques temps reel + alertes + signalements
'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  annonces: { total: number; actives: number; natives: number; agregees: number; pourvues: number; hidden: number };
  inscriptions: { total: number; rpps_verifies: number; suspendus: number; titulaires: number; remplacants: number };
  candidatures: { last_24h: number; last_7j: number; acceptees_24h: number; taux_conversion_7j: number };
  messages: { last_24h: number };
  signalements_en_attente: number;
  alertes_actives: Array<{ id: string; type: string; priority: string; message: string; source: string; created_at: string }>;
}

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function AlertRow({ alert }: { alert: Metrics['alertes_actives'][0] }) {
  const colors = { P1: 'bg-red-50 border-red-200 text-red-700', P2: 'bg-orange-50 border-orange-200 text-orange-700', P3: 'bg-gray-50 border-gray-200 text-gray-600' };
  const c = colors[alert.priority as keyof typeof colors] ?? colors.P3;
  const ago = Math.round((Date.now() - new Date(alert.created_at).getTime()) / 60000);

  return (
    <div className={`border rounded-lg p-3 ${c}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{alert.message}</span>
        <span className="text-xs opacity-70">il y a {ago}m</span>
      </div>
      <span className="text-xs opacity-60">{alert.source}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      // En production, utiliser le client Supabase avec le token admin
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-dashboard-data`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('sb-access-token') ?? ''}`, 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json.data) setMetrics(json.data);
      else setError(json.error?.message ?? 'Erreur');
    } catch { setError('Connexion impossible'); }
  };

  useEffect(() => { void fetchMetrics(); const i = setInterval(fetchMetrics, 60000); return () => clearInterval(i); }, []);

  if (error) return <div className="p-8 text-red-600">Erreur : {error}</div>;
  if (!metrics) return <div className="p-8 text-gray-500">Chargement...</div>;

  const p1Alerts = metrics.alertes_actives.filter(a => a.priority === 'P1');
  const p2Alerts = metrics.alertes_actives.filter(a => a.priority === 'P2');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Annonces actives" value={metrics.annonces.actives} sub={`${metrics.annonces.natives} natives, ${metrics.annonces.agregees} agregees`} />
        <KpiCard label="Inscrits RPPS" value={metrics.inscriptions.rpps_verifies} sub={`${metrics.inscriptions.total} total, ${metrics.inscriptions.suspendus} suspendus`} />
        <KpiCard label="Candidatures (24h)" value={metrics.candidatures.last_24h} sub={`${metrics.candidatures.acceptees_24h} acceptees`} />
        <KpiCard label="Taux conversion (7j)" value={`${metrics.candidatures.taux_conversion_7j}%`} sub={`${metrics.candidatures.last_7j} candidatures`} />
      </div>

      {/* Alertes P1 */}
      {p1Alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-3">Alertes P1 ({p1Alerts.length})</h2>
          <div className="space-y-2">{p1Alerts.map(a => <AlertRow key={a.id} alert={a} />)}</div>
        </div>
      )}

      {/* Alertes P2 */}
      {p2Alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-orange-700 mb-3">Alertes P2 ({p2Alerts.length})</h2>
          <div className="space-y-2">{p2Alerts.map(a => <AlertRow key={a.id} alert={a} />)}</div>
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Signalements en attente" value={metrics.signalements_en_attente} />
        <KpiCard label="Messages (24h)" value={metrics.messages.last_24h} />
        <KpiCard label="Annonces masquees" value={metrics.annonces.hidden} />
      </div>
    </div>
  );
}
