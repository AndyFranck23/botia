import Faq from '@/components/Faq';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Offre';
import { Slider } from '@/components/Slider';
import { slugify } from '@/components/Slug';
import Title from '@/components/Title';
import React from 'react'

export async function generateMetadata({ params }) {
    const { classement } = await params
    const classementsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`)

    const classements = await classementsRes.json()
    const meta = classements?.filter(item => slugify(item.title) === classement);

    if (!meta || meta.length === 0) {
        return {
            title: 'Classement non trouvé',
            description: 'Le classement demandé n\'a pas été trouvé.'
        };
    }

    return {
        title: meta[0].meta_title === '' ? meta[0].title : meta[0].meta_title,
        description: meta[0].meta_description
        // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
    }
}

const page = async ({ params }) => {
    const { type, classement } = await params
    const [typesRes, offresRes, classementsRes, produitsRes, articlesRes, footerRes, mentionRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?classement=${classement}`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`)
    ])

    const [types, offres, classes, produits, articles, footers, mention] = await Promise.all([
        typesRes.json(),
        offresRes.json(),
        classementsRes.json(),
        produitsRes.json(),
        articlesRes.json(),
        footerRes.json(),
        mentionRes.json()
    ])

    const data = offres.map((item) => ({
        ...item,
        classement: JSON.parse(item.classement),
        // descriptionOC: JSON.parse(item.descriptionOC),
    }));

    const titres = classes.filter(item => slugify(item.title) === classement);

    if (!titres || titres.length === 0) {
        return <div>Classement non trouvé</div>;
    }

    const classements = types.map(category => ({
        ...category,
        classement: classes.filter(item => item.type === category.title)
    }));

    const typeSelect = types.filter(item => slugify(item.title) === type);
    const titleType = typeSelect[0]?.title || 'Type non trouvé';

    const classSelect = classes.filter(item => slugify(item.title) === classement);
    const titleClass = classSelect[0]?.title || 'Classement non trouvé';

    return (
        <div>
            <Header classement={classements} produits={produits} />
            <div className="pt-10">
                <Slider types={types} />
                <div className="space-y-20">
                    <div className="flex justify-center mt-10">
                        <h1 className='md:text-2xl text-xl font-medium text-gray-500'>{titres[0].titre_h1 ? titres[0].titre_h1 : titleType + "-" + titleClass}  </h1>
                    </div>
                    <Title params={titres[0]} />
                    <Pagination data={data} classements={classements} />
                    <Faq classements={classes} />
                    <div className="xs:px-10 px-5">
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: titres[0].content }} />
                    </div>
                </div>
            </div>
            <Footer articles={articles} result={footers} classements={classements} mention={mention[0]} />
        </div >
    )
}

export default page
