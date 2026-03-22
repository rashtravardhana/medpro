"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function AuthPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("doctor");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/jobs");
        }
      }
    };

    checkUser();
  }, []);

  // 🔐 REGISTER
  const handleRegister = async () => {

    setMessage("");
    setLoading(true);

    if (!name || !email || !password) {
      setMessage("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (role === "doctor" && !profession) {
      setMessage("Please select profession");
      setLoading(false);
      return;
    }

    // 🔥 SIGN UP
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {

      // ✅ CHECK IF PROFILE EXISTS (IMPORTANT FIX)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            name,
            role,
            profession: role === "doctor" ? profession : null
          });

        if (profileError) {
          setMessage(profileError.message);
          setLoading(false);
          return;
        }
      }

      setMessage("✅ Registration successful. Now login.");

      // RESET
      setName("");
      setEmail("");
      setPassword("");
      setProfession("");
    }

    setLoading(false);
  };

  // 🔐 LOGIN
  const handleLogin = async () => {

    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // GET ROLE
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    // REDIRECT
    if (profile?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/jobs");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-8 glass soft-shadow fade-up">

        <h1 className="text-3xl font-semibold mb-6 text-center">
          Login / Register
        </h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* ROLE */}
        <select
          className="w-full border p-3 rounded mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="doctor">Doctor</option>
          <option value="admin">Hospital Admin</option>
        </select>

        {/* 👨‍⚕️ ONLY DOCTOR */}
        {role === "doctor" && (
          <select
            className="w-full border p-3 rounded mb-4"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          >
            <option value="">Select Profession</option>
            <option value="MBBS">MBBS</option>
            <option value="BDS">BDS</option>
            <option value="BAMS">BAMS</option>
            <option value="BHMS">BHMS</option>
            <option value="BUMS">BUMS</option>
            <option value="Nursing">Nursing</option>
            <option value="Allied Healthcare">Allied Healthcare</option>
          </select>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full btn-primary mb-3 disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        {/* REGISTER */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full btn-secondary disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Register"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-red-500">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
