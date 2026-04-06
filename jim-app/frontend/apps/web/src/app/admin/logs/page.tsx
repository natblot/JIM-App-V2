// Page audit logs admin — Epic 12, Story 12.5
'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  created_at: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/audit_logs?order=created_at.desc&limit=50&offset=${page * 50}`;
        if (actionFilter) url += `&action=like.*${actionFilter}*`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sb-access-token') ?? ''}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          },
        });
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch { /* ignore */ }
    };
    void fetchLogs();
  }, [actionFilter, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Logs</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text" placeholder="Filtrer par action..." value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-64"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Ressource</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                <td className="px-4 py-3 font-mono text-gray-700">{log.action}</td>
                <td className="px-4 py-3 text-gray-500">{log.resource_type ?? '-'}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.user_id?.slice(0, 8) ?? '-'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{log.ip_address ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg disabled:opacity-50">Precedent</button>
        <span className="text-sm text-gray-500">Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 50}
          className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg disabled:opacity-50">Suivant</button>
      </div>
    </div>
  );
}
