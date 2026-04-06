// robots.txt — Epic 13
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin/' },
    ],
    sitemap: 'https://jim.app/sitemap.xml',
  };
}
