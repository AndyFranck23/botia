import Layout from "@/components/admin/Layout";
import ModifierOffre from "@/components/admin/ModifierOffre";

export default async function page({ params }) {
    const { id } = await params
    return (
        <Layout>
            <ModifierOffre id={id} />
        </Layout>
    )
}
