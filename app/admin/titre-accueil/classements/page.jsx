import Layout from "@/components/admin/Layout";
import TextClassement from "@/components/admin/TextClassement";

export default function page() {
    return (
        <Layout>
            <TextClassement TINY_KEY={process.env.TINY_KEY} />
        </Layout>
    )
}
