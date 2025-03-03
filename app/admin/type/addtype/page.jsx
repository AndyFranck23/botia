import AddType from "@/components/admin/AddType";
import ListeType from "@/components/admin/ListeType";

export default async function Page() {
    const [typesRes, classementsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" })
    ]);

    const [types, classes] = await Promise.all([
        typesRes.json(),
        classementsRes.json()
    ]);

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    return (
        <>
            <AddType />
            <ListeType classements={classements} />
        </>
    );
}
