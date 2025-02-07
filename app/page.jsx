import { Header } from '@/components/Header'
import Presentation from '@/components/Accueil/Presentation'
import Container from '@/components/Accueil/Container'
import Sliders from '@/components/Accueil/Sliders'
import Comparaison from '@/components/Accueil/Comparaison'

export default async function page() {
  const [typesRes, classementsRes] = await Promise.all([
    fetch(`${process.env.NOM_DE_DOMAIN}/api/types`, { cache: "no-store" }),
    fetch(`${process.env.NOM_DE_DOMAIN}/api/classements`, { cache: "no-store" })
  ])

  const [types, classements] = await Promise.all([typesRes.json(), classementsRes.json()])

  const classement = types.map(category => ({
    ...category,
    classement: classements.filter(item => item.type === category.title)
  }));

  return (
    <div>
      <Header classement={classement} />
      <div className="pt-20">
        <Presentation />
        <Container />
        <Sliders />
        <Comparaison />
      </div>
    </div>
  )
}

