'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [pathname]);

  // Also listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          fetchProfile();
        } else {
          setProfile(null);
          setUnreadCount(0);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data || null);

      if (data) {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);

        setUnreadCount(count || 0);
      }
    } catch (err) {
      console.log('Navbar fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setUnreadCount(0);
    setDropdownOpen(false);
    window.location.replace('/');
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MedCareer
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Browse Jobs
            </Link>

            {profile?.role === 'doctor' && (
              <>
                <Link
                  href="/applications"
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  Applications
                </Link>
                <Link
                  href="/saved-jobs"
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  Saved Jobs
                </Link>
              </>
            )}

            {profile?.role === 'admin' && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  Admin
                </Link>
                <Link
                  href="/admin/analytics"
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  Analytics
                </Link>
                <Link
                  href="/post-job"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Post Job
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Show Login button only when not loading and no profile */}
            {!loading && !profile && (
              <Link
                href="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Login
              </Link>
            )}

            {/* Show user controls when logged in */}
            {!loading && profile && (
              <>
                {/* Notification Bell */}
                <Link
                  href="/notifications"
                  className="relative text-gray-600 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        className="w-9 h-9 rounded-full object-cover border-2 border-blue-200"
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm border-2 border-blue-200">
                        {profile.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />

                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 text-sm">
                            {profile.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {profile.role}
                          </p>
                        </div>

                        {/* Doctor Links */}
                        {profile.role === 'doctor' && (
                          <>
                            <Link
                              href="/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Dashboard
                            </Link>
                            <Link
                              href="/applications"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              My Applications
                            </Link>
                            <Link
                              href="/saved-jobs"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Saved Jobs
                            </Link>
                          </>
                        )}

                        {/* Admin Links */}
                        {profile.role === 'admin' && (
                          <>
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Admin Dashboard
                            </Link>
                            <Link
                              href="/admin/analytics"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Analytics
                            </Link>
                            <Link
                              href="/post-job"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Post a Job
                            </Link>
                          </>
                        )}

                        {/* Common Links */}
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/notifications"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Notifications
                          {unreadCount > 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>

                        <hr className="my-1" />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
