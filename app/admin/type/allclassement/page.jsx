import Layout from "@/components/admin/Layout";
import ListeClassement from "@/components/admin/ListeClassement";

export default async function page() {
    return (
        <Layout>
            <ListeClassement />
        </Layout>
    )
}
