import AddClassement from "@/components/admin/AddClassement";
import ListeClassement from "@/components/admin/ListeClassement";

export default async function page({ searchParams }) {
    const { type } = await searchParams
    const [typesRes, classementsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements${type ? '?type=' + type : ''}`, { cache: "no-store" })
    ])

    const [types, classes] = await Promise.all([typesRes.json(), classementsRes.json()])

    // const classements = types.map(category => ({
    //     ...category,
    //     classement: classes.filter(item => item.type === category.title)
    // }));

    return (
        <>
            <AddClassement type={type} />
            <ListeClassement classement={classes} />
        </>
    )
}
