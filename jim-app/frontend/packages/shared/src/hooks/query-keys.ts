// Query key factory centralisé — TanStack Query
// Pattern : queryKeys.entity.operation() pour l'invalidation précise

export const queryKeys = {
  // Auth & profil (Epic 1)
  profiles: {
    all: ['profiles'] as const,
    detail: (userId: string) => ['profiles', userId] as const,
    my: () => ['profiles', 'me'] as const,
  },
  // RPPS (Epic 1)
  rpps: {
    verify: (number: string) => ['rpps', 'verify', number] as const,
    search: (params: Record<string, string>) => ['rpps', 'search', params] as const,
  },
  // Annonces (Epic 2)
  annonces: {
    all: ['annonces'] as const,
    lists: () => ['annonces', 'list'] as const,
    list: (filters?: Record<string, unknown>) => ['annonces', 'list', filters] as const,
    mine: () => ['annonces', 'mine'] as const,
    detail: (id: string) => ['annonces', 'detail', id] as const,
    retrocessionMoyenne: (lat: number, lon: number, radius?: number) =>
      ['annonces', 'retrocession-moyenne', lat, lon, radius ?? 30] as const,
  },
  // Recherche géospatiale (Epic 4)
  search: {
    all: ['search'] as const,
    geo: (filters: Record<string, unknown>) => ['search', 'geo', filters] as const,
    bbox: (bbox: Record<string, number>) => ['search', 'bbox', bbox] as const,
  },
  // Annonces similaires (Epic 4)
  similaires: {
    detail: (annonceId: string) => ['similaires', annonceId] as const,
  },
  // Candidatures (Epic 5)
  candidatures: {
    all: ['candidatures'] as const,
    mine: () => ['candidatures', 'mine'] as const,
    byAnnonce: (annonceId: string) => ['candidatures', 'by-annonce', annonceId] as const,
    detail: (id: string) => ['candidatures', 'detail', id] as const,
  },
  // Favoris (Epic 5)
  favoris: {
    all: ['favoris'] as const,
    mine: () => ['favoris', 'mine'] as const,
  },
  // Messagerie (Epic 6)
  conversations: {
    all: () => ['conversations'] as const,
    mine: () => ['conversations', 'mine'] as const,
  },
  messages: {
    all: () => ['messages'] as const,
    byConversation: (id: string) => ['messages', 'conversation', id] as const,
  },
  // Calendrier disponibilités (Epic 7)
  calendrier: {
    all: () => ['calendrier'] as const,
    mine: () => ['calendrier', 'mine'] as const,
  },
  // Notifications (Epic 7)
  notifications: {
    all: () => ['notifications'] as const,
    unread: () => ['notifications', 'unread'] as const,
  },
  // Préférences push — étend profiles (Epic 7)
  profile: {
    all: () => ['profile'] as const,
    preferences: () => ['profile', 'preferences'] as const,
  },
  // Contrats IA (Epic 8)
  contrats: {
    all: () => ['contrats'] as const,
    byCandidature: (candidatureId: string) =>
      ['contrats', 'by-candidature', candidatureId] as const,
    detail: (id: string) => ['contrats', 'detail', id] as const,
  },
  // Paiements (Epic 9)
  paiements: {
    all: () => ['paiements'] as const,
    mine: () => ['paiements', 'mine'] as const,
    detail: (id: string) => ['paiements', 'detail', id] as const,
    byContrat: (contratId: string) => ['paiements', 'by-contrat', contratId] as const,
  },
  // Abonnement Pro (Epic 9)
  subscription: {
    all: () => ['subscription'] as const,
    mine: () => ['subscription', 'mine'] as const,
  },
} as const;
