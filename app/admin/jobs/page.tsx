'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import Link from 'next/link';

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('admin_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.log(error);
    else setJobs(data || []);

    setLoading(false);
  }

  async function handleDelete(jobId: string) {
    const confirmed = confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    setDeleting(jobId);

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) {
      alert('Failed to delete job.');
    } else {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }

    setDeleting(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posted Jobs</h1>
            <p className="text-gray-500 mt-1">{jobs.length} jobs posted</p>
          </div>
          <Link
            href="/admin/post-job"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition text-sm"
          >
            + Post New Job
          </Link>
        </div>

        {/* Empty State */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 mb-4">No jobs posted yet.</p>
            <Link
              href="/admin/post-job"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {job.title}
                    </h2>
                    <p className="text-gray-500 text-sm">{job.hospital_name}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                      {job.type}
                    </span>
                    <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                      {job.profession}
                    </span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>🕐 {new Date(job.created_at).toLocaleDateString()}</span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-5">
                  {job.description}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/admin/applicants/${job.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    View Applicants
                  </button>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deleting === job.id}
                    className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50 ml-auto"
                  >
                    {deleting === job.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
