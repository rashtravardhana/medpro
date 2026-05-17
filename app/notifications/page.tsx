"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function NotificationsPage() {

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchNotifications = async () => {

      const { data: userData } = await supabase.auth.getUser();

      const user = userData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setNotifications(data || []);
      }

      setLoading(false);
    };

    fetchNotifications();

  }, []);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 px-6 py-12">

      <div className="max-w-3xl mx-auto">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Stay updated with your activity
          </p>

        </div>

        {notifications.length === 0 ? (

          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border">

            <p className="text-gray-500">
              No notifications yet
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {notifications.map((notification) => (

              <div
                key={notification.id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >

                <div className="flex justify-between items-start gap-4">

                  <div>

                    <h2 className="font-semibold text-lg">
                      {notification.title}
                    </h2>

                    <p className="text-gray-600 mt-1">
                      {notification.message}
                    </p>

                  </div>

                  {!notification.is_read && (
                    <span className="w-3 h-3 rounded-full bg-green-500 mt-2" />
                  )}

                </div>

                <p className="text-xs text-gray-400 mt-4">

                  {new Date(
                    notification.created_at
                  ).toLocaleString()}

                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
