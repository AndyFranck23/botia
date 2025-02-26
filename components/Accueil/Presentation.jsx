'use client'
import React from 'react';

const Presentation = () => {
    return (
        <div className="flex flex-col items-center text-center px-4 sm:px-0">
            <div className="container min-h-[700px] flex w-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center">
                    {/* Texte section */}
                    <div className="order-2 sm:order-1 space-y-5 flex flex-col items-center">
                        <h2 className="sm:text-3xl text-xl">
                            LA PLATEFORME QUI CONNECTE VOS IDÉES {''}
                            <span className="sm:text-3xl text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                                AUX MEILLEURES SOLUTIONS D'IA POUR TOUS VOS PROJETS
                            </span>
                        </h2>
                        <p className="text-md sm:text-xl font-medium max-w-lg">
                            Notre plateforme vous aide à découvrir et comparer les meilleures
                            solutions de chatbots et callbots adaptées à vos besoins. Simplifiez
                            votre recherche et trouvez le partenaire idéal !
                            Des comparatifs clairs, des avis impartiaux, et un accès direct aux
                            meilleurs prestataires.
                        </p>
                        <div className="flex justify-center">
                            <button className="bg-gradient-to-r from-primary to-secondary duration-300 py-2 px-6 text-white rounded-full hover:scale-90">
                                💡 Explorez nos offres
                            </button>
                        </div>
                    </div>
                    {/* Image section */}
                    <div className="py-8 order-1 sm:order-2 flex justify-center">
                        <img
                            src="/agentIA.png"
                            alt=""
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>
            </div>
            {/* ANIMATION */}
            <div className="h-[300px] w-[15vw] bg-gradient-to-r from-primary to-secondary rounded-full absolute top-0 left-0 blur-3xl animate-move-wrapper"></div>

            <div className="py-8 sm:p-10">
                <h2 className="text-2xl sm:text-3xl max-w-full text-center font-cursive">
                    "Découvrez BOTIA.AI, Simplifiez votre recherche en quelques clics et trouvez facilement
                    le partenaire idéal pour transformer vos projets et optimiser votre expérience client !"
                </h2>
            </div>
        </div>
    );
};

export default Presentation;