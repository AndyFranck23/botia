import Layout from "@/components/admin/Layout";
import ModifierType from "@/components/admin/ModifierType";

export default async function page({ params }) {
    return (
        <Layout>
            <ModifierType id={params.id} />
        </Layout>
    )
}
