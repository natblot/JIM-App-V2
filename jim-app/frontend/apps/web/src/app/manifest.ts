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
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
