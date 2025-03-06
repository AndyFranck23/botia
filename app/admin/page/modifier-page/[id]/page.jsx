import ModifierArticle from '@/components/admin/ModifierArticle'
import React from 'react'

const page = async ({ params }) => {
    const { id } = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/page?id=${id}`)
    const data = await response.json()

    return (
        <>
            <ModifierArticle data={data[0]} page={'page'} id={id} />
        </>
    )
}

export default page