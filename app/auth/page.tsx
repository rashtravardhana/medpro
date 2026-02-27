"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setMessage("This email is already registered. Please sign in instead.");
        } else {
          setMessage(error.message);
        }
        return;
      }

      const userId = data.user?.id;

      if (userId) {
        await supabase.from("users").insert([
          {
            id: userId,
            full_name: fullName,
            email: email,
            role: "doctor",
          },
        ]);
      }

      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md p-10 border border-neutral-200 rounded-2xl shadow-sm">

        <h1 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-black"
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:ring-1 focus:ring-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {message}
          </div>
        )}

        <button
          onClick={handleAuth}
          className="w-full bg-black text-white py-3 rounded-full hover:opacity-80 transition"
        >
          {isLogin ? "Sign In" : "Register"}
        </button>

        <p
          className="mt-6 text-center text-sm text-neutral-500 cursor-pointer hover:text-black transition"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin
            ? "Don't have an account? Create one"
            : "Already have an account? Sign in"}
        </p>

      </div>
    </div>
  );
}
