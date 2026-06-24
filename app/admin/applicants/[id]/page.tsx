'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import supabase from '@/lib/supabase';
import Link from 'next/link';

export default function ApplicantsPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [applications, setApplications] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    if (jobId) fetchApplications();
  }, [jobId]);

  async function fetchApplications() {
    setLoading(true);

    // Get job title
    const { data: job } = await supabase
      .from('jobs')
      .select('title')
      .eq('id', jobId)
      .single();

    setJobTitle(job?.title || '');

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('APPLICATION ERROR:', error);
      setLoading(false);
      return;
    }

    // Fetch profiles for each applicant
    const updated = await Promise.all(
      (data || []).map(async (app) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role, profession, resume_url, avatar_url')
          .eq('id', app.user_id)
          .maybeSingle();

        return { ...app, profile };
      })
    );

    setApplications(updated);
    setLoading(false);
  }

  async function updateStatus(appId: string, userId: string, status: string) {
    setUpdating(appId);

    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', appId);

    if (error) {
      console.log(error);
      setUpdating(null);
      return;
    }

    // Send notification to doctor
    await supabase.from('notifications').insert({
      user_id: userId,
      title: status === 'accepted' ? '🎉 Application Accepted!' : 'Application Update',
      message: status === 'accepted'
        ? `Congratulations! Your application for "${jobTitle}" has been accepted.`
        : `Your application for "${jobTitle}" was not selected this time. Keep applying!`,
    });

    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );

    setUpdating(null);
  }

  const filtered = filter === 'all'
    ? applications
    : applications.filter((a) => a.status === filter);

  const getStatusStyle = (status: string) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-500 mt-1">
            {jobTitle} · {applications.length} applicants
          </p>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-400">
              No {filter !== 'all' ? filter : ''} applicants found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition"
              >
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {app.profile?.avatar_url ? (
                      <img
                        src={app.profile.avatar_url}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        alt={app.profile?.name}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                        {app.profile?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {app.profile?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.profile?.profession || 'No profession listed'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Applied {new Date(app.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize flex-shrink-0 ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* Links */}
                <div className="flex gap-4 mt-4">
                  {app.profile?.resume_url ? (
                    <a
                      href={app.profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      📄 View Resume
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">No resume uploaded</span>
                  )}
                  <Link
                    href={`/admin/doctor/${app.user_id}`}
                    className="text-sm text-indigo-600 hover:underline font-medium"
                  >
                    👤 Full Profile
                  </Link>
                </div>

                {/* Action Buttons — only show for pending */}
                {app.status === 'pending' && (
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => updateStatus(app.id, app.user_id, 'accepted')}
                      disabled={updating === app.id}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {updating === app.id ? 'Updating...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, app.user_id, 'rejected')}
                      disabled={updating === app.id}
                      className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {updating === app.id ? 'Updating...' : 'Reject'}
                    </button>
                  </div>
                )}

                {/* Already decided — show undo option */}
                {app.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(app.id, app.user_id, 'pending')}
                    disabled={updating === app.id}
                    className="mt-4 text-xs text-gray-400 hover:text-gray-600 hover:underline transition"
                  >
                    Undo decision
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
