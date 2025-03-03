import ModifierClassement from "@/components/admin/ModifierClassement";

export default async function page({ params }) {
    const { id } = await params
    return (
        <>
            <ModifierClassement id={id} userdata={{ identite: 'test' }} />
        </>
    )
}
