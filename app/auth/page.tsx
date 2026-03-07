"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function AuthPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("doctor");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  // REGISTER
  const handleRegister = async () => {

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            name: name,
            role: role
          }
        ]);

      if (profileError) {
        setMessage(profileError.message);
        return;
      }

      setMessage("Registration successful. You can now login.");
    }

  };

  // LOGIN
  const handleLogin = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      setMessage(error.message);
    } else {

      setMessage("Login successful");

      router.push("/jobs");

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">

      <div className="w-full max-w-md p-8 border rounded-xl">

        <h1 className="text-3xl font-semibold mb-6 text-center">
          Login / Register
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="doctor">Doctor</option>
          <option value="admin">Hospital Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded mb-3"
        >
          Login
        </button>

        <button
          onClick={handleRegister}
          className="w-full border py-3 rounded"
        >
          Register
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-neutral-600">
            {message}
          </p>
        )}

      </div>

    </div>
