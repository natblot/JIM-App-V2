// PWA Manifest — Epic 13
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JIM — Job In Med',
    short_name: 'JIM',
    description: 'Le remplacement kine, enfin simple.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FEF9F5',
    theme_color: '#E8844A',
    // Icons PWA a ajouter : deposer icon-192.png et icon-512.png dans public/
    // puis reintegrer les entries ci-dessous.
    icons: [],
  };
}
