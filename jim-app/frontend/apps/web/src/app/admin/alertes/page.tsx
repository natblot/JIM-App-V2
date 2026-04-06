// Page alertes admin — Epic 12, Story 12.4
'use client';

import { useEffect, useState } from 'react';

interface AdminAlert {
  id: string;
  type: string;
  source: string;
  priority: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<AdminAlert[]>([]);

  useEffect(() => {
    const fetchAlertes = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/admin_alerts?order=created_at.desc&limit=100`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sb-access-token') ?? ''}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          },
        });
        const data = await res.json();
        setAlertes(Array.isArray(data) ? data : []);
      } catch { /* ignore */ }
    };
    void fetchAlertes();
  }, []);

  const colors: Record<string, string> = {
    P1: 'border-red-300 bg-red-50',
    P2: 'border-orange-300 bg-orange-50',
    P3: 'border-gray-200 bg-gray-50',
  };
  const textColors: Record<string, string> = { P1: 'text-red-700', P2: 'text-orange-700', P3: 'text-gray-600' };
  const badgeColors: Record<string, string> = { P1: 'bg-red-600', P2: 'bg-orange-500', P3: 'bg-gray-400' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Alertes</h1>
      <div className="space-y-3">
        {alertes.map(a => (
          <div key={a.id} className={`border rounded-xl p-4 ${colors[a.priority] ?? colors.P3}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className={`text-xs text-white px-2 py-0.5 rounded-full ${badgeColors[a.priority]}`}>{a.priority}</span>
                <span className={`font-medium text-sm ${textColors[a.priority]}`}>{a.message}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">{new Date(a.created_at).toLocaleString('fr-FR')}</span>
                <span className="text-xs text-gray-400">{a.status}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{a.source} &middot; {a.type}</p>
          </div>
        ))}
        {alertes.length === 0 && <p className="text-gray-500">Aucune alerte</p>}
      </div>
    </div>
  );
}
