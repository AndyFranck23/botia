import { Header } from '@/components/Header'
import Presentation from '@/components/Accueil/Presentation'
import Container from '@/components/Accueil/Container'
import Sliders from '@/components/Accueil/Sliders'
import Comparaison from '@/components/Accueil/Comparaison'
import { Footer } from '@/components/Footer'
import { slugify } from '@/components/Slug'

export default async function page() {
  const [typesRes, classementsRes, produitsRes, articlesRes, footerRes, mentionRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/types`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/produit`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/mention`),
  ])

  const [types, classements, produits, articles, footers, mention] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json(), articlesRes.json(), footerRes.json(), mentionRes.json()])

  const classement = types.map(category => ({
    ...category,
    classement: classements.filter(item => item.type === category.title)
  }));

  const secteur = classement.filter(item => slugify(item.title) == 'secteur')
  console.log(secteur)
  return (
    <div>
      <Header classement={classement} produits={produits} />
      <div className="pt-20">
        <Presentation />
        <Container data={secteur[0]} />
        <Sliders />
        <Comparaison />
      </div>
      <Footer articles={articles} result={footers} classements={classement} mention={mention[0]} />
    </div>
  )
}