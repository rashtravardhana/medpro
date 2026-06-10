'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Job } from '@/types';

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkSaved();
  }, []);

  async function checkSaved() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', user.id)
      .eq('job_id', job.id)
      .single();

    setSaved(!!data);
  }

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!userId) return;

    if (saved) {
      await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', job.id);
      setSaved(false);
    } else {
      await supabase
        .from('saved_jobs')
        .insert({ user_id: userId, job_id: job.id });
      setSaved(true);
    }
  }

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition text-base truncate">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{job.hospital_name}</p>
          </div>
          {userId && (
            <button
              onClick={toggleSave}
              className="ml-3 text-gray-400 hover:text-blue-600 transition flex-shrink-0"
              title={saved ? 'Unsave job' : 'Save job'}
            >
              <svg
                className={`w-5 h-5 ${saved ? 'fill-blue-600 text-blue-600' : 'fill-none'}`}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salary}
          </span>
        </div>

        <div className="flex gap-2 mt-auto">
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
            {job.type}
          </span>
          <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
            {job.profession}
          </span>
        </div>
      </div>
    </Link>
  );
}
