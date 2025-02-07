import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import Title from '@/components/Title';
import React from 'react'

const page = async ({ params }) => {
    const { produit, classement } = await params
    const [typesRes, offresRes, classementsRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?produit=${produit}&classement=${classement}`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`)
    ])

    const [types, offres, classes] = await Promise.all([typesRes.json(), offresRes.json(), classementsRes.json()])

    const data = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    return (
        <div>
            <Header classement={classements} />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <Title />
                    <Pagination data={data} params={produit} classements={classements} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default page
