'use client';

import Link from "next/link";
import { slugify } from "./Slug";

// import React from 'react'

export function Footer({ articles }) {
    const data1 = [
        { title: 'Célébrer le nouvel an sous les tropiques : destinations balnéaires', lien: '#' },
        { title: 'Réveillon en amoureux : Séjours romantiques et privilégiés pour 2024-2025', lien: '#' },
        { title: 'Réveillon en amoureux : Séjours romantiques et privilégiés pour 2024-2025', lien: '#' },
    ];
    const data2 = [
        { title: 'Célébrer le nouvel an sous les tropiques : destinations balnéaires', lien: '#' },
        { title: 'Réveillon en amoureux : Séjours romantiques et privilégiés pour 2024-2025', lien: '#' },
        { title: 'Réveillon en amoureux : Séjours romantiques et privilégiés pour 2024-2025', lien: '#' },
    ];
    const data3 = [
        { title: 'Generateur video IA', lien: '#' },
        { title: 'Generateur polyvalents IA', lien: '#' },
        { title: "Generateur d'image IA", lien: '#' },
        { title: "Generateur de texte IA", lien: '#' },
    ];

    return (
        <div className="pt-20">
            <footer className="bg-gray-800">
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-4  bg-footer p-5 text-[15px] sm:text-[18px] ">
                    <div className="text-white">
                        <h2 className="text-white pb-[30px] font-bold">TRUCS & ASTUCES DE IA</h2>
                        <ul className=" list-[circle] pl-5 text-gray-200 space-y-2">
                            {articles.map((page) => (
                                <li key={page.id}>
                                    <Link href={`/blog/${slugify(page.title)}`}>{page.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="...">
                        <h2 className="text-white font-bold">DESTINATIONS</h2>
                        <ul className=" list-[circle] pl-5 text-gray-200 space-y-2 ">
                            {data2.map((item, index) => (
                                <li key={index} className="">
                                    <a href={item.lien} className="hover:text-gray-400">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="...">
                        <h2 className="text-white font-bold">TOP BONS PLANS</h2>
                        <ul className=" list-[circle] pl-5 text-gray-200 space-y-2  ">
                            {data3.map((item, index) => (
                                <li key={index} className="">
                                    <a href={item.lien} className="hover:text-gray-400">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* <div className="...">
                        <h2 className="text-white font-bold">CATEGORIES DE VOYAGE</h2>
                        <ul className=" list-[circle] pl-5 text-gray-200 space-y-2 ">
                            {data.map((item, index) => (
                                <li key={index} className="">
                                    <a href={item.lien} className="hover:text-gray-400">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                </div>
            </footer>
            <div className="flex justify-center items-center text-center p-5 text-xs sm:text-lg">
                <p>Bons plans de séjour tout compris, voyage all inclusive et de week-end et vacances tout inclus à tarifs pas chers et en promotion |
                    <a href="/page" className="text-blue-500"> Mentions légales</a>
                </p>
            </div>
        </div>
    )
}
