import AddArticle from "@/components/admin/AddArticle";

export default async function page() {
    try {
        const mentionRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`);
        if (!mentionRes.ok) {
            throw new Error(`Erreur HTTP : ${mentionRes.status}`);
        }
        const data = await mentionRes.json();
        const mentionData = data[0];

        if (!mentionData) {
            return (
                <>
                    <p>Aucune mention trouvée.</p>
                </>
            );
        }

        return (
            <>
                <AddArticle TINY_KEY={process.env.TINY_KEY} data={mentionData} page="mention" />
            </>
        );
    } catch (err) {
        console.error("Erreur lors de la récupération des mentions:", err);
        return (
            <>
                <p>Une erreur est survenue lors du chargement des mentions.</p>
            </>
        );
    }
}
