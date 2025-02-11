import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import { slugify } from '@/components/Slug';
import Title from '@/components/Title';
import React from 'react'

const page = async ({ params }) => {
    const { produit } = await params
    const [typesRes, offresRes, classementsRes, produitsRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?produit=${produit}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`),
    ])

    const [types, offres, classements, produits] = await Promise.all([typesRes.json(), offresRes.json(), classementsRes.json(), produitsRes.json()])

    const data = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const classement = types.map(category => ({
        ...category,
        classement: classements.filter(item => item.type === category.title)
    }));

    const titleSelect = produits.filter(item => slugify(item.title) == produit)
    const title = titleSelect[0].title

    return (
        <div>
            <Header params={produit} classement={classement} home={true} produits={produits} />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <div className="flex justify-center mt-10">
                        <h1 className='md:text-2xl text-xl font-medium text-gray-500'>{title} </h1>
                    </div>
                    <Title />
                    <Pagination data={data} params={produit} classements={classement} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default page