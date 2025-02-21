'use client';
import React, { useEffect, useState } from 'react';

export const Slider = ({ className, types }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((slide) =>
                slide === types.length - 1 ? 0 : slide + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [types.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === types.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? types.length - 1 : prevIndex - 1
        );
    };

    // Calculer les indices à afficher pour les indicateurs
    const getDisplayedIndicators = () => {
        const totalIndicators = types.length;
        if (totalIndicators <= 3) return [...Array(totalIndicators).keys()];

        // Limiter à 3 indicateurs, centrés sur l'élément actuel
        const start = Math.max(0, currentIndex - 1);
        const end = Math.min(totalIndicators, currentIndex + 2);
        const displayed = [...Array(totalIndicators).keys()].slice(start, end);

        // Ajuster si les indices débordent (début ou fin du tableau)
        if (displayed.length < 3) {
            if (currentIndex === 0) {
                return [0, 1, 2];
            } else if (currentIndex === totalIndicators - 1) {
                return [totalIndicators - 3, totalIndicators - 2, totalIndicators - 1];
            }
        }

        return displayed;
    };

    return (
        <div className={`w-full pt-[25px] relative ${className}`}>
            {/* Slides */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {types.map((slide) => (
                        <div key={slide.id} className="flex-shrink-0 h-[300px] md:h-[600px] w-full">
                            <div className="absolute w-full text-center h-[300px] md:h-[600px] items-center flex justify-center ">
                                <h2 className='text-white text-[30px] font-bold ' >{slide.title} </h2>
                            </div>
                            {
                                slide.image != '' ?
                                    <img src={slide.image} className={`h-[300px] md:h-[600px] w-full object-cover`} /> : ""
                            }
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray md:text-[40px] text-[30px] opacity-[0.5] p-2 rounded-full"
            >
                ❮
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray md:text-[40px] text-[30px] opacity-[0.5] p-2 rounded-full"
            >
                ❯
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-4 mb-5 space-x-2">
                {getDisplayedIndicators().map((index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`md:w-3 md:h-3 w-2 h-2 rounded-full ${currentIndex === index ? "bg-black" : "bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
