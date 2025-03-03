import { slugify } from "@/components/Slug";

export default async function sitemap() {
    try {
        // Récupération des données depuis l'API via Promise.all
        const [offresRes, classementsRes, produitsRes, articlesRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres`),
            fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`),
            fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`),
            fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        ]);

        // Vérification que toutes les réponses sont correctes
        if (!offresRes.ok || !classementsRes.ok || !produitsRes.ok || !articlesRes.ok) {
            throw new Error("Erreur lors de la récupération des données API");
        }

        // Traitement des réponses JSON
        const [{ offres }, classements, produits, articles] = await Promise.all([
            offresRes.json(),
            classementsRes.json(),
            produitsRes.json(),
            articlesRes.json(),
        ]);

        // Définition des pages statiques de votre site
        const staticPages = [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
                lastModified: new Date().toISOString(),
                changeFrequency: "daily",
                priority: 1.0,
            },
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/page`,
                lastModified: new Date().toISOString(),
                changeFrequency: "daily",
                priority: 0.8,
            },
        ];

        // Génération des entrées pour les pages dynamiques
        const dynamicPagesProduits = produits?.map((item) => ({
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slugify(item.title)}`,
            changeFrequency: "daily",
            priority: 0.7,
        })) || [];

        const dynamicPagesClassement = classements?.map((item) => ({
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/class/${slugify(item.type)}/${slugify(item.title)}`,
            changeFrequency: "daily",
            priority: 0.6,
        })) || [];

        const dynamicPagesOffres = offres?.map((item) => ({
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slugify(item.id_produit)}/${item.slug}`,
            changeFrequency: "daily",
            priority: 0.5,
        })) || [];

        const dynamicPagesBlog = articles?.map((item) => ({
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slugify(item.title)}`,
            changeFrequency: "daily",
            priority: 0.4,
        })) || [];

        // Retourne la liste complète des URL
        return [
            ...staticPages,
            ...dynamicPagesProduits,
            ...dynamicPagesClassement,
            ...dynamicPagesOffres,
            ...dynamicPagesBlog,
        ];
    } catch (error) {
        console.error("Fetch failed for posts in sitemap:", error);
        // Retourner un tableau vide pour éviter de bloquer le build
        return [];
    }
}
