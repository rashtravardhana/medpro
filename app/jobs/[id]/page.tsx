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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profileData);
      setRole(profileData?.role?.toLowerCase().trim() || null);

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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 animate-pulse text-lg">Loading job...</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left - Job Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  <p className="text-gray-500 mt-2 text-lg">
                    {job.hospital_name} · {job.location}
                  </p>
                </div>
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  {job.type || 'Full-time'}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  💰 {job.salary || 'Not disclosed'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  🧠 {job.experience || 'Experience N/A'}
                </span>
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  🏥 {job.profession || 'General'}
                </span>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8">

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Job Overview
                </h2>
                <p className="text-gray-600 leading-8 whitespace-pre-line">
                  {job.description || 'No description provided.'}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Responsibilities
                  </h2>
                  <ul className="space-y-2">
                    {job.responsibilities.split(',').map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✔️</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {job.requirements.split(',').map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <span className="text-blue-500 mt-0.5 flex-shrink-0">🎯</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Apply Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Apply for this Job
              </h2>

              {/* Doctor */}
              {role === 'doctor' && (
                <button
                  onClick={applyJob}
                  disabled={applying || alreadyApplied}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold transition ${
                    alreadyApplied
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {alreadyApplied
                    ? '✅ Already Applied'
                    : applying
                    ? 'Submitting...'
                    : 'Apply Now'}
                </button>
              )}

              {/* Admin */}
              {role === 'admin' && (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 text-center">
                  Admin accounts cannot apply for jobs.
                </div>
              )}

              {/* Not logged in */}
              {!role && (
                <Link
                  href="/auth"
                  className="block text-center bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Login to Apply
                </Link>
              )}

              {/* No resume warning */}
              {role === 'doctor' && !profile?.resume_url && !alreadyApplied && (
                <p className="mt-3 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg">
                  ⚠️ Please{' '}
                  <Link href="/profile" className="underline font-medium">
                    upload your resume
                  </Link>{' '}
                  before applying.
                </p>
              )}

              {/* Message */}
              {message && (
                <div className={`mt-4 px-4 py-3 rounded-xl text-sm text-center ${
                  message.startsWith('✅')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Job Info */}
              <div className="mt-6 border-t border-gray-100 pt-5 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>📍 Location</span>
                  <span className="font-medium text-gray-800">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>💼 Type</span>
                  <span className="font-medium text-gray-800">{job.type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>🧠 Experience</span>
                  <span className="font-medium text-gray-800">{job.experience || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>🏥 Profession</span>
                  <span className="font-medium text-gray-800">{job.profession || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Similar Jobs
                </h2>
                <div className="space-y-3">
                  {relatedJobs.map((relatedJob) => (
                    <Link
                      key={relatedJob.id}
                      href={`/jobs/${relatedJob.id}`}
                      className="block border border-gray-100 rounded-xl p-4 hover:bg-gray-50 hover:border-blue-200 transition"
                    >
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {relatedJob.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {relatedJob.hospital_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        📍 {relatedJob.location}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
