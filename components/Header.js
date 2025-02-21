'use client';

import { useState } from 'react';
import { Menu } from './Menu';
import Link from 'next/link';
import { slugify } from './Slug';

// Composant principal Header
export const Header = ({ classement, produits }) => {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    return (
        <>
            {isActive && <div onClick={() => setIsActive(!isActive)} className="h-screen bg-black/20 backdrop-blur-sm blakdrop-opacity-20 w-screen fixed z-30"></div>}
            <div className="fixed w-full z-50 bg-white flex items-center h-[65px] md:justify-between justify-between px-5 ">
                <div className="flex justify-around w-full">
                    <a href='/' className='font-bold text-4xl text-blue-500'> Bot<span className='text-black'>IA</span><span className='text-gray-400'>.ai</span></a>
                    <Category produits={produits} className={'hidden md:flex '} />
                </div>
                <button className='text-black text-2xl' onClick={toggleMenu}>
                    {isActive ? (<i className="fa-solid fa-xmark"></i>) : (<i className="fa-solid fa-bars"></i>)}
                </button>
            </div>
            <Menu produits={produits} classement={classement} className={`transform ease-in-out duration-500 ${isActive ? 'translate-x-[0%]' : ' translate-x-[100%]'}`} />
        </>
    );
};

// Composant Category
export const Category = ({ className, produits }) => {

    return (
        <div className={`gap-8 flex list-none items-center ${className}`}>
            {produits.map((data) => (
                <li key={data.id}>
                    <Link href={"/" + slugify(data.title)} className='text-xl  hover:text-primary py-2 hover:border-b-2 hover:border-secondary'>
                        {data.title}
                    </Link>
                </li>
            ))}
        </div>
    );
};
