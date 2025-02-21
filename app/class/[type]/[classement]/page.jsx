import Faq from '@/components/Faq';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import { slugify } from '@/components/Slug';
import Title from '@/components/Title';
import React from 'react'

export async function generateMetadata({ params }) {
    const { classement, type } = await params
    const [typesRes, classementsRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`),
    ])

    const [types, classes] = await Promise.all([typesRes.json(), classementsRes.json()])

    const typeSelect = types.filter(item => slugify(item.title) == type)
    const titleType = typeSelect[0]?.title

    const classSelect = classes.filter(item => slugify(item.title) == classement)
    const titleClass = classSelect[0]?.title
    return {
        title: `${titleType} - ${titleClass}`,
        description: classSelect[0]?.description,
        // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
    }
}

const page = async ({ params }) => {
    const { type, classement } = await params
    const [typesRes, offresRes, classementsRes, produitsRes, titreRes, articlesRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?classement=${classement}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/titre?classement=${classement}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/blog`)
    ])

    const [types, offres, classes, produits, titres, articles] = await Promise.all([
        typesRes.json(),
        offresRes.json(),
        classementsRes.json(),
        produitsRes.json(),
        titreRes.json(),
        articlesRes.json()
    ])

    const data = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        // descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    const typeSelect = types.filter(item => slugify(item.title) == type)
    const titleType = typeSelect[0].title

    const classSelect = classes.filter(item => slugify(item.title) == classement)
    const titleClass = classSelect[0]?.title

    return (
        <div>
            <Header classement={classements} produits={produits} />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <div className="flex justify-center mt-10">
                        <h1 className='md:text-2xl text-xl font-medium text-gray-500'> {titleType} - {titleClass} </h1>
                    </div>
                    <Title params={titres[0]} />
                    <Pagination data={data} classements={classements} />
                    <Faq classements={classes} />
                </div>
            </div>
            <Footer articles={articles} />
        </div >
    )
}

export default page
