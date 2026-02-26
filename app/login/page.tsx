"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h1 className="text-3xl font-semibold mb-8">Login</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white py-3 rounded-full hover:opacity-80 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
