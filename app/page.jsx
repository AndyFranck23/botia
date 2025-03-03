import Presentation from '@/components/Accueil/Presentation'
import Sliders from '@/components/Accueil/Sliders'
import { Footer } from '@/components/Footer'
import { slugify } from '@/components/Slug'
import CategoriesSection from '@/components/Accueil/CategoriesSection'
import Card from '@/components/Accueil/Card'
import Demo from '@/components/Accueil/Demo'
import TousOffres from '@/components/Accueil/TousOffres'
import SectionCTA from '@/components/Accueil/SectionCTA'
import Header from '@/components/Header'

export async function generateMetadata() {
  return {
    title: "BotIA",
    description: "Notre plateforme vous aide à découvrir et comparer les meilleures solutions de chatbots et callbots adaptées à vos besoins. Simplifiez votre recherche et trouvez le partenaire idéal ! Des comparatifs clairs, des avis impartiaux, et un accès direct aux meilleurs prestataires",
    // robots: data.indexation == 0 ? "noindex, nofollow" : "index, follow",
    robots: "index, follow"
  }
}


export default async function page() {
  const [typesRes, classementsRes, produitsRes, articlesRes, footerRes, mentionRes, offresRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres?accueil=produit`),
  ])

  const [types, classements, produits, articles, footers, mention, { offres }] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), footerRes.json(), mentionRes.json(), offresRes.json()])

  const data = offres?.map((item) => ({
    ...item,
    classement: JSON.parse(item.classement),
    // descriptionOC: JSON.parse(item.descriptionOC),
  }));

  const classement = types.map(category => ({
    ...category,
    classement: classements.filter(item => item.type === category.title)
  }));

  const plateformes = classement.filter(item => slugify(item.title) == 'plateformes')
  // console.log(plateformes)
  return (
    <div>
      <Header classement={classement} produits={produits} />
      <div className="pt-20">
        <Presentation />
        <CategoriesSection classement={classement} produit={produits} offres={offres} />
        {/* <Test /> */}
        <div className="w-full bg-gradient-to-b from-white to-blue-50">
          <Card />
          <Demo />
          <TousOffres offres={data} classements={classement} produits={produits} classe={classements} />
          <Sliders data={plateformes[0]} />
          <SectionCTA />
        </div>
      </div>
      <Footer articles={articles} result={footers} classements={classement} mention={mention[0]} />
    </div>
  )
}