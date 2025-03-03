'use client'
import React from 'react'

const SectionCTA = () => {
  return (
    <div>
      <section className="container mx-auto py-20 px-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre entreprise ?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Rejoignez les entreprises qui ont déjà optimisé leurs interactions client grâce à nos solutions d'IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <button className="bg-white text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md">
            Demander une démo
            </button> */}
            <a href='#nosoffres' className="bg-white border-2 border-white text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md">
              Voir les offres
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SectionCTA