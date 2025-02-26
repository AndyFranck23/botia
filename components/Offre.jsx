'use client';

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { slugify } from "./Slug";

export const Offre = ({ data, className, classements, produits }) => {
    return (
        <>
            <div className={`${className ? "" : "flex justify-center w-full"}`}>
                {/* <div className=""> */}
                {/* {path ? <h1 className='text-gray-600 text-3xl text-center font-bold my-10 '>{type + ': ' + path} </h1> : <h1 className='text-gray-600 text-3xl text-center font-bold my-10 '>Acceuil </h1>} */}
                <div className={`${className ? "" : " flex flex-wrap gap-8 justify-around mx-5 w-full"}`}>
                    {data.map((item, index) =>
                        <Chatbot produits={produits} key={index} data={item} classements={classements} className={"w-full xs:w-[400px]"} />
                    )}
                </div>
                {/* </div> */}
            </div>
        </>
    )
}

export const navigation = (pageName, classements) => {
    let out = '';
    classements.forEach((element) => {
        element.classement.forEach((ele) => {
            if (ele.title === pageName.title) {
                out = element.title;
            }
        });
    });
    return process.env.NEXT_PUBLIC_SITE_URL + "/class" + "/" + out.toLowerCase() + "/" + slugify(pageName.title);
};

export const Chatbot = ({ data, className, classements, produits }) => {
    // const prod = 

    return (
        <div className={`grid grid-rows-[auto_50px] hover:scale-102 transition-all duration-300  hover:border-blue-600 border border-blue-100 rounded-xl shadow-lg my-3 w-full lg:w-[300px] xs:w-[350px]  ${className}`}>
            <div className="">
                <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit + "/" + data.slug}>
                    {/* Image en pleine largeur  */}
                    <div className="w-full">
                        <img src={data?.image ? data?.image : data?.title} className="w-full h-46 object-cover group-hover:scale-105 transition-transform duration-300" alt={data.title} />
                    </div>
                </Link>
                <div className="flex p-4 w-full justify-between">
                    <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit + "/" + data.slug}>
                        <h2 className='text-2xl font-bold text-gray-800 group-hover:text-white w-full'>{data.title}</h2>
                    </Link>
                    <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit} className="bg-gray-100 p-2 rounded-xl border font-bold text-green-600 flex justify-end">
                        {
                            data.id_produit
                        }
                    </Link>
                </div>

                {/* Section description de l'offre court */}
                <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit + "/" + data.slug}>
                    <div className="w-full pb-3">
                        <p className='font-medium text-sm text-gray-700 px-3 py-1 rounded-lg inline-flex items-center justify-center text-center'>
                            {data.descriptionOC}
                        </p>
                    </div>
                </Link>

                {/* Section tous les classements */}
                <div className="px-4 flex flex-wrap gap-2 list-none w-full text-white text-xs sm:text-sm">
                    {data.classement.map((item, index) => (
                        <Link
                            href={navigation(item, classements)}
                            key={index}
                            className="px-3 py-1 text-sm border-2 border-blue-200 text-blue-600 rounded-full group-hover:border-white/50 group-hover:text-white hover:bg-blue-600 hover:text-white transition-all"
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>
            <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit + "/" + data.slug} className=" border border-blue-100 rounded-b-xl grid place-items-center">
                <div className="text-xs sm:text-sm " >
                    <p className='text-xl text-gray-800 font-medium'>A partir de {data.prix}$</p>
                </div>
            </Link>
        </div>
    );
};


export const Pagination = ({ data = [], classements, produits }) => {
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
            <Offre data={currentItems} classements={classements} produits={produits} />

            {totalPages > 1 && (
                <div className="flex my-10 justify-center">{renderPageNumbers()}</div>
            )}
        </div>
    );
};

// c1959485c

// export const Chatbot = ({ data, className, classements }) => {

//     return (
// <div className={`grid grid-rows-[auto_40px] hover:scale-105 hover:bg-gray-100 transition-all duration-300 bg-white  border border-gray-200 rounded-xl shadow-lg my-3 ${className}`}>
//     <div className="">
//         <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit + "/" + data.slug}>
//             {/* Section image et titre */}
//             <div className="flex items-center px-4 pt-4">
//                 <img src={data.image ? data.image : data.title} className='mr-4 w-[65px] h-[65px] rounded-lg shadow-sm' alt={data.title} />
//                 <div className="space-y-2">
//                     <h2 className='text-2xl text-black font-bold'>{data.title}</h2>
//                 </div>
//             </div>
//             {/* Section description de l'offre court */}
//             <div className="w-full pb-3">
//                 <p className='font-medium text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg inline-flex items-center justify-center text-center'>
//                     {data.descriptionOC}
//                 </p>
//             </div>
//         </Link>
//         {/* Section tous les classements */}
//         <div className="px-4 flex flex-wrap gap-2 list-none w-full text-white text-xs sm:text-sm">
//             {data.classement.map((item, index) => (
//                 <Link
//                     href={navigation(item, classements)}
//                     key={index}
//                     className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300'
//                 >
//                     {item.title}
//                 </Link>
//             ))}
//         </div>
//     </div>
//     <Link href={process.env.NEXT_PUBLIC_SITE_URL + "/" + data.id_produit + "/" + data.slug}>
//         <div className="h-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-xl grid place-items-center">
//             <div className="text-xs sm:text-sm " >
//                 <p className='text-xl text-white font-medium'>From ${data.prix} </p>
//             </div>
//         </div>
//     </Link>
// </div>
//     );
// };