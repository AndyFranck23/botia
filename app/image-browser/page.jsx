'use client'
// pages/image-browser.js
import { useState, useEffect } from "react";

export default function page() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NOM_DE_DOMAIN}/api/upload`) // API pour récupérer les images du dossier uploads
            .then((res) => res.json())
            .then((data) => setImages(data.images))
            .catch((err) => console.error("Erreur de chargement des images", err));
    }, []);

    const selectImage = (src) => {
        if (window.opener && window.fileCallback) {
            window.fileCallback(src, { title: "Image sélectionnée" });
            window.close(); // Fermer la fenêtre après la sélection
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Choisir une image</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={`/uploads/${img}`}
                        alt={`Image ${index}`}
                        style={{ width: "150px", cursor: "pointer", border: "1px solid #ddd" }}
                        onClick={() => selectImage(`/uploads/${img}`)}
                    />
                ))}
            </div>
        </div>
    );
}
