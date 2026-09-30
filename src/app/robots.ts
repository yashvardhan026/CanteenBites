import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://canteenbites.sviet.ac.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/how-it-works',
          '/canteens',
          '/menu',
          '/offers',
          '/contact',
          '/bites-ai',
          '/login',
          '/register',
        ],
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
