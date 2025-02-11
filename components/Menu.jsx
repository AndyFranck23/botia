'use client'; // Nécessaire pour les hooks React

import { useState } from 'react';
import Link from 'next/link';
import { slugify } from './Slug';

export const Menu = ({ className, classement, page, produits, params }) => {
    const [isActive, setIsActive] = useState(null);

    const showOptions = (index) => {
        setIsActive(prev => prev === index ? null : index);
    }

    return (
        <div className="flex w-screen justify-end">
            <div className={`fixed bg-white w-[250px] h-screen z-40 px-2 pr-5 border-l-2 border-gray-100 mt-[65px] ${className}`}>
                <Link href='/' className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                    Accueil
                </Link>
                <div className="md:hidden">
                    {
                        produits.map(item =>
                            <Link key={item.id} href={`/${slugify(item.title)}`} className='flex justify-between items-center w-full hover:bg-gray-200 p-3 rounded-2xl'>
                                {item.title}
                            </Link>
                        )
                    }
                </div>
                {page && classement.map((option, index) => (
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
                        {isActive === index && <OptionSelect params={params} options={classement} index={index} />}
                    </li>
                ))}
            </div>
        </div>
    )
}

const OptionSelect = ({ index, options, params }) => {
    return (
        <div className="p-2 space-y-2 bg-gray-100 rounded-lg">
            {
                options[index].classement.map((option, i) => (
                    <ul key={i}>
                        <li>
                            <a
                                href={`/${params}/${slugify(options[index].title) + '/' + slugify(option.title)}`}
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