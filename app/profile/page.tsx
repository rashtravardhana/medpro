'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import ProfileProgress from '@/components/ProfileProgress';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setName(data.name || '');
      setProfession(data.profession || '');
      setAvatarUrl(data.avatar_url || '');
      setResumeUrl(data.resume_url || '');
    }
  }

  async function handleSave() {
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Login required');
      setLoading(false);
      return;
    }

    let avatarPublicUrl = avatarUrl;
    let resumePublicUrl = resumeUrl;

    // Upload Avatar
    if (avatar) {
      const filePath = `${user.id}/avatar-${Date.now()}`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatar, { upsert: true });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatarPublicUrl = data.publicUrl;
      setAvatarUrl(avatarPublicUrl);
    }

    // Upload Resume
    if (resume) {
      if (resume.type !== 'application/pdf') {
        setMessage('Only PDF files are allowed.');
        setLoading(false);
        return;
      }

      const filePath = `${user.id}/resume-${Date.now()}`;

      const { error } = await supabase.storage
        .from('resumes')
        .upload(filePath, resume, { upsert: true });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
      resumePublicUrl = data.publicUrl;
      setResumeUrl(resumePublicUrl);
    }

    // Update Profile
    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        profession,
        avatar_url: avatarPublicUrl,
        resume_url: resumePublicUrl,
      })
      .eq('id', user.id);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // Update local profile for progress bar
    setProfile((p: any) => ({
      ...p,
      name,
      profession,
      avatar_url: avatarPublicUrl,
      resume_url: resumePublicUrl,
    }));

    setMessage('✅ Profile updated successfully!');
    setLoading(false);
    setTimeout(() => window.location.reload(), 1000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm border ${
            message.startsWith('✅')
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Progress */}
        {profile && (
          <div className="mb-6">
            <ProfileProgress profile={profile} />
          </div>
        )}

        {/* Avatar Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                alt="avatar"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-2 border-blue-200">
                {name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <div>
              <label className="cursor-pointer bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition inline-block">
                {avatar ? avatar.name : 'Choose Photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Dr. John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g. Cardiologist"
              />
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Resume</h2>

          {resumeUrl && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-green-700 font-medium flex-1">Resume uploaded</span>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View
              </a>
            </div>
          )}

          <label className="cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition inline-block">
            {resume ? resume.name : resumeUrl ? 'Replace Resume' : 'Upload Resume (PDF)'}
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">PDF only, max 10MB</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
