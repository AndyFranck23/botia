import AddClassement from "@/components/admin/AddClassement";
import Layout from "@/components/admin/Layout";

export default function page() {
    return (
        <Layout>
            <AddClassement userdata={{ identite: 'andy' }} />
        </Layout>
    )
}
