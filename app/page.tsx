"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Home() {

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 CHECK LOGIN + ROLE
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      setUser(currentUser || null);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        setRole(profile?.role?.toLowerCase().trim() || null);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  // ⏳ LOADER
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading MedCareer...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* 🚀 HERO */}
      <section className="text-center px-6 py-28 max-w-6xl mx-auto">

        <h2 className="text-5xl md:text-7xl font-semibold leading-tight">
          The Future of <br /> Medical Careers
        </h2>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          Connect with top hospitals, apply effortlessly, and build your
          medical career with confidence.
        </p>

        <div className="mt-10 flex gap-6 justify-center flex-wrap">

          {/* ❌ NOT LOGGED IN → ONLY ONE BUTTON */}
          {!user && (
            <a
              href="/auth"
              className="px-10 py-4 bg-black text-white rounded-full text-lg hover:scale-105 transition"
            >
              Get Started
            </a>
          )}

          {/* 👨‍⚕️ DOCTOR */}
          {user && role === "doctor" && (
            <a
              href="/dashboard"
              className="px-10 py-4 bg-black text-white rounded-full text-lg hover:scale-105 transition"
            >
              Go to Dashboard
            </a>
          )}

          {/* 🏥 ADMIN */}
          {user && role === "admin" && (
            <a
              href="/admin/dashboard"
              className="px-10 py-4 bg-black text-white rounded-full text-lg hover:scale-105 transition"
            >
              Go to Admin Dashboard
            </a>
          )}

        </div>

      </section>

      {/* 🖼 HERO IMAGE */}
      <section className="px-6">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1600&auto=format&fit=crop"
            alt="Doctor"
            className="w-full h-[420px] object-cover hover:scale-105 transition duration-500"
          />
        </div>
      </section>

      {/* ✨ FEATURES */}
      <section className="px-10 py-28 bg-gray-50">
        <div className="grid md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">

          <div className="p-6 rounded-xl hover:shadow-md transition">
            <img
              src="https://img.icons8.com/ios-filled/80/doctor-male.png"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">
              Built for Doctors
            </h3>
            <p className="text-gray-500 mt-2">
              Find jobs tailored to MBBS, BDS, BAMS and more.
            </p>
          </div>

          <div className="p-6 rounded-xl hover:shadow-md transition">
            <img
              src="https://img.icons8.com/ios-filled/80/hospital.png"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">
              For Hospitals
            </h3>
            <p className="text-gray-500 mt-2">
              Hire qualified professionals quickly and efficiently.
            </p>
          </div>

          <div className="p-6 rounded-xl hover:shadow-md transition">
            <img
              src="https://img.icons8.com/ios-filled/80/artificial-intelligence.png"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">
              Smart Matching
            </h3>
            <p className="text-gray-500 mt-2">
              Get jobs based on your profession and experience.
            </p>
          </div>

        </div>
      </section>

      {/* 🔥 HOW IT WORKS */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">

        <h2 className="text-3xl font-bold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="font-semibold text-lg">1. Create Profile</h3>
            <p className="text-gray-500 mt-2">
              Register and build your professional profile.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">2. Apply Jobs</h3>
            <p className="text-gray-500 mt-2">
              Browse jobs and apply in one click.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">3. Get Hired</h3>
            <p className="text-gray-500 mt-2">
              Track applications and get hired faster.
            </p>
          </div>

        </div>

      </section>

      {/* 🚀 CTA */}
      <section className="py-20 text-center bg-black text-white">

        <h2 className="text-3xl font-bold">
          Start your medical journey today
        </h2>

        <p className="mt-4 text-gray-300">
          Join thousands of healthcare professionals.
        </p>

        <div className="mt-6">

          {!user && (
            <a
              href="/auth"
              className="bg-white text-black px-8 py-3 rounded-full"
            >
              Join Now
            </a>
          )}

          {user && role === "doctor" && (
            <a
              href="/dashboard"
              className="bg-white text-black px-8 py-3 rounded-full"
            >
              Go to Dashboard
            </a>
          )}

          {user && role === "admin" && (
            <a
              href="/admin/dashboard"
              className="bg-white text-black px-8 py-3 rounded-full"
            >
              Go to Admin Dashboard
            </a>
          )}

        </div>

      </section>

      {/* 🔻 FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} MedCareer
      </footer>

    </div>
  );
}
