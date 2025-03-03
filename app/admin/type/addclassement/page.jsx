import AddClassement from "@/components/admin/AddClassement";
import ListeClassement from "@/components/admin/ListeClassement";

export default async function page() {
    const [typesRes, classementsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" })
    ])

    const [types, classes] = await Promise.all([typesRes.json(), classementsRes.json()])

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    return (
        <>
            <AddClassement TINY_KEY={process.env.TINY_KEY} />
            <div className=" mt-20">
                <ListeClassement classement={classements} />
            </div>
        </>
    )
}
