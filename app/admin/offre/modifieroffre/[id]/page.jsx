import Layout from "@/components/admin/Layout";
import ModifierOffre from "@/components/admin/ModifierOffre";

export default async function page({ params }) {
    const { id } = await params
    const [typesRes, classementsRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`)
    ])

    const [types, classes] = await Promise.all([typesRes.json(), classementsRes.json()])

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    return (
        <Layout>
            <ModifierOffre id={id} classements={classements} />
        </Layout>
    )
}
