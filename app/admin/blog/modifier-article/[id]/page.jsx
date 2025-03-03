import ModifierArticle from '@/components/admin/ModifierArticle'
import React from 'react'

const page = async ({ params }) => {
    const { id } = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?id=${id}`)
    const data = await response.json()

    return (
        <>
            <ModifierArticle data={data[0]} TINY_KEY={process.env.TINY_KEY} id={id} />
        </>
    )
}

export default page