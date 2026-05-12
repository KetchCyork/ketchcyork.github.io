import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://cyork.dev';

  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const postUrls = posts.map((p) => ({
    url: `${site}/blog/${p.slug}/`,
    lastmod: (p.data.updatedDate ?? p.data.pubDate).toISOString().split('T')[0],
  }));

  const staticPages = [
    { url: `${site}/`, lastmod: new Date().toISOString().split('T')[0] },
    { url: `${site}/about/`, lastmod: new Date().toISOString().split('T')[0] },
    { url: `${site}/blog/`, lastmod: new Date().toISOString().split('T')[0] },
    { url: `${site}/contact/`, lastmod: new Date().toISOString().split('T')[0] },
  ];

  const allPages = [...staticPages, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((p) => `  <url>\n    <loc>${p.url}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
