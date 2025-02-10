'use client';

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { slugify } from "./Slug";

export const Offre = ({ data, params, className, classements }) => {
    return (
        <>
            <div className={`${className ? "" : "flex justify-center w-full"}`}>
                <div className="">
                    {/* {path ? <h1 className='text-gray-600 text-3xl text-center font-bold my-10 '>{type + ': ' + path} </h1> : <h1 className='text-gray-600 text-3xl text-center font-bold my-10 '>Acceuil </h1>} */}
                    <div className={`${className ? "" : " flex flex-wrap gap-8 justify-around mx-5"}`}>
                        {data.map((item, index) =>
                            <Chatbot key={index} data={item} classements={classements} params={params} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export const navigation = (pageName, classements, params) => {
    let out = '';
    classements.forEach((element) => {
        element.classement.forEach((ele) => {
            if (ele.title === pageName.title) {
                out = element.title;
            }
        });
    });
    return "/" + params + "/" + out.toLowerCase() + "/" + pageName.slug;
};

export const Chatbot = ({ data, className, params, classements }) => {

    return (
        <>
            <div className={`hover:bg-gray-100 transition-all duration-300 bg-white backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg my-3 w-full xs:w-[400px] ${className}`}>
                <div className="z-40">
                    <Link href={"/" + params + "/" + data.slug} className="flex items-center px-4 pt-4">
                        <img src={data.image} className='mr-4 w-[65px] h-[65px] rounded-lg shadow-sm' alt={data.title} />
                        <div className="space-y-2">
                            <h1 className='text-2xl text-black font-bold'>{data.title}</h1>
                            <p className='font-medium text-sm bg-gray-100 max-w-[200px] text-gray-700 px-3 py-1 rounded-full inline-block'>
                                {data.descriptionOC}
                            </p>
                        </div>
                    </Link>
                    <div className="px-4 py-3 flex flex-wrap gap-2 list-none sm:w-[350px] w-full text-white text-xs sm:text-sm">
                        {data.classement.map((item, index) => (
                            <Link
                                href={navigation(item, classements, params)}
                                key={index}
                                className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300'
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 text-xs sm:text-sm rounded-b-xl">
                    <p className='text-white font-medium text-center'>From ${data.prix} </p>
                </div>
            </div>
        </>
    );
};


export const Pagination = ({ data = [], params, classements }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Nombre d'éléments par page
    const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        const page = parseInt(searchParams.get("page"), 10) || 1;
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }, [searchParams, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            const params = new URLSearchParams(searchParams);
            params.set("page", page);
            router.push(`?${params.toString()}`, { scroll: false });
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);

        if (startPage > 1) {
            pages.push(
                <button key="first" onClick={() => handlePageChange(1)} className="mx-1 px-3 py-1 border rounded-[50px] bg-gray-200">
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="left-ellipsis" className="mx-1 px-3 py-1">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} onClick={() => handlePageChange(i)} className={`mx-1 px-3 py-1 border rounded-[50px] ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="right-ellipsis" className="mx-1 px-3 py-1">...</span>);
            }
            pages.push(
                <button key="last" onClick={() => handlePageChange(totalPages)} className="mx-1 px-3 py-1 border rounded-[50px] bg-gray-200">
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div>
            <Offre data={currentItems} params={params} classements={classements} />

            {totalPages > 1 && (
                <div className="flex my-10 justify-center">{renderPageNumbers()}</div>
            )}
        </div>
    );
};

// c1959485c