import AddType from "@/components/admin/AddType";
import Layout from "@/components/admin/Layout";
import ListeType from "@/components/admin/ListeType";

export default function page() {
    return (
        <Layout>
            <AddType />
            <ListeType />
        </Layout>
    )
}
