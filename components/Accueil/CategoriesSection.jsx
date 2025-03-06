'use client'
import Link from "next/link";
import { useState } from "react";
import { slugify } from "../Slug";
const CategoriesSection = ({ classement, produit, offres }) => {
  const [activeTab, setActiveTab] = useState("Type de Bot")
  // const categories = [
  //   { icon: "💬", title: "Chatbots IA", description: "Bots conversationnels pour site web, applications et messageries", count: 127 },
  //   { icon: "📞", title: "Callbots IA", description: "Assistants vocaux pour gérer vos appels téléphoniques", count: 43 },
  //   { icon: "📧", title: "Mailbots IA", description: "Automatisation de vos réponses par email", count: 85 },
  //   { icon: "🏥", title: "Santé", description: "Solutions dédiées aux cliniques, hôpitaux et professionnels de santé", count: 37 },
  //   { icon: "🔒", title: "Assurances", description: "Bots IA pour compagnies d'assurance et courtiers", count: 29 },
  //   { icon: "💼", title: "Comptabilité", description: "Assistants pour comptables et experts financiers", count: 42 },
  //   { icon: "✏️", title: "Rédaction", description: "Solutions IA pour rédacteurs et créateurs de contenu", count: 56 },
  //   { icon: "🎨", title: "Design", description: "Assistants IA pour graphistes et designers", count: 31 },
  // ];

  const btn = ["Type de Bot"];
  const tabs = btn.concat(classement.map(item => item.title))

  return (
    <section className="py-20 bg-gray-50 text-gray-900" >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explorez par catégorie</h2>
          <p className="text-gray-600 max-w-lg mx-auto">Découvrez les meilleures solutions IA classées par type, secteur et métier</p>
        </div>
        <div className="flex justify-center gap-4 flex-wrap mb-12">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 border rounded-md cursor-pointer transition-colors duration-300 ${tab === activeTab // Utiliser activeTab au lieu de index === 0
                ? 'bg-blue-400 text-white border-blue-400'
                : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-400'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="">
          {activeTab == 'Type de Bot' &&
            <div className="flex justify-center flex-wrap gap-6">
              {produit.map((category, index) =>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${slugify(category.title)}`} key={index} className="w-80 bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                  <div className="bg-blue-400 h-32 flex items-center justify-center text-5xl text-primary">
                    {category.logo}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.text}</p>
                    <span className="inline-block bg-blue-400 text-primary-dark px-3 py-1 rounded-full text-sm font-medium">
                      {offres?.filter(item => item.id_produit == slugify(category.title)).length} bots
                    </span>
                  </div>
                </Link>
              )}
            </div>
          }
        </div>
        {
          classement?.map(ele =>
            <div key={ele.id} className="">
              {activeTab == ele.title &&
                <div className="flex justify-center flex-wrap gap-6">
                  {/* grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 */}
                  {ele.classement.slice(0, 6)
                    // .filter(category => {
                    //   if (activeTab === 0) return true; // Afficher toutes les catégories pour le premier onglet
                    //   return category.tab === activeTab; // Filtrer par onglet actif
                    // })
                    // .slice(0, 8) // Limiter à 8 éléments
                    .map((category, index) =>
                      <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/class/${slugify(category.type)}/${slugify(category.title)}`} key={index} className="w-80 bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                        <div className="bg-blue-400 h-32 flex items-center justify-center text-5xl text-primary">
                          <img src={category.logo ? category.logo : category.title} className="h-32 w-full object-cover" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                          <p className="text-gray-600 mb-4">{category.text}</p>
                          <span className="inline-block bg-blue-400 text-primary-dark px-3 py-1 rounded-full text-sm font-medium">
                            {offres?.filter(offre =>
                              JSON.parse(offre.classement).filter(item => item.slug == slugify(category.title))[0]
                            ).length} bots
                          </span>
                        </div>
                      </Link>
                    )}
                </div>
              }
            </div>
          )
        }
      </div>
    </section>
  );
};
export default CategoriesSection;

// {categories.map((category, index) => (
//   <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
//     <div className="bg-blue-400 h-32 flex items-center justify-center text-5xl text-primary">
//       {category.logo}
//     </div>
//     <div className="p-6">
//       <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
//       <p className="text-gray-600 mb-4">{category.description}</p>
//       <span className="inline-block bg-blue-400 text-primary-dark px-3 py-1 rounded-full text-sm font-medium">
//         {category.count} bots
//       </span>
//     </div>
//   </div>
// ))}
