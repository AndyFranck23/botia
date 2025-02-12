import Layout from "@/components/admin/Layout";
import ModifierClassement from "@/components/admin/ModifierClassement";

export default async function page({ params }) {
    const { id } = await params
    return (
        <Layout>
            <ModifierClassement id={id} userdata={{ identite: 'test' }} />
        </Layout>
    )
}
