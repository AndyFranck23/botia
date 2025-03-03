'use client'
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronRight, faPhone, faEnvelope, faCommentDots, faLaptop } from "@fortawesome/free-solid-svg-icons";

export default function Card() {

  return (

    <div className="container mx-auto py-20 px-4">
      {/* section texte et image */}
      <div className="">
        <h2 className="text-2xl sm:text-3xl sd:3xl font-extrabold mb-8 w-full mx-auto text-center pt-6">
          Accédez à toutes les solutions de chatbots callbots et MailBot
          disponibles sur les principales plateformes, directement sur BotIA."
        </h2>
        <div className="grid md:grid-cols-2 sm:grid-cols-1">
          <div className="text items-center sm:text-xl text-lg sm:pt-20 sm:p-8 p-4">
            <p className='font-cursive sm:m-10 sm:p-6 mt:12'>
              "Un seul accès pour explorer toutes les solutions de chatbots , callbots et maillbots.
              En devenant membre de Botia, vous avez accès à une sélection complète des offres de prestataires,
              couvrant tous les outils nécessaires pour intégrer et optimiser vos chatbots.
              Cela inclut les solutions pour chaque secteur,
              chaque technologie, et chaque fonctionnalité dont vous avez besoin."
            </p>
          </div>
          <div className="flex justify-center items-center" >
            <img src="/arbres.jpeg" alt="" srcSet="" className='' />
          </div>
        </div>
        {/* ANIMATION */}
        <div className="h-[300px] w-[15vw] bg-gradient-to-r from-primary to-secondary rounded-full absolute top-0 left-0 blur-3xl animate-move-wrapper"></div>

      </div>

      {/* section titre cartes */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Nos solutions{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            intelligentes
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez comment nos technologies d'IA peuvent transformer votre entreprise et optimiser vos interactions
          client.
        </p>
      </div>
      {/* Conteneur des cartes */}
      <div className="relative group">
        <div className="flex justify-center overflow-x-auto pb-4 gap-10 px-8 md:px-12">
          {/* ChatBot IA Card */}
          <div className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-80">            <div className="pb-2 p-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faCommentDots} className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl">ChatBot IA</h3>
            <p className="text-gray-500">Assistance conversationnelle 24/7</p>
          </div>
            <div className="px-4 py-2">
              <ul className="space-y-2">
                {["Réponses instantanées", "Personnalisation avancée", "Intégration multiplateforme"].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-blue-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 py-2">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 text-white">
                En savoir plus <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          {/* CallBot IA Card */}
          <div className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-80 ">            <div className="pb-2 p-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faPhone} className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl">CallBot IA</h3>
            <p className="text-gray-500">Gestion intelligente des appels</p>
          </div>
            <div className="px-4 py-2">
              <ul className="space-y-2">
                {["Reconnaissance vocale avancée", "Routage intelligent", "Analyse des sentiments"].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-purple-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 py-2">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 text-white">
                En savoir plus <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* MaillBot IA Card */}
          <div className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-80">            <div className="pb-2 p-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl">MailBot IA</h3>
            <p className="text-gray-500">Automatisation des emails</p>
          </div>
            <div className="px-4 py-2">
              <ul className="space-y-2">
                {["Réponses automatiques", "Classification intelligente", "Suivi des performances"].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-indigo-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 py-2">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 text-white">
                En savoir plus <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



