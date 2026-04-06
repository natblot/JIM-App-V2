import type { Metadata } from 'next';

const BASE_URL = 'https://jim.app';

// Helper metadata dynamique pour les pages annonces
export function buildAnnonceMetadata(annonce: {
  ville: string | null;
  retrocession: number | null;
  date_debut: string;
  date_fin: string;
  description: string | null;
}): Metadata {
  const ville = annonce.ville ?? 'France';
  const retro = annonce.retrocession ?? 80;
  const title = `Remplacement kine ${ville} — ${retro}%`;
  const description =
    annonce.description?.slice(0, 155) ??
    `Remplacement kinesitherapeute a ${ville} du ${annonce.date_debut} au ${annonce.date_fin}. Retrocession ${retro}%.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: BASE_URL,
    },
  };
}

// Schema.org JobPosting pour les annonces
export function buildJobPostingSchema(annonce: {
  id: string;
  ville: string | null;
  description: string | null;
  date_debut: string;
  date_fin: string;
  retrocession: number | null;
}) {
  const dateDebut = new Date(annonce.date_debut).toISOString();
  const dateFin = new Date(annonce.date_fin).toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: `Remplacement kinesitherapeute ${annonce.ville ?? ''}`,
    description: annonce.description ?? `Remplacement du ${annonce.date_debut} au ${annonce.date_fin}`,
    datePosted: dateDebut,
    validThrough: dateFin,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: annonce.ville,
        addressCountry: 'FR',
      },
    },
    employmentType: 'TEMPORARY',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'JIM — Job In Med',
      url: BASE_URL,
    },
  };
}
