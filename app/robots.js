export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Pour bloquer certains dossiers, par exemple :
            disallow: ['/admin/', '/image-browser/', '/login/', '/signup/']
        },
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
    }
}
