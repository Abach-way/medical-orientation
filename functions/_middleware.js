export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.pathname === '/sitemap.xml') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://medical-orientation.pages.dev/</loc>
        <lastmod>2026-02-12</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  if (url.pathname === '/robots.txt') {
    const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /node_modules/

Sitemap: https://medical-orientation.pages.dev/sitemap.xml

User-agent: Yandex
Allow: /
Host: https://medical-orientation.pages.dev
`;
    return new Response(robots, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  return context.next();
}
