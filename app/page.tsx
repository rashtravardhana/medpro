"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Home() {

  const [user, setUser] = useState(null);

  // CHECK LOGIN
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-10 py-6 border-b">

        <h1 className="text-xl font-semibold">
          MedCareer
        </h1>

        <div className="space-x-6 text-sm text-gray-600">

          {/* 👇 SHOW ONLY AFTER LOGIN */}
          {user && (
            <>
              <a href="/jobs" className="hover:text-black">
                Explore Jobs
              </a>

              <a href="/post-job" className="hover:text-black">
                Post Job
              </a>
            </>
          )}

          {/* 👇 SHOW ONLY BEFORE LOGIN */}
          {!user && (
            <a href="/auth" className="hover:text-black">
              Login / Register
            </a>
          )}

        </div>

      </header>

      {/* HERO */}
      <section className="text-center px-6 py-28">

        <h2 className="text-6xl font-semibold leading-tight max-w-4xl mx-auto">
          The Future of Medical Careers.
        </h2>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          A modern platform connecting healthcare professionals with the right opportunities — fast, simple, and efficient.
        </p>

        <div className="mt-10 flex gap-6 justify-center flex-wrap">

          {/* BEFORE LOGIN */}
          {!user && (
            <>
              <a
                href="/auth"
                className="px-8 py-3 bg-black text-white rounded-full"
              >
                Get Started
              </a>

              <a
                href="/auth"
                className="px-8 py-3 border rounded-full"
              >
                Login
              </a>
            </>
          )}

          {/* AFTER LOGIN */}
          {user && (
            <>
              <a
                href="/jobs"
                className="px-8 py-3 bg-black text-white rounded-full"
              >
                Explore Jobs
              </a>

              <a
                href="/post-job"
                className="px-8 py-3 border rounded-full"
              >
                Post Job
              </a>
            </>
          )}

        </div>

      </section>

      {/* HERO IMAGE */}
      <section className="px-6">
        <img
          src="https://images.unsplash.com/photo-1580281657527-47c0b6b3a1f4?q=80&w=1200&auto=format&fit=crop"
          className="w-full h-[400px] object-cover rounded-2xl"
        />
      </section>

      {/* FEATURES */}
      <section className="px-10 py-24">
        <div className="grid md:grid-cols-3 gap-12 text-center">

          <div>
            <img
              src="https://images.unsplash.com/photo-1588776814546-ec7e3f1a8f17?q=80&w=800&auto=format&fit=crop"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold">Built for Doctors</h3>
            <p className="text-gray-500 mt-2">
              Find jobs that match your profession — MBBS, BDS, BAMS and more.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold">For Hospitals</h3>
            <p className="text-gray-500 mt-2">
              Hire qualified professionals quickly and efficiently.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold">Smart Matching</h3>
            <p className="text-gray-500 mt-2">
              Jobs tailored based on your profession and preferences.
            </p>
          </div>

        </div>
      </section>

      {/* SPLIT SECTION */}
      <section className="px-10 py-24 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <h2 className="text-4xl font-semibold">
            Designed for Simplicity
          </h2>
          <p className="text-gray-500 mt-4">
            MedCareer removes complexity from job searching and hiring.
            Everything is designed to be fast, clean, and intuitive.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format&fit=crop"
          className="rounded-2xl w-full h-[300px] object-cover"
        />

      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-24 text-center bg-gray-50">

        <h2 className="text-3xl font-semibold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-lg font-semibold">1. Create Account</h3>
            <p className="text-gray-500 mt-2">
              Sign up and select your profession.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. Explore or Post</h3>
            <p className="text-gray-500 mt-2">
              Doctors explore jobs, hospitals post openings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. Apply or Hire</h3>
            <p className="text-gray-500 mt-2">
              Apply instantly or hire the right candidate.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-6 py-28 bg-black text-white text-center">

        <h2 className="text-4xl font-semibold">
          Start Your Journey Today
        </h2>

        <p className="mt-4 text-gray-300">
          Join MedCareer and unlock better opportunities in healthcare.
        </p>

        {!user && (
          <a
            href="/auth"
            className="inline-block mt-8 px-8 py-3 bg-white text-black rounded-full"
          >
            Register / Login
          </a>
        )}

      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} MedCareer. All rights reserved.
      </footer>

    </div>
  );
}
