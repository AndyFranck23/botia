'use client'

import { useEffect, useState } from "react";
import { parseShortcode, ShortCode } from "./ShortCode";
import axios from "axios";


export default function ModifierFooter() {
    const [columns, setColumns] = useState([]);

    const [finalData, setFinalData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`);
                const data = await response.json()
                // console.log("Données récupérées brutes :", data);

                // Parser les listes pour transformer les chaînes JSON en tableaux réels
                const formattedData = data.map(col => ({
                    ...col,
                    lists: JSON.parse(col.lists) // Convertir la chaîne JSON en tableau
                }));

                console.log("Données formatées :", formattedData);
                setColumns(formattedData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };
        fetchData();
    }, []);

    // Mettre à jour le titre d'une colonne
    const updateColumnTitle = (colIndex, newTitle) => {
        const newColumns = [...columns];
        newColumns[colIndex].title = newTitle;
        setColumns(newColumns);
    };

    // Ajouter une nouvelle liste vide à une colonne
    const addInput = (colIndex) => {
        const newColumns = [...columns];
        newColumns[colIndex].lists.push([]);
        setColumns(newColumns);
    };

    // Ajouter une valeur ou un shortcode dans une colonne spécifique
    const addToList = async (colIndex, listIndex, value) => {
        if (!value.trim()) return;

        const newColumns = [...columns];
        const list = newColumns[colIndex].lists[listIndex];

        if (value.startsWith("[table=")) {
            const parsed = parseShortcode(value);
            if (parsed) {
                const result = await ShortCode({ code: parsed });

                // Vérifier que result est bien un tableau d'objets
                if (Array.isArray(result) && result.length > 0 && typeof result[0] === "object") {
                    list.push(...result); // Ajoute directement les objets à la liste
                } else {
                    alert("Shortcode invalide ou sans données !");
                }
            } else {
                alert("Shortcode invalide !");
            }
        } else {
            list.push(value);
        }

        setColumns(newColumns);
    };

    const removeFromList = (colIndex, listIndex, itemIndex) => {
        const newColumns = [...columns];
        newColumns[colIndex].lists[listIndex].splice(itemIndex, 1);
        setColumns(newColumns);
    };


    // Sauvegarde toutes les colonnes
    const saveAll = async () => {
        setFinalData([...finalData, columns.map(col => ({ title: col.title, lists: col.lists }))]);
        // setColumns(columns.map(col => ({ ...col, lists: [] }))); // Réinitialise les listes
        // ----------------------------------------------------
        // console.log(columns)
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/footer`, { form: columns })
            alert(response.data.message)
        } catch (error) {
            console.log(error)
        }
        // ----------------------------------------------------
    };

    return (
        <div className="p-4 border rounded-xl shadow-md w-full mx-auto text-black">
            <h2 className="text-lg font-bold mb-3">Gestion des Colonnes du footer</h2>

            <div className="flex flex-wrap gap-4 justify-center">
                {columns.map((col, colIndex) => (
                    <div key={colIndex} className="p-2 border rounded bg-gray-100">
                        <label className="text-lg font-medium text-center flex justify-center">Colonne {colIndex + 2} </label>
                        <input
                            type="text"
                            placeholder={`Titre de la colonne ${colIndex + 1}`}
                            value={col.title}
                            onChange={(e) => updateColumnTitle(colIndex, e.target.value)}
                            className="block w-full p-2 border rounded mb-2"
                        />

                        <button
                            onClick={() => addInput(colIndex)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md w-full mb-2"
                        >
                            ➕ Ajouter une liste
                        </button>

                        {col.lists.map((list, listIndex) => (
                            <div key={listIndex} className="mb-4 p-2 border rounded bg-white">
                                <h4 className="font-medium">Liste {listIndex + 1}</h4>
                                <input
                                    type="text"
                                    placeholder="Ajouter une valeur ou shortcode"
                                    className="block w-full p-2 border rounded mb-2"
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            await addToList(colIndex, listIndex, e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                                <ul className="list-disc pl-4">
                                    {list.map((item, itemIndex) => (
                                        <li key={itemIndex} className="">
                                            <div className="flex justify-between items-center text-sm text-gray-700">
                                                {typeof item === "object" ? item.title : item}
                                                <button
                                                    onClick={() => removeFromList(colIndex, listIndex, itemIndex)}
                                                    className="ml-2 px-2 py-1 text-white rounded"
                                                >
                                                    <i className="fa-regular fa-trash-can text-red-500 text-lg"></i>
                                                    {/* 🗑 */}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
                <button
                    onClick={saveAll}
                    className="px-3 py-1 bg-green-500 text-white rounded-md mt-4"
                >
                    ✅ Sauvegarder tout
                </button>
            </div>


            {finalData.length > 0 && (
                <div className="mt-10 text-black flex justify-center">
                    <div className="">
                        <h3 className="font-semibold mb-5">Données sauvegardées :</h3>
                        <div className="flex flex-wrap gap-6">
                            {
                                finalData[0].map((item, index) =>
                                    <div key={index} className="text-white">
                                        <div className="">
                                            <h2 className="text-blue-500 text-lg pb-[30px] font-bold">{item.title}</h2>
                                            <ul className=" list-[circle] pl-5 text-gray-500 space-y-2">
                                                {item.lists.map((page, id) =>
                                                    <div key={id} className="">
                                                        {
                                                            page.map((ele, j) =>
                                                                <li key={j} className="hover:text-gray-400">
                                                                    {
                                                                        ele instanceof Object ?
                                                                            ele.title :
                                                                            ele
                                                                    }
                                                                </li>
                                                            )
                                                        }
                                                        {
                                                            id < item.lists.length - 1 &&
                                                            <div className="w-full my-5">
                                                                <div className="bg-black w-[5vw] h-1 flex justify-center"></div>
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
                    </div>
                </div>
            )}
        </div>
    );
}

