'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import useAuth from '@/lib/useAuth';
import ProfileProgress from '@/components/ProfileProgress';
import Link from 'next/link';
import type { Profile } from '@/types';

export default function UserDashboard() {
  const { user, loading } = useAuth('doctor');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  async function fetchData() {
    // Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profileData);

    // Applications
    const { data: apps } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        jobs (
          title,
          hospital_name,
          location,
          salary
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const list = apps || [];
    setApplications(list);

    setStats({
      total: list.length,
      accepted: list.filter((a) => a.status === 'accepted').length,
      pending: list.filter((a) => a.status === 'pending').length,
      rejected: list.filter((a) => a.status === 'rejected').length,
    });

    setDataLoading(false);
  }

  async function handleUploadResume(e: any) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.type !== 'application/pdf') {
      setUploadMessage('❌ Please upload a PDF file.');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    const fileName = `${user.id}.pdf`;

    const { error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, { upsert: true });

    if (error) {
      setUploadMessage('❌ Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('resumes').getPublicUrl(fileName);

    await supabase
      .from('profiles')
      .update({ resume_url: data.publicUrl })
      .eq('id', user.id);

    setUploadMessage('✅ Resume uploaded successfully!');
    setProfile((p) => p ? { ...p, resume_url: data.publicUrl } : p);
    setUploading(false);
  }

  const getStatusStyle = (status: string) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your career overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Accepted', value: stats.accepted, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-5`}>
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Applications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-gray-800 text-lg">Recent Applications</h2>
                <Link href="/applications" className="text-sm text-blue-600 hover:underline">
                  View all
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-3">No applications yet</p>
                  <Link
                    href="/jobs"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {app.jobs?.title || 'Untitled Job'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {app.jobs?.hospital_name} · {app.jobs?.location}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <h2 className="font-semibold text-gray-800 mb-4">Upload Resume</h2>

              {profile?.resume_url && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium flex-1">Resume uploaded</span>
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              )}

              <label className="cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition inline-block">
                {uploading ? 'Uploading...' : profile?.resume_url ? 'Replace Resume' : 'Upload Resume (PDF)'}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleUploadResume}
                  disabled={uploading}
                />
              </label>

              {uploadMessage && (
                <p className={`mt-3 text-sm ${uploadMessage.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {uploadMessage}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {profile && <ProfileProgress profile={profile} />}

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: '/jobs', label: 'Browse Jobs', icon: '🔍' },
                  { href: '/saved-jobs', label: 'Saved Jobs', icon: '🔖' },
                  { href: '/applications', label: 'All Applications', icon: '📄' },
                  { href: '/profile', label: 'Update Profile', icon: '👤' },
                  { href: '/notifications', label: 'Notifications', icon: '🔔' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700"
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
