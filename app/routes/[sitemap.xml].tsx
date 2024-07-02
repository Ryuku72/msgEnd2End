import { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  // These two functions get a list of all the posts and projects, using prisma
  // I will write more blog posts on prisma in the future and explain how it's used

  const content = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
      <loc>https://messagenovel.vercel.app/</loc>
      <lastmod>2024-05-27T13:34:37.0000</lastmod>
      </url>
      <loc>https://messagenovel.vercel.app/about</loc>
      <lastmod>2024-05-27T13:34:37.0000</lastmod>
      </url>
      <url>
      <loc>https://messagenovel.vercel.app/create</loc>
      <lastmod>2024-05-27T13:34:37.0000</lastmod>
      </url>
      <url>
      <url>
      <loc>https://messagenovel.vercel.app/login</loc>
      <lastmod>2024-05-27T13:34:37.0000</lastmod>
      </url>
      <url>
      </urlset>
      `;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8'
    }
  });
};
