import ListeOffre from "@/components/admin/ListeOffre";

export default async function page({ params, searchParams }) {
    const { page } = await searchParams
    try {
        const pageNumber = page ? parseInt(page) : 1; // Récupérer le numéro de page depuis l'URL

        const { produit } = await params
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?produit=${produit}&page=${pageNumber}`)
        const { offres, total } = await response.json()
        return (
            <>
                <ListeOffre data={offres} total={total} />
            </>
        )
    } catch (err) {
        console.log(err)
    }
}
