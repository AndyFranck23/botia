import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import Title from '@/components/Title';
import React from 'react'

const page = async ({ params }) => {
    const { produit, classement } = await params
    const [typesRes, offresRes] = await Promise.all([
        fetch(`${process.env.NOM_DE_DOMAIN}/api/types`),
        fetch(`${process.env.NOM_DE_DOMAIN}/api/offres?produit=${produit}&classement=${classement}`)
    ])

    const [types, offres] = await Promise.all([typesRes.json(), offresRes.json()])

    const data = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        descriptionOC: JSON.parse(item.descriptionOC),
    }));

    return (
        <div>
            <Header />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <Title />
                    <Pagination data={data} params={produit} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default page