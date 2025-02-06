'use client'
import { Header } from '@/components/Header'
import Presentation from '@/components/Accueil/Presentation'
import Container from '@/components/Accueil/Container'
import Sliders from '@/components/Accueil/Sliders'
import Comparaison from '@/components/Accueil/Comparaison'

export default function Home() {

  return (
    <div>
      <Header />
      <div className="pt-20">
        <Presentation />
        <Container />
        <Sliders />
        <Comparaison />
      </div>
    </div>
  )
}

