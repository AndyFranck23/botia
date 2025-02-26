import AddOffre from "@/components/admin/AddOffre";
import Layout from "@/components/admin/Layout";
import ListeOffre from "@/components/admin/ListeOffre";

export default async function Page() {
    const [typesRes, classementsRes, produitsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`)
    ]);

    const [types, classes, produits] = await Promise.all([
        typesRes.json(),
        classementsRes.json(),
        produitsRes.json()
    ]);

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    return (
        <Layout>
            <AddOffre classements={classements} TINY_KEY={process.env.TINY_KEY} produit={produits} />
            <div className="mt-20">
                <ListeOffre />
            </div>
        </Layout>
    );
}
