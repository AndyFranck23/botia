import AddOffre from "@/components/admin/AddOffre";
import Layout from "@/components/admin/Layout";

export default async function Page() {
    const [typesRes, classementsRes, produitsRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`)
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
        </Layout>
    );
}
