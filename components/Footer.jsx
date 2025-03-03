'use client';

import Link from "next/link";
import { slugify } from "./Slug";
import { navigation } from "./Offre";

// import React from 'react'
// setColumns(columns.map(col => ({ ...col, lists: [] }))); // Réinitialise les listes


export function Footer({ articles, result, classements, mention }) {
    return (
        <div className="pt-20">
            <footer className="bg-gray-800">
                <div className="flex flex-wrap justify-center gap-8 bg-footer p-5 text-[15px] sm:text-[18px] ">
                    <div className="text-white">
                        <h2 className="text-white pb-[30px] font-bold">TRUCS & ASTUCES DE IA</h2>
                        <ul className=" list-[circle] pl-5 text-gray-200 space-y-2">
                            {articles?.map((page) => (
                                <li key={page.id} className="hover:text-gray-400">
                                    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slugify(page.title)}`}>{page.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {
                        result?.map((item, index) =>
                            <div key={index} className="text-white">
                                <div className="">
                                    <h2 className="text-white pb-[30px] font-bold">{item.title}</h2>
                                    <ul className=" list-[circle] pl-5 text-gray-200 space-y-2">
                                        {JSON.parse(item.lists).map((page, id) =>
                                            <div key={id} className="">
                                                {
                                                    page.map((ele, j) =>
                                                        <li key={j} className="hover:text-gray-400">
                                                            {
                                                                ele instanceof Object ?
                                                                    <Link href={navigation(ele, classements)}>{ele.title}</Link> :
                                                                    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/#`}>{ele}</Link>
                                                            }
                                                        </li>
                                                    )
                                                }
                                                {
                                                    id < JSON.parse(item.lists).length - 1 &&
                                                    <div className="w-full my-10">
                                                        <div className="bg-white w-[9vw] h-1 flex justify-center"></div>
                                                    </div>
                                                }
                                            </div>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                </div>
            </footer>
            <div className="flex justify-center items-center text-center p-5 text-xs sm:text-lg">
                <p>{mention?.title} |
                    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/page`} className="text-blue-500"> Mentions légales</Link>
                </p>
            </div>
        </div>
    )
}
