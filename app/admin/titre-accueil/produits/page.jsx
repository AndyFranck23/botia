import TextAccueil from "@/components/admin/TextAccueil";

export default function page() {

    return (
        <>
            <TextAccueil TINY_KEY={process.env.TINY_KEY} />
        </>
    )
}
