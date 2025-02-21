export const dynamic = 'force-static'; // Force la génération statique

export async function GET() {
    return new Response(`
    User-agent: *
    ${process.env.ENV === 'production' ? 'Allow: /' : 'Disallow: /'}
    Disallow: /admin/*
    Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml
  `, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}