// Sitemap dynamique — pages statiques + annonces natives actives depuis Supabase
import { fetchAnnonceIdsForSitemap } from '../lib/supabase-server';

export const revalidate = 3600; // Revalider toutes les heures

export default async function sitemap() {
  // Pages statiques
  const staticPages = [
    { url: 'https://jim.app', lastModified: new Date(), priority: 1.0 },
    { url: 'https://jim.app/fonctionnalites', lastModified: new Date(), priority: 0.9 },
    { url: 'https://jim.app/tarifs', lastModified: new Date(), priority: 0.8 },
    { url: 'https://jim.app/a-propos', lastModified: new Date(), priority: 0.7 },
  ];

  // Pages dynamiques — annonces actives
  let annoncePages: { url: string; lastModified: Date; priority: number }[] = [];
  try {
    const annonces = await fetchAnnonceIdsForSitemap();
    annoncePages = annonces.map((a) => ({
      url: `https://jim.app/annonce/${a.id}`,
      lastModified: new Date(a.updated_at),
      priority: 0.6,
    }));
  } catch {
    // Silencieux en cas d'erreur Supabase — on garde les pages statiques
  }

  return [...staticPages, ...annoncePages];
}
