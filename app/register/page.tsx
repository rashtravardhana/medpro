"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      alert("User ID not found");
      return;
    }

    const { error: dbError } = await supabase.from("users").insert([
      {
        id: userId,
        full_name: fullName,
        email: email,
        role: role,
      },
    ]);

    if (dbError) {
      alert(dbError.message);
    } else {
      alert("Account created successfully");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h1 className="text-3xl font-semibold mb-8">Create Account</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">

        <input
          type="text"
          placeholder="Full Name"
          className="border p-3 rounded-lg"
          onChange={(e) => setFullName(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="doctor">Doctor</option>
          <option value="hospital">Hospital</option>
        </select>

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
          onClick={handleRegister}
          className="bg-black text-white py-3 rounded-full hover:opacity-80 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
