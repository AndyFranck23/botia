/** @type {import('next').NextConfig} */
const nextConfig = {
    // async redirects() {
    //     return [
    //         {
    //             // Toutes les URL de n'importe quel chemin
    //             source: '/:path*',
    //             // Condition sur l'hôte (disponible sur Vercel et dans certaines configurations)
    //             has: [
    //                 {
    //                     type: 'host',
    //                     value: 'botia.ai',
    //                 },
    //             ],
    //             // Redirection vers la version avec www en conservant le chemin et les paramètres
    //             destination: 'https://www.botia.ai/:path*',
    //             permanent: true,
    //         },
    //     ];
    // },
};

export default nextConfig;
