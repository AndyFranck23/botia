import Layout from "@/components/admin/Layout";
import ModifierOffre from "@/components/admin/ModifierOffre";

export default async function page({ params }) {
    const { id } = await params
    const [typesRes, classementsRes, produitsRes, offreRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres/${id}`)
    ])

    const [types, classes, produits, offre] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), offreRes.json()])

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    return (
        <Layout>
            <ModifierOffre offre={offre[0]} id={id} classements={classements} TINY_KEY={process.env.TINY_KEY} produit={produits} />
        </Layout>
    )
}
