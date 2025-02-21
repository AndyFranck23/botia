import AddClassement from "@/components/admin/AddClassement";
import { useUser } from "@/components/admin/context/UserContext";
import Layout from "@/components/admin/Layout";

export default function page() {
    return (
        <Layout>
            <AddClassement />
        </Layout>
    )
}
