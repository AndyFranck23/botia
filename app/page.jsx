import { Header } from '@/components/Header'
import Presentation from '@/components/Accueil/Presentation'
import Container from '@/components/Accueil/Container'
import Sliders from '@/components/Accueil/Sliders'
import Comparaison from '@/components/Accueil/Comparaison'
import { Footer } from '@/components/Footer'

export default async function page() {
  const [typesRes, classementsRes, produitsRes] = await Promise.all([
    fetch(`${process.env.NOM_DE_DOMAIN}/api/types`, { cache: "no-store" }),
    fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`, { cache: "no-store" }),
    fetch(`${process.env.NOM_DE_DOMAIN}/api/produit`, { cache: "no-store" }),
  ])

  const [types, classements, produits] = await Promise.all([typesRes.json(), classementsRes.json(), produitsRes.json()])

  const classement = types.map(category => ({
    ...category,
    classement: classements.filter(item => item.type === category.title)
  }));

  return (
    <div>
      <Header classement={classement} home={false} produits={produits} />
      <div className="pt-20">
        <Presentation />
        <Container />
        <Sliders />
        <Comparaison />
      </div>
      <Footer />
    </div>
  )
}

