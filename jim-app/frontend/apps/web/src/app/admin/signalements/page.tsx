// Page signalements admin — Epic 12, Story 12.3
'use client';

import { useEffect, useState } from 'react';

interface Signalement {
  id: string;
  contenu_type: string;
  contenu_id: string;
  categorie: string;
  description: string | null;
  status: string;
  action_prise: string | null;
  created_at: string;
}

export default function SignalementsPage() {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [filter, setFilter] = useState('en_attente');

  useEffect(() => {
    const fetchSignalements = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/signalements?status=eq.${filter}&order=created_at.desc&limit=50`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sb-access-token') ?? ''}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          },
        });
        const data = await res.json();
        setSignalements(Array.isArray(data) ? data : []);
      } catch { /* ignore */ }
    };
    void fetchSignalements();
  }, [filter]);

  const handleModerate = async (signalementId: string, action: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/moderate-content`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sb-access-token') ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signalement_id: signalementId, action }),
      });
      setSignalements(prev => prev.filter(s => s.id !== signalementId));
    } catch { /* ignore */ }
  };

  const statusColors: Record<string, string> = {
    en_attente: 'bg-orange-100 text-orange-700',
    traite: 'bg-green-100 text-green-700',
    rejete: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Signalements</h1>

      <div className="flex gap-2 mb-6">
        {['en_attente', 'traite', 'rejete'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {signalements.length === 0 ? (
        <p className="text-gray-500">Aucun signalement {filter.replace('_', ' ')}</p>
      ) : (
        <div className="space-y-3">
          {signalements.map(s => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[s.status] ?? ''}`}>{s.status}</span>
                  <span className="text-xs text-gray-400 ml-2">{s.categorie}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <p className="text-sm text-gray-700 mb-1">{s.contenu_type} : {s.contenu_id.slice(0, 8)}...</p>
              {s.description && <p className="text-sm text-gray-500 mb-3">{s.description}</p>}

              {s.status === 'en_attente' && (
                <div className="flex gap-2">
                  <button onClick={() => handleModerate(s.id, 'suspend')} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Suspendre</button>
                  <button onClick={() => handleModerate(s.id, 'hide_content')} className="px-3 py-1.5 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600">Masquer</button>
                  <button onClick={() => handleModerate(s.id, 'dismiss')} className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300">Rejeter</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
