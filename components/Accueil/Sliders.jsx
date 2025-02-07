'use client'
import React, { useEffect, useRef, useState } from "react";

const Sliders = () => {
  const slides = [
    { text: "Facebook", link: "https://www.facebook.com", bg: "bg-blue-500" },
    { text: "WhatsApp", link: "https://www.whatsapp.com", bg: "bg-green-500" },
    { text: "Email", link: "mailto:example@email.com", bg: "bg-yellow-500" },
    { text: "Twitter", link: "https://www.twitter.com", bg: "bg-blue-400" },
    { text: "Instagram", link: "https://www.instagram.com", bg: "bg-pink-500" },
  ];

  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const speed = 1; // Vitesse normale

  useEffect(() => {
    let requestId;
    let currentSpeed = speed;

    const animate = () => {
      if (!isPaused && sliderRef.current) {
        setPosition((prev) => {
          const sliderWidth = sliderRef.current.scrollWidth / 2;
          let newPosition = prev - currentSpeed;

          // Si on a défilé toute la première moitié, on revient au début sans saut
          if (Math.abs(newPosition) >= sliderWidth) {
            return 0; // Réinitialisation fluide
          }
          return newPosition;
        });
      }

      requestId = requestAnimationFrame(animate);
    };

    requestId = requestAnimationFrame(animate);

    // Pause toutes les 5 secondes pendant 2 secondes
    const pauseInterval = setInterval(() => {
      let slowDownInterval = setInterval(() => {
        if (currentSpeed > 0.2) {
          currentSpeed -= 0.05;
        } else {
          clearInterval(slowDownInterval);
          setIsPaused(true);

          setTimeout(() => {
            setIsPaused(false);
            currentSpeed = speed; // Retour à la vitesse normale
          }, 2000);
        }
      }, 100);
    }, 5000);

    return () => {
      cancelAnimationFrame(requestId);
      clearInterval(pauseInterval);
    };
  }, [isPaused]);

  return (
    <div className="relative w-full overflow-hidden py-6 bg-gray-100">
      <div className="flex w-full max-w-screen-lg mx-auto items-center">
        <div
          ref={sliderRef}
          className="flex space-x-4"
          style={{
            transform: `translateX(${position}px)`,
            transition: isPaused ? "none" : "transform 0.1s linear",
            whiteSpace: "nowrap",
          }}
        >
          {/* Duplication des slides pour une transition fluide */}
          {[...slides, ...slides, ...slides, ...slides, ...slides, ...slides].map((slide, index) => (
            <a
              key={index}
              href={slide.link}
              className={`flex items-center justify-center px-6 py-3 text-white text-lg font-semibold rounded-xl transition-transform hover:scale-105 ${slide.bg}`}
              style={{ minWidth: "200px" }} // Largeur minimale pour chaque slide
            >
              {slide.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sliders;