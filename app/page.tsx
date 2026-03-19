"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Home() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };

    getUser();
  }, []);

  // LOADER
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-10 py-6 border-b">
        <h1 className="text-xl font-semibold">MedCareer</h1>

        <div className="space-x-6 text-sm text-gray-600">

          {user ? (
            <>
              <a href="/jobs" className="hover:text-black">Explore Jobs</a>
              <a href="/post-job" className="hover:text-black">Post Job</a>

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <a href="/auth" className="hover:text-black">
              Login / Register
            </a>
          )}

        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-28">
        <h2 className="text-6xl font-semibold max-w-4xl mx-auto">
          The Future of Medical Careers.
        </h2>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          A modern platform connecting healthcare professionals with the right opportunities.
        </p>

        <div className="mt-10 flex gap-6 justify-center flex-wrap">
          {!user ? (
            <>
              <a href="/auth" className="px-8 py-3 bg-black text-white rounded-full">
                Get Started
              </a>

              <a href="/auth" className="px-8 py-3 border rounded-full">
                Login
              </a>
            </>
          ) : (
            <>
              <a href="/jobs" className="px-8 py-3 bg-black text-white rounded-full">
                Explore Jobs
              </a>

              <a href="/post-job" className="px-8 py-3 border rounded-full">
                Post Job
              </a>
            </>
          )}
        </div>
      </section>

      {/* HERO IMAGE (FIXED) */}
      <section className="px-6">
        <img
          src="https://images.unsplash.com/photo-1584515933487-779824d29309"
          className="w-full h-[400px] object-cover rounded-2xl"
          alt="Doctor using laptop"
        />
      </section>

      {/* FEATURES */}
      <section className="px-10 py-24">
        <div className="grid md:grid-cols-3 gap-12 text-center">

          {/* ✅ FIXED IMAGE 1 */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118"
              className="rounded-xl mb-4 h-48 w-full object-cover"
              alt="Doctor"
            />
            <h3 className="text-xl font-semibold">Built for Doctors</h3>
            <p className="text-gray-500 mt-2">
              Find jobs that match your profession — MBBS, BDS, BAMS and more.
            </p>
          </div>

          {/* ✅ FIXED IMAGE 2 */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
              className="rounded-xl mb-4 h-48 w-full object-cover"
              alt="Hospital"
            />
            <h3 className="text-xl font-semibold">For Hospitals</h3>
            <p className="text-gray-500 mt-2">
              Hire qualified professionals quickly and efficiently.
            </p>
          </div>

          {/* ✅ WORKING IMAGE */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b"
              className="rounded-xl mb-4 h-48 w-full object-cover"
              alt="Lab"
            />
            <h3 className="text-xl font-semibold">Smart Matching</h3>
            <p className="text-gray-500 mt-2">
              Jobs tailored based on your profession and preferences.
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
