import Layout from "@/components/admin/Layout";
import ListeOffre from "@/components/admin/ListeOffre";

export default async function page({ params }) {
    const { produit } = await params
    return (
        <Layout>
            <ListeOffre produit={produit} />
        </Layout>
    )
}
