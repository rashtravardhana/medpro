"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function NotificationsPage() {

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔔 FETCH NOTIFICATIONS
  useEffect(() => {

    const fetchNotifications = async () => {

      // 👤 GET USER
      const { data: userData } =
        await supabase.auth.getUser();

      const user = userData?.user;

      // ❌ NOT LOGGED IN
      if (!user) {
        setLoading(false);
        return;
      }

      // 📥 FETCH NOTIFICATIONS
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      // ❌ ERROR
      if (error) {

        console.log(error);

      } else {

        // ✅ SET DATA
        setNotifications(data || []);

        // ✅ MARK ALL AS READ
        await supabase
          .from("notifications")
          .update({
            is_read: true,
          })
          .eq("user_id", user.id)
          .eq("is_read", false);

      }

      // ✅ STOP LOADING
      setLoading(false);

    };

    fetchNotifications();

  }, []);

  // ⏳ LOADING STATE
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500 animate-pulse">
          Loading notifications...
        </p>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-50 px-5 py-10">

      <div className="max-w-3xl mx-auto">

        {/* 🧾 HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Stay updated with your latest activity
          </p>

        </div>

        {/* ❌ EMPTY STATE */}
        {notifications.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 text-center border shadow-sm">

            <p className="text-gray-500">
              No notifications yet
            </p>

          </div>

        ) : (

          /* 🔔 NOTIFICATIONS LIST */
          <div className="space-y-4">

            {notifications.map((notification) => (

              <div
                key={notification.id}
                className={`bg-white border rounded-3xl p-5 shadow-sm transition

                ${
                  notification.is_read
                    ? "opacity-80"
                    : "border-black"
                }`}
              >

                {/* TOP */}
                <div className="flex justify-between items-start gap-4">

                  {/* CONTENT */}
                  <div>

                    <h2 className="font-semibold text-lg">

                      {notification.title}

                    </h2>

                    <p className="text-gray-600 mt-2 leading-7">

                      {notification.message}

                    </p>

                  </div>

                  {/* 🔴 UNREAD DOT */}
                  {!notification.is_read && (

                    <span className="w-3 h-3 rounded-full bg-green-500 mt-2" />

                  )}

                </div>

                {/* 📅 DATE */}
                <p className="text-xs text-gray-400 mt-5">

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
