'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) { router.push('/auth'); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      router.push('/');
      return;
    }

    setAdminName(profile.name || 'Admin');

    // Fetch jobs
    const { data: jobsData, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('admin_id', user.id)
      .order('created_at', { ascending: false });

    if (error) { console.log(error); setLoading(false); return; }

    const ids = (jobsData || []).map((j) => j.id);

    // Get all applications for admin's jobs
    const { data: allApps } = ids.length > 0
      ? await supabase
          .from('applications')
          .select('status, job_id')
          .in('job_id', ids)
      : { data: [] };

    const apps = allApps || [];

    setTotalApplicants(apps.length);
    setTotalAccepted(apps.filter((a) => a.status === 'accepted').length);
    setTotalPending(apps.filter((a) => a.status === 'pending').length);

    // Add applicant count to each job
    const jobsWithCounts = (jobsData || []).map((job) => ({
      ...job,
      applicantsCount: apps.filter((a) => a.job_id === job.id).length,
      pendingCount: apps.filter((a) => a.job_id === job.id && a.status === 'pending').length,
    }));

    setJobs(jobsWithCounts);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 animate-pulse text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {adminName} 👋
            </h1>
            <p className="text-gray-500 mt-1">Manage your job postings and applicants</p>
          </div>
          <Link
            href="/post-job"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition text-sm"
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jobs Posted', value: jobs.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Applicants', value: totalApplicants, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Pending Review', value: totalPending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Accepted', value: totalAccepted, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-5`}>
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { href: '/post-job', label: 'Post a Job', icon: '➕', color: 'bg-blue-600 text-white' },
            { href: '/admin/analytics', label: 'View Analytics', icon: '📊', color: 'bg-white border border-gray-200 text-gray-700' },
            { href: '/admin/jobs', label: 'Manage Jobs', icon: '📋', color: 'bg-white border border-gray-200 text-gray-700' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.color} rounded-xl p-4 text-center font-medium text-sm hover:opacity-90 transition`}
            >
              <span className="text-2xl block mb-1">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-800 text-lg">Your Posted Jobs</h2>
            <Link href="/admin/jobs" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-3">No jobs posted yet.</p>
              <Link
                href="/post-job"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{job.title}</h3>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        📍 {job.location}
                      </span>
                      <span className="text-xs text-gray-400">
                        🕐 {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    {job.pendingCount > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                        {job.pendingCount} pending
                      </span>
                    )}
                    <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                      {job.applicantsCount} total
                    </span>
                    <Link
                      href={`/admin/applicants/${job.id}`}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
