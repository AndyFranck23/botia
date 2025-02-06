'use client'; // Nécessaire pour les hooks React

import { useState } from 'react';
import Link from 'next/link';

export const Menu = ({ className, classement }) => {
    const [isActive, setIsActive] = useState(null);

    const showOptions = (index) => {
        setIsActive(prev => prev === index ? null : index);
    }

    if (!classement) {
        // Afficher un message de chargement ou ne rien afficher tant que les données ne sont pas disponibles
        return <div>Chargement...</div>;
    }
    return (
        <div className="flex w-screen justify-end">
            <div className={`fixed bg-white w-[250px] h-screen z-40 px-2 pr-5 border-l-2 border-gray-100 mt-[65px] ${className}`}>
                <Link href='/' className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                    Accueil
                </Link>
                <div className="md:hidden">
                    <Link href='/chatbot' className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                        Chatbot
                    </Link>
                    <Link href='/callbot' className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                        Callbot
                    </Link>
                    <Link href='/mailbot' className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                        Mailbot
                    </Link>
                    <Link href='/chatbot' className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                        Chatbot
                    </Link>
                    <Link href='/agent-ai' className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                        Agent-AI
                    </Link>
                </div>
                {classement.map((option, index) => (
                    <li key={index} className='list-none'>
                        <button
                            onClick={() => showOptions(index)}
                            className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'
                        >
                            {option.title}
                            {isActive === index ?
                                <i className="fa-solid fa-chevron-down" /> :
                                <i className="fa-solid fa-chevron-right" />}
                        </button>
                        {isActive === index && <OptionSelect options={classement} index={index} />}
                    </li>
                ))}
            </div>
        </div>
    )
}

const OptionSelect = ({ index, options }) => {
    return (
        <div className="p-2 space-y-2 bg-gray-100 rounded-lg">
            {
                options[index].classement.map((option, i) => (
                    <ul key={i}>
                        <li>
                            <a
                                href={`/${options[index].title + '/' + option.title}`}
                                // onClick={() => navigation(option.title)}
                                className='flex items-center w-full hover:bg-gray-200 p-2 rounded-xl p-1'
                            >
                                <img src={option.logo} className='rounded-md object-cover w-[25px] h-[25px] mr-5' />
                                <p>{option.title}</p>
                            </a>
                        </li>
                    </ul>
                ))
            }
        </div>
    )
}