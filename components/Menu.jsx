'use client'; // Nécessaire pour les hooks React

import { useState } from 'react';
import Link from 'next/link';
import { slugify } from './Slug';

export const Menu = ({ className, classement, produits }) => {
    const [isActive, setIsActive] = useState(null);

    const showOptions = (index) => {
        setIsActive(prev => prev === index ? null : index);
    }

    return (
        <div className="flex justify-end">
            <div className={`overflow-y-auto fixed bg-white w-[250px] h-screen z-40 px-2 pr-5 border-l-2 border-gray-100 pt-[65px] ${className}`}>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/`} className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                    Accueil
                </Link>
                <div className="md:hidden">
                    {
                        produits.map(item =>
                            <Link key={item.id} href={`${process.env.NEXT_PUBLIC_SITE_URL}/${slugify(item.title)}`} className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                                {item.title}
                            </Link>
                        )
                    }
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
        <div className="overflow-y-auto p-2 space-y-2 bg-gray-100 rounded-lg max-h-60">
            {
                options[index].classement.map((option, i) => (
                    <ul key={i}>
                        <li>
                            <Link
                                href={`${process.env.NEXT_PUBLIC_SITE_URL}/class/${slugify(options[index].title) + '/' + slugify(option.title)}`}
                                // onClick={() => navigation(option.title)}
                                className='flex items-center w-full hover:bg-gray-200 p-2 rounded-xl p-1'
                            >
                                <img src={option.logo ? option.logo : option.title} className='rounded-md object-cover w-[25px] h-[25px] mr-5' />
                                <p>{option.title}</p>
                            </Link>
                        </li>
                    </ul>
                ))
            }
        </div>
    )
}