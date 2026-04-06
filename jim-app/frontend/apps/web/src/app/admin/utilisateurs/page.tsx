// Page gestion utilisateurs admin — Phase 4 "Admin avance"
// Liste des profils avec recherche, filtre par role, pagination
'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../../../components/providers/auth-provider';

type RoleFilter = 'tous' | 'remplacant' | 'titulaire' | 'admin';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  rpps_verified: boolean;
  is_blocked: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 50;

const ROLE_LABELS: Record<string, string> = {
  remplacant: 'Remplacant',
  titulaire: 'Titulaire',
  admin: 'Admin',
};

const ROLE_COLORS: Record<string, string> = {
  remplacant: 'bg-blue-100 text-blue-700',
  titulaire: 'bg-purple-100 text-purple-700',
  admin: 'bg-[var(--jim-primary-light)] text-[var(--jim-primary)]',
};

export default function UtilisateursPage() {
  const { supabase } = useAuthContext();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('tous');

  const offset = page * ITEMS_PER_PAGE;

  // Requete profils
  const profiles = useQuery({
    queryKey: ['admin-users', page, roleFilter, search],
    queryFn: async () => {
      let q = supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, rpps_verified, is_blocked, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (roleFilter !== 'tous') {
        q = q.eq('role', roleFilter);
      }

      // Recherche par nom ou email cote serveur
      if (search.trim().length > 0) {
        const term = `%${search.trim()}%`;
        q = q.or(`first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as UserProfile[];
    },
  });

  // Calculer si on peut aller a la page suivante
  const hasNext = useMemo(() => {
    return (profiles.data?.length ?? 0) === ITEMS_PER_PAGE;
  }, [profiles.data]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleRoleChange = (role: RoleFilter) => {
    setRoleFilter(role);
    setPage(0);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-jim-text mb-6">Utilisateurs</h1>

      {/* Barre de recherche + filtre role */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border border-jim-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--jim-primary)] focus:border-transparent bg-white"
        />
        <select
          value={roleFilter}
          onChange={e => handleRoleChange(e.target.value as RoleFilter)}
          className="px-4 py-2.5 text-sm border border-jim-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--jim-primary)] focus:border-transparent bg-white text-jim-text"
        >
          <option value="tous">Tous les roles</option>
          <option value="remplacant">Remplacant</option>
          <option value="titulaire">Titulaire</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Erreur */}
      {profiles.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-700">Erreur lors du chargement des utilisateurs.</p>
        </div>
      )}

      {/* Chargement */}
      {profiles.isLoading && (
        <div className="bg-white rounded-2xl border border-jim-border overflow-hidden">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Etat vide */}
      {profiles.data && profiles.data.length === 0 && (
        <p className="text-jim-muted text-center py-12">
          Aucun utilisateur trouve.
        </p>
      )}

      {/* Table desktop */}
      {profiles.data && profiles.data.length > 0 && (
        <>
          {/* Vue desktop : table */}
          <div className="hidden md:block bg-white rounded-2xl border border-jim-border overflow-hidden shadow-[var(--jim-shadow-sm)]">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-jim-border">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-jim-muted uppercase tracking-wide">Utilisateur</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-jim-muted uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-jim-muted uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-jim-muted uppercase tracking-wide">RPPS</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-jim-muted uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-jim-muted uppercase tracking-wide">Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {profiles.data.map(profile => (
                  <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[var(--jim-primary-light)] flex items-center justify-center text-xs font-semibold text-[var(--jim-primary)]">
                          {profile.first_name.charAt(0).toUpperCase()}{profile.last_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-jim-text">
                          {profile.first_name} {profile.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-jim-text-body">{profile.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[profile.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ROLE_LABELS[profile.role] ?? profile.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {profile.rpps_verified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Verifie
                        </span>
                      ) : (
                        <span className="text-xs text-jim-muted">Non verifie</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {profile.is_blocked ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                          Bloque
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                          Actif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-jim-muted text-xs">
                      {new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vue mobile : cartes */}
          <div className="md:hidden space-y-3">
            {profiles.data.map(profile => (
              <div key={profile.id} className="bg-white rounded-2xl border border-jim-border p-4 shadow-[var(--jim-shadow-sm)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--jim-primary-light)] flex items-center justify-center text-sm font-semibold text-[var(--jim-primary)]">
                    {profile.first_name.charAt(0).toUpperCase()}{profile.last_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-jim-text truncate">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-xs text-jim-muted truncate">{profile.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[profile.role] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ROLE_LABELS[profile.role] ?? profile.role}
                  </span>
                  {profile.rpps_verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      RPPS
                    </span>
                  )}
                  {profile.is_blocked && (
                    <span className="text-xs font-medium text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                      Bloque
                    </span>
                  )}
                </div>

                <p className="text-xs text-jim-muted mt-2">
                  Inscrit le {new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium bg-white border border-jim-border rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Precedent
            </button>
            <span className="text-sm text-jim-muted">Page {page + 1}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext}
              className="px-4 py-2 text-sm font-medium bg-white border border-jim-border rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}
