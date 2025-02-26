"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { slugify } from "./Slug";

const Faq = ({ classements }) => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const [activeId, setActiveId] = useState(null);

  // Extraction et transformation des FAQ
  const faqData = classements
    .filter((item) => slug === slugify(item.title) && item.faq)
    .flatMap((item) =>
      JSON.parse(item.faq).map((elt, index) => ({
        id: index,
        question: elt.question,
        answer: elt.answer,
      }))
    );


  // Fonction pour ouvrir ou fermer une FAQ
  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <>
      {faqData.length > 0 && (
        <div className="flex items-center justify-center py-10 mx-10">
          <div className="max-w-3xl w-full p-6 bg-white rounded-lg">
            <h3 className="text-2xl font-bold text-center mb-6 text-blue-700 sm:block hidden">
              FAQ
            </h3>
            <div className="space-y-4">
              {faqData.map((faq) => (
                <div key={faq.id} className="rounded-md overflow-hidden">
                  {/* Question */}
                  <button
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-100 focus:outline-none"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <span className="text-lg font-medium">{faq.question}</span>
                    <span className="mt-1 text-xs">
                      {activeId === faq.id ? (
                        <i className="fa-solid fa-chevron-down"></i>
                      ) : (
                        <i className="fa-solid fa-chevron-up"></i>
                      )}
                    </span>
                  </button>

                  {/* Réponse */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${activeId === faq.id ? "max-h-[500px] p-4 bg-gray-50" : "max-h-0"
                      }`}
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                  <hr className="border-black" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Faq;
