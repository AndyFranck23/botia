import ListeOffre from "@/components/admin/ListeOffre";
import { nombrePage } from "@/components/Slug";

export default async function page({ searchParams }) {
    const { page } = await searchParams
    try {
        const pageNumber = page ? parseInt(page) : 1; // Récupérer le numéro de page depuis l'URL

        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?page=${pageNumber}&limit=${nombrePage}`)
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
