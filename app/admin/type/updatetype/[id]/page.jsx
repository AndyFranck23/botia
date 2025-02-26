import Layout from "@/components/admin/Layout";
import ModifierType from "@/components/admin/ModifierType";

export default async function page({ params }) {
    const { id } = await params
    return (
        <Layout>
            <ModifierType id={id} />
        </Layout>
    )
}
