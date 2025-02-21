import AddArticle from "@/components/admin/AddArticle";
import Layout from "@/components/admin/Layout";

export default function page() {
    return (
        <Layout>
            <AddArticle TINY_KEY={process.env.TINY_KEY} page={'blog'} />
        </Layout>
    )
}
