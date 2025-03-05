"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const today = new Date();
    const date = today.toLocaleDateString();
    const [form, setForm] = useState({
        identite: "",
        role: "",
        email: "",
        autorisation: 0,
        date: date,
        password: "",
        tryPassword: "",
    });

    const submit = async (e) => {
        e.preventDefault()
        // Vérification que tous les champs sont remplis
        if (
            form.identite &&
            form.role &&
            form.email &&
            form.password &&
            form.tryPassword
        ) {
            if (form.password === form.tryPassword) {
                try {
                    // Appel à l'API interne pour l'inscription
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/signup`, { form });
                    setMessage(response.data.message);
                    console.log(response.data);
                    router.push("/login");
                } catch (e) {
                    setMessage(e.response?.data?.message || "Erreur lors de l'inscription");
                }
            } else {
                setMessage("Mot de pass incorrect");
            }
        } else {
            setMessage("Veuillez remplir tous les champs");
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-screen">
            <form onSubmit={submit} className="sm:w-[600px] w-[80vw]">
                <h1 className="text-center mb-5 text-2xl">Inscription</h1>
                <div>
                    <MyInput
                        value={form.identite}
                        label="Identité"
                        onChange={(e) =>
                            setForm({ ...form, identite: e.target.value })
                        }
                    />
                    <div className="sm:mb-5 mb-2">
                        <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">
                            Rôle
                        </label>
                        <select
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value })
                            }
                            className={`${form.role === "" ? "text-gray-400" : "text-gray-700"
                                } block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500`}
                        >
                            <option className="hidden" value="">
                                Choisissez votre rôle
                            </option>
                            <option className="text-gray-700" value="Administration">
                                Administration
                            </option>
                            <option className="text-gray-700" value="Blogeur">
                                Blogeur
                            </option>
                            <option className="text-gray-700" value="Produit">
                                Produit
                            </option>
                        </select>
                    </div>
                    <MyInput
                        type="email"
                        value={form.email}
                        label="Adresse e-mail"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                    <MyInput
                        type="password"
                        value={form.password}
                        label="Mot de passe"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                    <MyInput
                        type="password"
                        value={form.tryPassword}
                        label="Confirmer le mot de passe"
                        onChange={(e) =>
                            setForm({ ...form, tryPassword: e.target.value })
                        }
                    />
                </div>
                <div className="justify-between sm:flex w-full">
                    <div className="flex items-center">
                        <p>
                            Vous avez déjà un compte ?{" "}
                            <Link
                                href="/login"
                                className="ml-2 text-blue-500 hover:border-b-[1px] border-blue-500 focus:text-blue-400"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 p-2 rounded-md px-5 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-violet-300"
                    >
                        Inscrire
                    </button>
                </div>
                <div className="text-center mt-5 text-red-400">{message}</div>
            </form>
        </div >
    );
}

export const MyInput = ({ label, value, onChange, onChangeSelect, valueSelect, type, placeholder, title, defaultValue, readOnly, onClick }) => {
    const [showPassword, setShowPassword] = useState(true);

    return (
        <div className={`sm:mb-4 mb-2 relative`} >
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-md">
                {label}
            </label>
            <input
                // disabled={false}
                onClick={onClick}
                readOnly={readOnly}
                defaultValue={defaultValue}
                title={title}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={
                    type == "password"
                        ? showPassword
                            ? "password"
                            : "text"
                        : type
                }
                className="z-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500 text-gray-700"
            />
            {
                label == "Prix" && (
                    <select
                        value={valueSelect}
                        onChange={onChangeSelect}
                        className="absolute right-7 top-7 text-black p-2 bg-transparent outline-none">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                )
            }
            {
                label === "Mot de passe" && (
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-400"
                        type="button"
                    >
                        {showPassword ? (
                            <i className="fa-solid fa-eye text-black"></i>
                        ) : (
                            <i className="fa-solid fa-eye-slash text-black"></i>
                        )}
                    </button>
                )
            }
        </div >
    );
};
