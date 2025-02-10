export function slugify(title) {
    return title
        .toLowerCase()
        .normalize("NFD") // Normalise les caractères accentués
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/[^a-z0-9\s-]/g, "") // Supprime les caractères spéciaux sauf les espaces et tirets
        .trim() // Supprime les espaces en début et fin
        .replace(/\s+/g, "-"); // Remplace les espaces par des tirets
}