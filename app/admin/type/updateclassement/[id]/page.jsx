import Layout from "@/components/admin/Layout";
import ModifierClassement from "@/components/admin/ModifierClassement";

export default async function page({ params }) {
    return (
        <Layout>
            <ModifierClassement id={params.id} userdata={{ identite: 'test' }} />
        </Layout>
    )
}
