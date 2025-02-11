'use client'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faMoneyBillWave, faBuilding, faShieldAlt, faGraduationCap, faFilm } from '@fortawesome/free-solid-svg-icons'; // Import des icônes
// Exemple de données pour les boîtes
const data = [
    { icon: faHeartbeat, title: "Santé et bien-être", colorClass: "text-red-500" },
    { icon: faMoneyBillWave, title: "Finance et banques", colorClass: "text-green-500" },
    { icon: faBuilding, title: "Services publics et administration", colorClass: "text-gray-500" },
    { icon: faShieldAlt, title: "Assurances", colorClass: "text-yellow-500" },
    { icon: faGraduationCap, title: "Education", colorClass: "text-blue-500" },
    { icon: faFilm, title: "Divertissement et médias", colorClass: "text-purple-500" }
];

const Container = () => {
    return (
        <div className="">
            <div
                className="min-h-screen bg-cover bg-center p-10 pb-[100px] bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500"
            >
                <h1 className="sm:text-4xl text-xl font-extrabold mb-8 w-full mx-auto text-center text-white p-6">
                    Botia compare les meilleures solutions de chatbots, callbots, IA vocale et plus, pour tous les secteurs."
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className=" bg-white hover:bg-gradient-to-r from-primary to-secondary hover:text-white hover:shadow-[0_0_40px_#007cfff0] rounded-3xl shadow-lg flex flex-col items-center"
                        >
                            <div className="flex justify-center sm:p-8 p-4">
                                <FontAwesomeIcon icon={item.icon} className={`w-8 h-8 p-4 ${item.colorClass}`} />
                            </div>
                            <h2 className="sm:text-3xl text-xs font-extrabold text-center mb-2 pb-2">{item.title}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="">
                <h1 className="text-2xl sm:text-3xl sd:3xl font-extrabold mb-8 w-full mx-auto text-center pt-6">
                    Accédez à toutes les solutions de chatbots callbots et MailBot
                    disponibles sur les principales plateformes, directement sur Botia."
                </h1>
                <div className="grid md:grid-cols-2 sm:grid-cols-1">
                    <div className="text items-center sm:text-xl text-lg">
                        <p className='font-cursive sm:m-16 sm:p-6 mt:12'>
                            "Un seul accès pour explorer toutes les solutions de chatbots et callbots.
                            En devenant membre de Botia, vous avez accès à une sélection complète des offres de prestataires,
                            couvrant tous les outils nécessaires pour intégrer et optimiser vos chatbots.
                            Cela inclut les solutions pour chaque secteur,
                            chaque technologie, et chaque fonctionnalité dont vous avez besoin."
                        </p>
                    </div>
                    <div className="flex items-center">
                        <img src="/arbres.jpeg" alt="" srcSet="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Container;

