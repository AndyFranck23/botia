import { slugify } from "../Slug";

export function parseShortcode(input) {
    // L'expression régulière recherche :
    // - (\w+) : une clé composée de caractères alphanumériques (underscore compris)
    // - = 
    // - ([^\s\]]+) : une valeur qui peut contenir n'importe quel caractère sauf un espace ou ]
    const regex = /(\w+)=([^\s\]]+)/g;
    let match;
    const result = {};

    // Parcourt toutes les correspondances
    while ((match = regex.exec(input)) !== null) {
        const key = match[1];
        const value = match[2];
        result[key] = value;
    }
    return result;
}


export async function ShortCode({ code }) {
    try {
        const [classementsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/classements`, { cache: "no-store" }),
        ])

        const [classements] = await Promise.all([classementsRes.json()])

        const classement = classements.filter(item => item.type = slugify(item.type))

        if (code.table == "classements") {
            // console.log(classement)
            if (code.type) {
                return classement.filter(item => item.type == code.type)
            } else {
                return classement
            }
        } else if (code.table === "offres") {
            let url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/${code.table}`;
            const params = [];
            if (code.produit) params.push(`produit=${code.produit}`);
            if (code.classement) params.push(`classement=${code.classement}`);
            if (code.limit) params.push(`limit=${code.limit}`);
            if (params.length > 0) url += '?' + params.join('&');

            const response = await fetch(url);
            const fetchedData = await response.json();
            return fetchedData
        }
    } catch (error) {
        console.log(error)
    }
}