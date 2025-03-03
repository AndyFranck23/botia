import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react'

export async function generateMetadata() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`)
    const data = await response.json()

    if (!data || data.length === 0) {
        return {
            title: 'Produit non trouvé',
            description: 'Le produit demandé n\'a pas été trouvé.'
        };
    }

    return {
        title: data[0].meta_title == '' ? data[0].title : data[0].meta_title,
        description: data[0].meta_description,
        // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
        robots: data[0].indexation == 0 ? "noindex, nofollow" : "index, follow"
    }
}


const page = async () => {
    const [typesRes, classementsRes, produitsRes, articlesRes, mentionRes, footerRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
    ])

    const [types, classements, produits, articles, mention, footers] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), mentionRes.json(), footerRes.json()])
    const classement = types.map(category => ({
        ...category,
        classement: classements.filter(item => item.type === category.title)
    }));

    return (
        <>
            <Header classement={classement} produits={produits} />
            <div className='text-black lg:px-[200px] px-[12vw] pt-20 flex justify-center'>
                {mention[0]?.content ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: mention[0].content }} />
                ) : (
                    <p>Contenu indisponible.</p>
                )}
            </div>
            <Footer articles={articles} result={footers} classements={classement} mention={mention[0]} />
        </>
    )
}

export default page