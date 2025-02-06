// 'use client'
// import { Header } from '@/components/Header'
// import Presentation from '@/components/Accueil/Presentation'
// import Container from '@/components/Accueil/Container'
// import Sliders from '@/components/Accueil/Sliders'
// import Comparaison from '@/components/Accueil/Comparaison'
// import { Suspense } from 'react'

// // Cache pour les données et les promesses
// let cachedData = null
// let dataPromise = null

// async function fetchCombinedData() {
//     try {
//         const [typesRes, classementsRes] = await Promise.all([
//             fetch('http://localhost:3000/api/types'),
//             fetch('http://localhost:3000/api/classements')
//         ])

//         if (!typesRes.ok || !classementsRes.ok) throw new Error('Échec du chargement des données')

//         const [types, classements] = await Promise.all([
//             typesRes.json(),
//             classementsRes.json()
//         ])

//         return types.map(category => ({
//             ...category,
//             classement: classements.filter(item => item.type === category.title)
//         }))
//     } catch (error) {
//         console.error('Erreur de récupération:', error)
//         throw error
//     }
// }

// function getData() {
//     if (cachedData) return cachedData
//     if (!dataPromise) dataPromise = fetchCombinedData().then(data => (cachedData = data))
//     throw dataPromise // Suspense interceptera cette promesse
// }

// function DataContent() {
//     const data = getData() // Soit retourne les données, soit lance la promesse

//     return (
//         <div>
//             <Header classement={data} />
//             <div className="pt-20">
//                 <Presentation />
//                 <Container />
//                 <Sliders />
//                 <Comparaison />
//             </div>
//         </div>
//     )
// }

// export default function Home() {
//     return (
//         <Suspense fallback={<div className="text-center p-8">Chargement des données...</div>}>
//             <DataContent />
//         </Suspense>
//     )
// }