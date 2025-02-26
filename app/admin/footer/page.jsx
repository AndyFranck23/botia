import Layout from "@/components/admin/Layout";
import ModifierFooter from "@/components/admin/ModifierFooter";

export default function page() {
    // try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/admin/footer`)
    //     const data = await response.json()

    return (
        <Layout>
            <ModifierFooter />
        </Layout>
    )
    // } catch (error) {
    //     console.error("Erreur lors de la récupération des mentions:", error);
    // }
}
