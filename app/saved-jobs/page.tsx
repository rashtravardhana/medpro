'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import Link from 'next/link';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  async function fetchSaved() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/auth';
      return;
    }

    const { data } = await supabase
      .from('saved_jobs')
      .select('id, job_id, jobs(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setSavedJobs(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse text-lg">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-500 mt-1">{savedJobs.length} saved</p>
        </div>

        {/* Empty State */}
        {savedJobs.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <p className="text-gray-500 mb-4">No saved jobs yet.</p>
            <Link
              href="/jobs"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((s) => (
              <JobCard key={s.id} job={s.jobs} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
