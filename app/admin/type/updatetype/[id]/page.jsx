import ModifierType from "@/components/admin/ModifierType";

export default async function page({ params }) {
    const { id } = await params
    return (
        <>
            <ModifierType id={id} />
        </>
    )
}
