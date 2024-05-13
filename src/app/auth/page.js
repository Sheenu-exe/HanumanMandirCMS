"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../API/firebase.config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import Cookies from "js-cookie";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    const handleAuthAction = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                Cookies.set("isAuthenticated","true")
                
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                Cookies.set("isAuthenticated","true")
   
            }
        } catch (error) {
       
            console.error(error);
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="h-fit w-full border flex flex-col items-center justify-center space-y-4">
                <form onSubmit={handleAuthAction} className={`auth-form transform transition-transform flex flex-col gap-2 duration-500 ${isLogin ? 'rotate-y-0' : 'rotate-y-180'}`}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                <button onClick={handleToggle} className="text-blue-500 hover:underline">
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
};

export default Auth;
