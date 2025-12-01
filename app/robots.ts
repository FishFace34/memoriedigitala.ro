import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://memoriedigitala.ro';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/account/',
          '/orders/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

