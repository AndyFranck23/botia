'use client'

import { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
    const [aggregatedData, setAggregatedData] = useState([]);
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        // Récupérer les données agrégées
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/clicks`) // Remplace par ton endpoint API
            .then((res) => res.json())
            .then((data) => setAggregatedData(data))
            .catch((err) => console.error(err));

        // Récupérer les données temporelles
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/clicks/time`) // Remplace par ton endpoint API
            .then((res) => res.json())
            .then((data) => setTimelineData(data))
            .catch((err) => console.error(err));
    }, []);

    // Préparer le graphique en anneau pour les offres
    const doughnutChartData = {
        labels: aggregatedData.map((item) => item.page),
        datasets: [
            {
                label: "Nombre de clics",
                data: aggregatedData.map((item) => item.clicks),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#8dd3c7",
                    "#d62728",
                    "#9467bd",
                    "#8c564b",
                    "#e377c2",
                ],
                borderWidth: 2,
            },
        ],
    };

    // Préparer le graphique linéaire pour l'évolution quotidienne
    const lineChartData = {
        labels: timelineData.map((item) => item.date),
        datasets: [
            {
                label: "Clics par jour",
                data: timelineData.map((item) => item.clicks),
                fill: false,
                borderColor: "#36A2EB",
                tension: 0.1,
            },
        ],
    };

    // Calcul du total de clics (somme des offres affichées, y compris "Autres")
    const totalClicks = aggregatedData.reduce((sum, item) => sum + item.clicks, 0);

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                📊 Statistiques de Clics
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Graphique en anneau pour les offres */}
                <div className="bg-white p-6 shadow-2xl rounded-2xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        Top Offres Cliquées
                    </h2>
                    <Doughnut data={doughnutChartData} />
                </div>

                {/* Graphique linéaire pour l'évolution temporelle */}
                <div className="bg-white p-6 shadow-2xl rounded-2xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        Evolution Quotidienne
                    </h2>
                    <Line data={lineChartData} />
                </div>
            </div>

            {/* Tableau récapitulatif des données agrégées */}
            <div className="mt-8 bg-white p-6 shadow-xl rounded-lg overflow-x-auto text-black">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-6 py-3 border border-gray-300">Offre</th>
                            <th className="px-6 py-3 border border-gray-300">
                                Nombre de clics
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {aggregatedData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-6 py-3 border border-gray-300 text-center">
                                    {item.page}
                                </td>
                                <td className="px-6 py-3 border border-gray-300 text-center">
                                    {item.clicks}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Affichage du total des clics */}
            <div className="mt-8 text-center">
                <p className="text-xl font-medium">
                    Total de clics : {totalClicks}
                </p>
            </div>
        </div>
    );
}
