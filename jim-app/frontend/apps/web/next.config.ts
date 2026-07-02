import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Contourne le bug Next.js 16.2 avec les espaces dans le chemin du projet (local
  // uniquement : "JIM App V2" contient un espace). Sur Vercel le chemin de checkout
  // n'a pas d'espace ; on garde le `.next` par defaut, sinon un distDir absolu casse
  // la detection de la sortie du build par Vercel.
  ...(process.env.VERCEL ? {} : { distDir: '/tmp/jim-next' }),
  transpilePackages: ['@jim/shared', '@jim/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xfgktshirllqesnwmwpm.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
        pathname: '/styles/v1/**',
      },
    ],
  },
};

export default nextConfig;
