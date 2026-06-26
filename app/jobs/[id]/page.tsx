'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import supabase from '@/lib/supabase';
import Link from 'next/link';

export default function JobDetail() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [job, setJob] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);

    // Job
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (jobError) {
      console.log(jobError);
      setLoading(false);
      return;
    }

    setJob(jobData);

    // User
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const userId = userData.user.id;

      // Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profileData);
      setRole(profileData?.role?.toLowerCase().trim() || null);

      // Check already applied
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) setAlreadyApplied(true);
    }

    // Related jobs
    const { data: related } = await supabase
      .from('jobs')
      .select('*')
      .neq('id', id)
      .eq('profession', jobData.profession)
      .limit(3);

    setRelatedJobs(related || []);
    setLoading(false);
  }

  async function applyJob() {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) { window.location.href = '/auth'; return; }
    if (role === 'admin') { setMessage('Admins cannot apply for jobs.'); return; }
    if (alreadyApplied) { setMessage('You have already applied for this job.'); return; }
    if (!profile?.resume_url) {
      setMessage('Please upload your resume before applying.');
      return;
    }

    setApplying(true);
    setMessage('');

    const { error } = await supabase
      .from('applications')
      .insert({ job_id: id, user_id: user.id, status: 'pending' });

    if (error) {
      setMessage(error.message);
    } else {
      try {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Application Submitted',
          message: `You applied for ${job.title} at ${job.hospital_name}.`,
        });
      } catch (err) {
        console.log('Notification error');
      }

      setMessage('✅ Application submitted successfully!');
      setAlreadyApplied(true);
    }

    setApplying(false);
  }

  // Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 animate-pulse text-lg">Loading job...</p>
      </div>
    );
  }

  // Not found
  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Job not found.</p>
          <Link href="/jobs" className="text-blue-600 hover:underline">
            Browse all jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Back link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-6"
        >
          ← Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ───── LEFT COLUMN ───── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-gray-500 mt-2 text-lg">
                    {job.hospital_name} · {job.location}
                  </p>
                </div>
                <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium flex-shrink-0">
                  {job.type || 'Full-time'}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  💰 {job.salary || 'Not disclosed'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  🧠 {job.experience || 'Experience N/A'}
                </span>
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  🏥 {job.profession || 'General'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  📍 {job.location}
                </span>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-10">

              {/* Job Overview / Description */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Job Overview
                </h2>
                <p className="text-gray-600 leading-8 whitespace-pre-line">
                  {job.description || 'No description provided.'}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities
                      .split(',')
                      .map((item: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-600"
                        >
                          <span className="text-green-500 mt-0.5 flex-shrink-0">✔️</span>
                          <span className="leading-relaxed">{item.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements
                      .split(',')
                      .map((item: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-600"
                        >
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">🎯</span>
                          <span className="leading-relaxed">{item.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Hospital Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                About the Hospital
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                  🏥
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {job.hospital_name}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    📍 {job.location}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ───── RIGHT SIDEBAR ───── */}
          <div className="space-y-6">

            {/* Apply Card — Sticky */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Apply for this Job
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Posted at {job.hospital_name}
              </p>

              {/* Doctor Apply Button */}
              {role === 'doctor' && (
                <>
                  <button
                    onClick={applyJob}
                    disabled={applying || alreadyApplied}
                    className={`w-full py-3.5 rounded-xl text-white font-semibold transition text-sm ${
                      alreadyApplied
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    {alreadyApplied
                      ? '✅ Already Applied'
                      : applying
                      ? 'Submitting...'
                      : 'Apply Now'}
                  </button>

                  {/* Resume warning */}
                  {!profile?.resume_url && !alreadyApplied && (
                    <p className="mt-3 text-xs text-orange-600 bg-orange-50 border border-orange-100 px-3 py-2 rounded-lg">
                      ⚠️ Please{' '}
                      <Link href="/profile" className="underline font-medium">
                        upload your resume
                      </Link>{' '}
                      before applying.
                    </p>
                  )}
                </>
              )}

              {/* Admin cannot apply */}
              {role === 'admin' && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-500 text-center">
                  Admin accounts cannot apply for jobs.
                </div>
              )}

              {/* Not logged in */}
              {!role && (
                <a
                  href="/auth"
                  className="block text-center bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
                >
                  Login to Apply
                </a>
              )}

              {/* Success / Error Message */}
              {message && (
                <div className={`mt-4 px-4 py-3 rounded-xl text-sm text-center border ${
                  message.startsWith('✅')
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Job Details in sidebar */}
              <div className="mt-6 border-t border-gray-100 pt-5 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">📍 Location</span>
                  <span className="font-medium text-gray-800">{job.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">💼 Job Type</span>
                  <span className="font-medium text-gray-800">{job.type || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">🧠 Experience</span>
                  <span className="font-medium text-gray-800">{job.experience || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">🏥 Profession</span>
                  <span className="font-medium text-gray-800">{job.profession || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">💰 Salary</span>
                  <span className="font-medium text-gray-800">{job.salary || 'Not disclosed'}</span>
                </div>
              </div>

              {/* Share / Save Actions */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Job link copied!');
                  }}
                  className="flex-1 text-center text-sm text-gray-600 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  🔗 Copy Link
                </button>
                <Link
                  href="/jobs"
                  className="flex-1 text-center text-sm text-gray-600 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  ← All Jobs
                </Link>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-5">
                  Similar Jobs
                </h2>
                <div className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <a
                      key={relatedJob.id}
                      href={`/jobs/${relatedJob.id}`}
                      className="block border border-gray-100 rounded-xl p-4 hover:bg-gray-50 hover:border-blue-200 transition group"
                    >
                      <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition">
                        {relatedJob.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {relatedJob.hospital_name}
                      </p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs text-gray-400">
                          📍 {relatedJob.location}
                        </span>
                        {relatedJob.salary && (
                          <span className="text-xs text-gray-400">
                            💰 {relatedJob.salary}
                          </span>
                        )}
                      </div>
                      {relatedJob.type && (
                        <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {relatedJob.type}
                        </span>
                      )}
                    </a>
                  ))}
                </div>

                <Link
                  href="/jobs"
                  className="block text-center text-sm text-blue-600 hover:underline mt-4 font-medium"
                >
                  View all jobs →
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
