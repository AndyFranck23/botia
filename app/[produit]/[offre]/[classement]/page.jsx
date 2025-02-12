import Faq from '@/components/Faq';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import { slugify } from '@/components/Slug';
import Title from '@/components/Title';
import React from 'react'

export async function generateMetadata({ params }) {
    const { produit, offre, classement } = await params
    const [typesRes, classementsRes, produitsRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`),
    ])

    const [types, classes, produits] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json()])
    const produitSelect = produits.filter(item => slugify(item.title) == produit)
    const titleProduit = produitSelect[0].title

    const typeSelect = types.filter(item => slugify(item.title) == offre)
    const titleType = typeSelect[0].title

    const classSelect = classes.filter(item => slugify(item.title) == classement)
    const titleClass = classSelect[0].title
    return {
        title: `${titleProduit} - ${titleType} - ${titleClass}`,
        description: classSelect[0].description,
        // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
    }
}

const page = async ({ params }) => {
    const { produit, classement, offre } = await params
    const [typesRes, offresRes, classementsRes, produitsRes, titreRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?produit=${produit}&classement=${classement}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/titre?produit=${produit}&classement=${classement}`),
    ])

    const [types, offres, classes, produits, titres] = await Promise.all([typesRes.json(), offresRes.json(), classementsRes.json(), produitsRes.json(), titreRes.json()])

    const data = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    const produitSelect = produits.filter(item => slugify(item.title) == produit)
    const titleProduit = produitSelect[0].title

    const typeSelect = types.filter(item => slugify(item.title) == offre)
    const titleType = typeSelect[0].title

    const classSelect = classes.filter(item => slugify(item.title) == classement)
    const titleClass = classSelect[0].title

    return (
        <div>
            <Header params={produit} classement={classements} home={true} produits={produits} />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <div className="flex justify-center mt-10">
                        <h1 className='md:text-2xl text-xl font-medium text-gray-500'>{titleProduit} - {titleType} - {titleClass} </h1>
                    </div>
                    <Title params={titres[0]} />
                    <Pagination data={data} params={produit} classements={classements} />
                    <Faq classements={classes} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default page
