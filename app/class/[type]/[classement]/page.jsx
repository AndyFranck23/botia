import Faq from '@/components/Faq';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import { slugify } from '@/components/Slug';
import Title from '@/components/Title';
import React from 'react'

export async function generateMetadata({ params, searchParams }) {
    const { classement, type } = await params
    const { page } = await searchParams
    const pages = page ? parseInt(page) : 1; // Récupérer la page
    const classementsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements?type=${type}`)

    const classements = await classementsRes.json()
    const meta = classements?.filter(item => slugify(item.title) === classement);

    if (!meta || meta.length === 0) {
        return {
            title: 'Classement non trouvé',
            description: 'Le classement demandé n\'a pas été trouvé.'
        };
    }

    return {
        title: meta[0].meta_title == '' ? meta[0].title : meta[0].meta_title,
        description: meta[0].meta_description,
        // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
        robots: pages === 1 ? meta[0].indexation == 0 ? "noindex, nofollow" : "index, follow" : "noindex, follow"

    }
}

const page = async ({ params, searchParams }) => {
    const { classement } = await params
    const { page } = await searchParams
    const pageNumber = page ? parseInt(page) : 1; // Récupérer le numéro de page depuis l'URL

    const [typesRes, offresRes, classementsRes, produitsRes, articlesRes, footerRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?classement=${classement}&page=${pageNumber}`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
    ])

    const [types, { offres, total }, classes, produits, articles, footers] = await Promise.all([
        typesRes.json(),
        offresRes.json(),
        classementsRes.json(),
        produitsRes.json(),
        articlesRes.json(),
        footerRes.json(),
    ])

    const data = offres?.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        // descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const titres = classes?.filter(item => slugify(item.title) === classement);

    if (!titres || titres.length === 0) {
        return <div>Classement non trouvé</div>;
    }

    const classements = types?.map(category => ({
        ...category,
        classement: classes?.filter(item => item.type === category.title)
    }));

    // const typeSelect = types.filter(item => slugify(item.title) === type);
    // const titleType = typeSelect[0]?.title || 'Type non trouvé';

    // const classSelect = classes.filter(item => slugify(item.title) === classement);
    // const titleClass = classSelect[0]?.title || 'Classement non trouvé';

    return (
        <div>
            <Header classement={classements} produits={produits} />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <Title params={titres[0]} />
                    <Pagination data={data} classements={classements} total={total} produits={produits} />
                    <Faq classements={classes} />
                    <div className="xs:px-[5vw] px-[20px] w-full justify-center flex">
                        {titres[0]?.content ? (
                            <div className="overflow-x-auto prose max-w-none">
                                <div className="no-tailwind" dangerouslySetInnerHTML={{ __html: titres[0].content }} />
                            </div>
                        ) : (
                            <p>Contenu indisponible.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer articles={articles} result={footers} classements={classements} />
        </div >
    )
}

export default page
