"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { NOM_DE_DOMAIN } from "./env";

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${NOM_DE_DOMAIN}/api/protected`, { withCredentials: true });
                setIsAuthenticated(true);
            } catch (error) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    if (loading) {
        return <div className='w-screen h-screen flex justify-center items-center'>Chargement...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
};

export default ProtectedRoute;