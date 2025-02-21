import Layout from '@/components/admin/Layout'
import ModifierArticle from '@/components/admin/ModifierArticle'
import React from 'react'

const page = async ({ params }) => {
    const { id } = await params
    const response = await fetch(`${process.env.NOM_DE_DOMAIN}/api/blog?id=${id}`)
    const data = await response.json()

    return (
        <Layout>
            <ModifierArticle data={data[0]} TINY_KEY={process.env.TINY_KEY} id={id} />
        </Layout>
    )
}

export default page