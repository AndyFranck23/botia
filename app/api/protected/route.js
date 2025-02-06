// app/api/protected/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
    const token = cookies().get("authToken")?.value;

    if (!token) {
        return NextResponse.json({ message: "Veuillez vous reconnecter" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return NextResponse.json({ message: "Accès autorisé", user: decoded }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Session invalide ou expirée" }, { status: 408 });
    }
}
