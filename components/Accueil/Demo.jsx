'use client'
import React from 'react'
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faLaptop } from "@fortawesome/free-solid-svg-icons";

const Demo = () => {
  const [activeTab, setActiveTab] = useState("chatbot");
  return (
    <div>
                            {/* Section de démonstration interactive */}
      <section className="container mx-auto py-20 px-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Essayez nos solutions en action</h2>
              <p className="mb-8">
                Découvrez comment nos technologies d'IA peuvent transformer votre entreprise. Sélectionnez une solution
                pour voir une démonstration interactive.
              </p>

              <div className="w-full">
                <div className="bg-white/20 w-full grid grid-cols-3">
                  <button
                    onClick={() => setActiveTab("chatbot")}
                    className={`py-2 text-center ${activeTab === "chatbot" ? "bg-white text-blue-600" : ""}`}
                  >
                    ChatBot
                  </button>
                  <button
                    onClick={() => setActiveTab("callbot")}
                    className={`py-2 text-center ${activeTab === "callbot" ? "bg-white text-blue-600" : ""}`}
                  >
                    CallBot
                  </button>
                  <button
                    onClick={() => setActiveTab("mailbot")}
                    className={`py-2 text-center ${activeTab === "mailbot" ? "bg-white text-blue-600" : ""}`}
                  >
                    MailBot
                  </button>
                </div>
              </div>

              {/* <div className="mt-8">
                <button className="bg-white text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md">
                  Demander une démo complète
                </button>
              </div> */}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              {activeTab === "chatbot" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faLaptop} className="w-4 h-4" />
                    </div>
                    <div className="bg-white/20 rounded-lg rounded-tl-none p-3">
                      Bonjour ! Je suis le ChatBot IA de Botia. Comment puis-je vous aider aujourd'hui ?
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-white/30 rounded-lg rounded-tr-none p-3">
                      Je cherche à améliorer le service client de mon entreprise.
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">VP</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faLaptop} className="w-4 h-4" />
                    </div>
                    <div className="bg-white/20 rounded-lg rounded-tl-none p-3">
                      Je peux vous aider avec ça ! Botia propose plusieurs solutions d'IA pour optimiser votre service
                      client. Souhaitez-vous en savoir plus sur nos ChatBots, CallBots ou une solution combinée ?
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "callbot" && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <FontAwesomeIcon icon={faPhone} className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                    <p>Appel en cours avec CallBot IA...</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="font-medium">CallBot IA :</p>
                    <p>
                      "Bonjour, je suis l'assistant vocal de Botia. Je peux vous aider à prendre rendez-vous, répondre à
                      vos questions ou vous mettre en relation avec un conseiller. Que souhaitez-vous faire aujourd'hui
                      ?"
                    </p>
                  </div>
                  <div className="bg-white/30 rounded-lg p-3">
                    <p className="font-medium">Réponse client :</p>
                    <p>"Je voudrais prendre rendez-vous pour une démonstration."</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="font-medium">CallBot IA :</p>
                    <p>
                      "Parfait, je vais vous aider à planifier une démonstration. Quel jour de la semaine vous
                      conviendrait le mieux ?"
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "mailbot" && (
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                        <span className="font-medium">Nouveau message</span>
                      </div>
                      <span className="text-xs opacity-70">il y a 2 min</span>
                    </div>
                    <p className="font-medium">Objet : Demande d'information sur vos services</p>
                    <p className="opacity-80 mt-2">
                      Bonjour, je souhaiterais obtenir plus d'informations sur vos solutions d'IA pour mon entreprise...
                    </p>
                  </div>

                  <div className="bg-white/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                        <span className="font-medium">Réponse automatique</span>
                      </div>
                      <span className="text-xs opacity-70">il y a 1 min</span>
                    </div>
                    <p className="font-medium">Objet : Re: Demande d'information sur vos services</p>
                    <p className="opacity-80 mt-2">
                      Bonjour, merci pour votre message. Nous sommes ravis de vous informer que nous proposons diverses
                      solutions adaptées à vos besoins.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Demo