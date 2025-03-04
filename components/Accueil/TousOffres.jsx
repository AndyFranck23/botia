'use client'

import React, { useState } from 'react'
import { Offre } from '../Offre';

const TousOffres = ({ offres, classements, produits, classe }) => {
  const [activeTab, setActiveTab] = useState("Tous")
  const btn = ["Tous"]
  const tabs = btn.concat(classements.map(item => item.title));

  return (
    <div id='nosoffres'>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Les meilleurs bots IA en 2025</h2>
        <p className="text-gray-600 max-w-lg mx-auto">Découvrez les solutions les mieux notées par nos experts et nos utilisateurs</p>
      </div>

      <div className="flex justify-center gap-4 flex-wrap mb-12">
        {tabs.map((tab, index) => (
          <button key={index} onClick={() => setActiveTab(tab)} className={`px-6 py-2 border rounded-md cursor-pointer transition-colors duration-300 ${activeTab === tab ? 'bg-blue-400 text-white border-primary' : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-400'}`}>
            {tab}
          </button>
        ))}
        {/* <div className=""> */}
        {
          activeTab == 'Tous' &&
          <Offre
            data={offres?.slice(0, 6)}
            classements={classements}
            produits={produits}
          />
        }
        {/* </div> */}
        {
          classements?.map(item =>
            activeTab == item.title &&
            <Offre
              key={item.id}
              data={offres?.filter(offre =>
                offre.classement.find(ele =>
                  classe.find(elt => elt.type == item.title && ele.title == elt.title)
                )
              )}
              classements={classements}
              produits={produits}
            />
          )
        }
      </div>
    </div>
  )
}

export default TousOffres

// const test = (classements, type) => {
//   classements.title == type.title
// }