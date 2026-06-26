'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '@/lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    const currentUser = data?.user;
    setUser(currentUser || null);

    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      setRole(profile?.role?.toLowerCase().trim() || null);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-lg animate-pulse">Loading MedCareer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">

          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🏥 India's Medical Job Platform
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            The Future of <br />
            <span className="text-blue-600">Medical Careers</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with top hospitals, apply effortlessly, and build your
            medical career with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/jobs"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Browse Jobs →
            </Link>

            {!user && (
              <Link
                href="/auth"
                className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
              >
                Get Started Free
              </Link>
            )}

            {user && role === 'doctor' && (
              <Link
                href="/dashboard"
                className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
              >
                My Dashboard
              </Link>
            )}

            {user && role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[
              { label: 'Healthcare Jobs', value: '500+' },
              { label: 'Hospitals & Clinics', value: '100+' },
              { label: 'Doctors Hired', value: '1,000+' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-blue-600">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section className="px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1600&auto=format&fit=crop"
            alt="Medical professionals"
            className="w-full h-[420px] object-cover hover:scale-105 transition duration-700"
          />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Choose MedCareer?
            </h2>
            <p className="text-gray-500">Everything you need to grow your medical career</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '👨‍⚕️',
                title: 'Built for Doctors',
                desc: 'Find jobs tailored to MBBS, BDS, BAMS, Nursing and more professions.',
              },
              {
                icon: '🏥',
                title: 'For Hospitals',
                desc: 'Hire qualified healthcare professionals quickly and efficiently.',
              },
              {
                icon: '🎯',
                title: 'Smart Matching',
                desc: 'Get matched with jobs based on your profession and experience.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-md transition border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-500">Get hired in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '👤',
                title: 'Create Your Profile',
                desc: 'Sign up, upload your resume and fill in your profession and experience.',
              },
              {
                step: '02',
                icon: '🔍',
                title: 'Browse & Apply',
                desc: 'Search jobs by location, profession or hospital and apply in one click.',
              },
              {
                step: '03',
                icon: '🎉',
                title: 'Get Hired',
                desc: 'Hospitals review your profile and notify you when accepted.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-blue-400 tracking-widest">
                  STEP {item.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR DOCTORS ── */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider">
              FOR DOCTORS
            </span>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Your next opportunity is waiting
            </h2>
            <p className="text-blue-100 leading-relaxed mb-8">
              Browse hundreds of verified medical jobs across India. Apply instantly,
              track your applications and get notified when hospitals respond.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Search jobs by profession, location and salary',
                'One-click apply with your uploaded resume',
                'Real-time notifications on application status',
                'Save jobs and apply later',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-white text-sm">
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            <Link
              href="/jobs"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Find Jobs Now →
            </Link>
          </div>

          {/* Sample Job Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg">🏥</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Senior Cardiologist</p>
                <p className="text-gray-400 text-xs">Apollo Hospital · Mumbai</p>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">Full-time</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">MBBS</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-5">
              <span>📍 Mumbai</span>
              <span>💰 ₹1.5L/month</span>
            </div>
            <div className="w-full bg-blue-600 text-white text-sm py-2.5 rounded-xl text-center font-medium">
              Apply Now
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR HOSPITALS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Stats */}
          <div className="bg-gray-50 rounded-2xl p-8 space-y-5">
            {[
              { label: 'Jobs Posted', value: '500+', color: 'text-blue-600' },
              { label: 'Applications Received', value: '2,000+', color: 'text-purple-600' },
              { label: 'Successful Hires', value: '1,000+', color: 'text-green-600' },
              { label: 'Hospitals Registered', value: '100+', color: 'text-orange-500' },
            ].map((s) => (
              <div key={s.label} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <span className="text-gray-500 text-sm">{s.label}</span>
                <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          <div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider">
              FOR HOSPITALS
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Hire qualified medical professionals fast
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Post jobs, review applications and manage your entire hiring
              workflow from one simple dashboard.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Post jobs in minutes with full details',
                'Review doctor profiles and resumes',
                'Accept or reject with one click',
                'Analytics dashboard to track performance',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-gray-600 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            <Link
              href="/auth"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Register Your Hospital →
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY PROFESSION ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Browse by Profession
            </h2>
            <p className="text-gray-500">Find jobs specific to your qualification</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'MBBS', icon: '👨‍⚕️' },
              { name: 'BDS', icon: '🦷' },
              { name: 'Nursing', icon: '👩‍⚕️' },
              { name: 'BAMS', icon: '🌿' },
              { name: 'BHMS', icon: '💊' },
              { name: 'BUMS', icon: '📋' },
              { name: 'Allied Healthcare', icon: '🩺' },
              { name: 'All Jobs', icon: '🔍' },
            ].map((p) => (
              <Link
                key={p.name}
                href={`/jobs`}
                className="bg-white rounded-xl p-5 text-center hover:shadow-md hover:border-blue-200 border border-gray-100 transition group"
              >
                <span className="text-3xl block mb-2">{p.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                  {p.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 bg-gray-900 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start your medical journey today
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of healthcare professionals already using MedCareer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">

            {!user && (
              <>
                <Link
                  href="/auth"
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/jobs"
                  className="bg-white text-gray-800 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  Browse Jobs
                </Link>
              </>
            )}

            {user && role === 'doctor' && (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            )}

            {user && role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Go to Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 border-t border-gray-800 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-bold text-xl">MedCareer</p>
            <p className="text-gray-500 text-sm mt-1">India's Medical Job Platform</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/jobs" className="hover:text-white transition">Browse Jobs</Link>
            <Link href="/auth" className="hover:text-white transition">Login</Link>
            <Link href="/auth" className="hover:text-white transition">Register</Link>
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} MedCareer. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
