"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function AuthPage() {

  const router = useRouter();

  // 🔁 MODE SWITCH
  const [isLogin, setIsLogin] = useState(true);

  // FORM STATE
  const [name, setName] = useState("");
  const [role, setRole] = useState("doctor");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const handleLogin = async () => {

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // 🔹 GET ROLE
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      setMessage("Error fetching user profile");
      setLoading(false);
      return;
    }

    const role = profile?.role?.toLowerCase().trim();

    // ✅ FIXED REDIRECT
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "doctor") {
      router.push("/dashboard"); // ✅ THIS FIXES YOUR ISSUE
    } else {
      router.push("/jobs");
    }

    setLoading(false);
  };

  // 📝 REGISTER
  const handleRegister = async () => {

    setLoading(true);
    setMessage("");

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
      // SAVE PROFILE
      const { error: insertError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        role: role.toLowerCase().trim(),
        profession: role === "doctor" ? profession : null
      });

      if (insertError) {
        setMessage(insertError.message);
        setLoading(false);
        return;
      }

      setMessage("✅ Registered successfully. Please login.");
      setIsLogin(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-semibold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h1>

        {/* 📝 REGISTER ONLY */}
        {!isLogin && (
          <>
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
                <option value="Nursing">Nursing</option>
              </select>
            )}
          </>
        )}

        {/* 🔐 COMMON FIELDS */}
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

        {/* 🔘 BUTTON */}
        {isLogin ? (
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        ) : (
          <button
            onClick={handleRegister}
            className="w-full bg-black text-white py-3 rounded-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        )}

        {/* 🔁 SWITCH */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-black font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        {/* ❗ MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-red-500">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
