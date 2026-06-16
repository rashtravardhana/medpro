'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Link from 'next/link';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    checkUserAndFetch();
  }, []);

  async function checkUserAndFetch() {
    const { data } = await supabase.auth.getUser();
    const currentUser = data?.user;

    if (!currentUser) {
      window.location.href = '/auth';
      return;
    }

    const { data: apps, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        jobs (
          id,
          title,
          hospital_name,
          location,
          salary
        )
      `)
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) console.log('Error:', error.message);

    setApplications(apps || []);
    setLoading(false);
  }

  const filtered = filter === 'all'
    ? applications
    : applications.filter((a) => a.status === filter);

  const getStatusStyle = (status: string) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 animate-pulse text-lg">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1">{applications.length} total applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f} ({f === 'all' ? applications.length : applications.filter((a) => a.status === f).length})
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 mb-4">
              {filter === 'all' ? "You haven't applied to any jobs yet." : `No ${filter} applications.`}
            </p>
            {filter === 'all' && (
              <Link href="/jobs" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Browse Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-6">

                {/* Job Info */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {app.jobs?.title || 'Untitled Job'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {app.jobs?.hospital_name}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-400">📍 {app.jobs?.location}</span>
                      <span className="text-xs text-gray-400">💰 {app.jobs?.salary || 'Not disclosed'}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border capitalize ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* Timeline */}
                <div className="flex items-center mt-4 mb-3">
                  {['Applied', 'Under Review', app.status === 'rejected' ? 'Rejected' : 'Accepted'].map((step, i) => {
                    const isRejected = app.status === 'rejected' && i === 2;
                    const isPast =
                      i === 0 ||
                      (i === 1 && app.status !== 'pending') ||
                      (i === 2 && (app.status === 'accepted' || app.status === 'rejected'));

                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            isRejected
                              ? 'bg-red-100 border-red-400 text-red-600'
                              : isPast
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}>
                            {isPast && !isRejected ? '✓' : isRejected ? '✕' : i + 1}
                          </div>
                          <span className={`text-xs mt-1 text-center whitespace-nowrap ${isPast ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                        {i < 2 && (
                          <div className={`flex-1 h-0.5 mb-5 ${
                            isPast && i < (app.status === 'pending' ? 0 : 2)
                              ? 'bg-blue-400'
                              : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    Applied on {new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <Link href={`/jobs/${app.jobs?.id}`} className="text-sm text-blue-600 hover:underline font-medium">
                    View Job →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
