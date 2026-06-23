'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setNotifications(data || []);

      // Mark all as read
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    }

    setLoading(false);
  }

  async function markAllRead() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  }

  async function markOneRead(id: string) {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 animate-pulse">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Empty State */}
        {notifications.length === 0 ? (
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray-400">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markOneRead(n.id)}
                className={`p-5 rounded-xl border cursor-pointer transition ${
                  n.is_read
                    ? 'bg-white border-gray-100'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <p className="font-semibold text-gray-800 text-sm">
                        {n.title}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
