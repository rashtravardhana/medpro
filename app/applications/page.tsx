"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function ApplicationsPage() {

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchApplications = async () => {

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          jobs (
            title,
            hospital_name,
            location
          )
        `);

      if (error) {
        console.log(error);
      }

      setApplications(data || []);
      setLoading(false);

    };

    fetchApplications();

  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        Loading applications...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-semibold mb-10">
          My Applications
        </h1>

        {applications.length === 0 ? (

          <p className="text-neutral-500">
            No applications yet.
          </p>

        ) : (

          applications.map((app) => (

            <div
              key={app.id}
              className="border rounded-xl p-6 mb-6"
            >

              <h2 className="text-xl font-semibold">
                {app.jobs?.title}
              </h2>

              <p className="text-neutral-500 mt-1">
                {app.jobs?.hospital_name} • {app.jobs?.location}
              </p>

              <p className="mt-4 text-sm text-neutral-400">
                Status: {app.status}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );

}
