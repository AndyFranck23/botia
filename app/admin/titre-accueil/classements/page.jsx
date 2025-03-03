import TextClassement from "@/components/admin/TextClassement";

export default function page() {
    return (
        <>
            <TextClassement TINY_KEY={process.env.TINY_KEY} />
        </>
    )
}
