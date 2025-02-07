'use client'
import React from 'react';

const Comparaison = () => {
  // Données des offres
  const offers = [
    {
      name: "Botsify",
      features: ["Service client 24/7", "Personnalisation avancée", "Intégrations multiples"],
      price: "49€/mois",
      link: "#"
    },
    {
      name: "Botpress",
      features: ["Reconnaissance vocale", "IA conversationnelle", "Support multilingue"],
      price: "99€/mois",
      link: "#"
    },
    {
      name: "MyChatbot",
      features: ["Analytics intégrés", "Automatisation CRM", "Mise en place rapide"],
      price: "79€/mois",
      link: "#"
    }
  ];

  return (
    <section className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 py-16 px-8 sm:px-16 md:px-32">
      <div className="max-w-6xl mx-auto">
        {/* En-tête de la section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Comparez les meilleures <span className="underline decoration-yellow-400">offres</span>
          </h2>
          <p className="text-blue-100 text-lg">
            Trouvez la solution parfaite pour vos besoins en chatbot et callbot en comparant les caractéristiques principales des prestataires.
          </p>
        </div>

        {/* Grille des offres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300"
            >
              {/* Titre de l'offre */}
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                {offer.name}
              </h3>
              {/* Liste des fonctionnalités */}
              <ul className="space-y-2 mb-4">
                {offer.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-700 flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {/* Prix */}
              <p className="text-blue-600 font-bold text-lg mb-4">
                {offer.price}
              </p>
              {/* Bouton CTA */}
              <a
                href={offer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold text-center py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                En savoir plus
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Comparaison;
