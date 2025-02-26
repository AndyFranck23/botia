import { parseShortcode, ShortCode } from '@/components/admin/ShortCode';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import { slugify } from '@/components/Slug';
import Title from '@/components/Title';
import React from 'react'

export async function generateMetadata({ params }) {
    const { produit } = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`)
    const data = await response.json()

    const meta = data?.filter(item => slugify(item.title) == produit)
    if (!meta || meta.length === 0) {
        return {
            title: 'Produit non trouvé',
            description: 'Le produit demandé n\'a pas été trouvé.'
        };
    }

    return {
        title: meta[0].meta_title == '' ? meta[0].title : meta[0].meta_title,
        description: meta[0].meta_description
        // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
    }
}

const page = async ({ params }) => {
    const { produit } = await params
    const [typesRes, offresRes, classementsRes, produitsRes, articlesRes, footerRes, mentionRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?produit=${produit}`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`),
    ])

    const [types, offres, classements, produits, articles, footers, mention] = await Promise.all([typesRes.json(), offresRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), footerRes.json(), mentionRes.json()])

    const data = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        // descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const classement = types.map(category => ({
        ...category,
        classement: classements.filter(item => item.type === category.title)
    }));

    const titleSelect = produits.filter(item => slugify(item.title) == produit)
    const caractProduits = titleSelect[0]

    // donnée du footer à part le blog
    // const parsed = parseShortcode("[table=classements type=plateformes]"); // short code
    // const result = await ShortCode({ code: parsed });
    // console.log(footers)

    return (
        <div>
            <Header classement={classement} produits={produits} />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <div className="flex justify-center mt-10">
                        <h1 className='md:text-2xl text-xl font-medium text-gray-500'>{caractProduits?.titre_h1 ? caractProduits?.titre_h1 : caractProduits?.title} </h1>
                    </div>
                    <Title params={caractProduits} />
                    <Pagination data={data} params={produit} classements={classement} produits={produits} />
                </div>
            </div>
            <Footer articles={articles} result={footers} classements={classement} mention={mention[0]} />
        </div>
    )
}

export default page