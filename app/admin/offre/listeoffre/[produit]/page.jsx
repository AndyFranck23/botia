import ListeOffre from "@/components/admin/ListeOffre";

export default async function page({ params }) {
    const { produit } = await params
    return (
        <>
            <ListeOffre produit={produit} />
        </>
    )
}
