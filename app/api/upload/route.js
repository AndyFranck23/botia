import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(req, res) {
    try {
        const uploadsDir = path.join(process.cwd(), "public/uploads");

        if (!fs.existsSync(uploadsDir)) {
            console.error("❌ Le dossier 'uploads' n'existe pas !");
            return NextResponse.json({ error: "Dossier 'uploads' non trouvé" }, { status: 500 });
        }

        const files = fs.readdirSync(uploadsDir); // Utiliser la version synchrone
        console.log("✅ Images trouvées :", files);

        return NextResponse.json({ images: files }, { status: 200 });
    } catch (error) {
        console.error("🔥 Erreur serveur :", error);
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier envoyé" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(process.cwd(), "public/uploads", filename);

        await writeFile(filepath, buffer);

        // 🔥 Vérifie que la réponse a bien "location"
        return NextResponse.json({ location: `/uploads/${filename}` });
    } catch (error) {
        console.error("Erreur serveur :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
