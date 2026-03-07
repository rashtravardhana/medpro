"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function ApplicationsPage() {

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchApplications = async () => {

      const { data } = await supabase
        .from("applications")
        .select("*");

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">

      <h1 className="text-3xl font-semibold mb-8">
        My  Applications
      </h1>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="border p-4 rounded-lg mb-4">
            Job ID: {app.job_id}
            <br />
            Status: {app.status}
          </div>
        ))
      )}

    </div>
  );
}
