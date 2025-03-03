import AddArticle from "@/components/admin/AddArticle";
import ListeArticle from "@/components/admin/ListeArticle";

export default function page() {
    return (
        <>
            <AddArticle TINY_KEY={process.env.TINY_KEY} page={'blog'} />
            <div className="mt-20">
                <ListeArticle />
            </div>
        </>
    )
}
