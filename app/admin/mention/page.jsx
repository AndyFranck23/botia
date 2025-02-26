import AddArticle from "@/components/admin/AddArticle";
import Layout from "@/components/admin/Layout";

export default async function page() {
    try {
        const mentionRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`);
        const data = await mentionRes.json()
        return (
            <Layout>
                <AddArticle TINY_KEY={process.env.TINY_KEY} data={data[0]} page={'mention'} />
            </Layout>
        )
    } catch (err) {
        console.error("Erreur lors de la récupération des mentions:", err);
        return [];
    }
}
