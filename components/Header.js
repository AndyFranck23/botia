'use client';

import { useState } from 'react';
import { Menu } from './Menu';
import Link from 'next/link';

// Composant principal Header
export const Header = ({ classement }) => {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    return (
        <>
            {isActive && <div onClick={() => setIsActive(!isActive)} className="h-screen bg-black/20 backdrop-blur-sm blakdrop-opacity-20 w-screen fixed z-30"></div>}
            <div className="fixed w-full z-50 bg-white flex items-center h-[65px] md:justify-between justify-between px-5 ">
                <div className="flex justify-around w-full">
                    <a href='/' className='font-bold text-4xl bg-gradient-to-r from-secondary to-primary text-transparent bg-clip-text'>BOTIA.AI</a>
                    <Category className={'hidden md:flex '} />
                </div>
                <button className='text-black text-2xl' onClick={toggleMenu}>
                    {isActive ? (<i className="fa-solid fa-xmark"></i>) : (<i className="fa-solid fa-bars"></i>)}
                </button>
            </div>
            <Menu classement={classement} className={`transform ease-in-out duration-500 ${isActive ? 'translate-x-[0%]' : ' translate-x-[100%]'}`} />
        </>
    );
};

// Composant Category
export const Category = ({ className }) => {
    const NavLinks = [
        { id: 1, link: "/chatbot", name: 'Chatbot' },
        { id: 2, link: "/mailbot", name: 'Mailbot' },
        { id: 3, link: "/callbot", name: 'CallBot' },
        { id: 4, link: "/chatbot", name: 'Chatbot' },
        { id: 5, link: "/agent-ai", name: 'Agent AI' },
    ];

    return (
        <div className={`gap-8 flex list-none items-center ${className}`}>
            {NavLinks.map((data) => (
                <li key={data.id}>
                    <Link href={data.link} className='text-xl  hover:text-primary py-2 hover:border-b-2 hover:border-secondary'>
                        {data.name}
                    </Link>
                </li>
            ))}
        </div>
    );
};
