"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import supabase from "@/lib/supabase";

export default function JobDetail() {

  const params = useParams();

  const id = Array.isArray(params?.id)

    ? params.id[0]

    : params?.id;

  const [job, setJob] = useState<any>(null);

  const [role, setRole] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [applying, setApplying] = useState(false);

  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // 🔥 NEW

  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);

  const [profile, setProfile] = useState<any>(null);

  // 🔹 FETCH DATA

  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      setLoading(true);

      // 📄 JOB

      const { data: jobData, error: jobError } = await supabase

        .from("jobs")

        .select("*")

        .eq("id", id)

        .single();

      if (jobError) {

        console.log(jobError);

        setLoading(false);

        return;

      }

      setJob(jobData);

      // 👤 USER

      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {

        const userId = userData.user.id;

        // 🔐 PROFILE

        const { data: profileData } = await supabase

          .from("profiles")

          .select("*")

          .eq("id", userId)

          .single();

        setProfile(profileData);

        setRole(

          profileData?.role?.toLowerCase().trim() || null

        );

        // 🔍 CHECK APPLICATION

        const { data: existing } = await supabase

          .from("applications")

          .select("id")

          .eq("job_id", id)

          .eq("user_id", userId)

          .maybeSingle();

        if (existing) {

          setAlreadyApplied(true);

        }

      }

      // 🔥 RELATED JOBS

      const { data: related } = await supabase

        .from("jobs")

        .select("*")

        .neq("id", id)

        .eq("profession", jobData.profession)

        .limit(3);

      setRelatedJobs(related || []);

      setLoading(false);

    };

    fetchData();

  }, [id]);

  // 🔹 APPLY

  const applyJob = async () => {

    const { data } = await supabase.auth.getUser();

    const user = data?.user;

    // 🔐 LOGIN CHECK

    if (!user) {

      window.location.href = "/auth";

      return;

    }

    // ❌ ADMIN CHECK

    if (role === "admin") {

      setMessage("Admins cannot apply");

      return;

    }

    // ❌ DUPLICATE CHECK

    if (alreadyApplied) {

      setMessage("You already applied");

      return;

    }

    // ❌ RESUME CHECK

    if (!profile?.resume_url) {

      setMessage("Please upload resume before applying");

      return;

    }

    setApplying(true);

    setMessage("");

    // 📥 APPLY

    const { error } = await supabase

      .from("applications")

      .insert({

        job_id: id,

        user_id: user.id,

        status: "pending",

      });

    if (error) {

      console.log(error);

      setMessage(error.message);

    } else {

      // 🔔 OPTIONAL NOTIFICATION INSERT

      // only if notifications table exists

      try {

        await supabase

          .from("notifications")

          .insert({

            user_id: user.id,

            title: "Application Submitted",

            message: `You applied for ${job.title}`,

          });

      } catch (err) {

        console.log("Notification table not created yet");

      }

      setMessage("✅ Application submitted successfully");

      setAlreadyApplied(true);

    }

    setApplying(false);

  };

  // ⏳ LOADING

  if (loading) {

    return (

      <div className="h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500 animate-pulse text-lg">

          Loading job...

        </p>

      </div>

    );

  }

  // ❌ NOT FOUND

  if (!job) {

    return (

      <div className="h-screen flex items-center justify-center">

        <p>Job not found</p>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-50 px-5 py-10">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-6">

          {/* 🧾 HEADER */}

          <div className="bg-white rounded-3xl shadow-sm p-8 border">

            <div className="flex items-start justify-between gap-4 flex-wrap">

              <div>

                <h1 className="text-4xl font-bold tracking-tight text-gray-900">

                  {job.title}

                </h1>

                <p className="text-gray-500 mt-3 text-lg">

                  {job.hospital_name} • {job.location}

                </p>

              </div>

              <div className="bg-black text-white px-5 py-2 rounded-full text-sm">

                {job.type || "Full Time"}

              </div>

            </div>

            {/* TAGS */}

            <div className="flex flex-wrap gap-3 mt-6">

              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                💰 {job.salary || "Not disclosed"}

              </span>

              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                🧠 {job.experience || "N/A"}

              </span>

              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                🏥 {job.profession || "General"}

              </span>

            </div>

          </div>

          {/* 📄 DETAILS */}

          <div className="bg-white rounded-3xl shadow-sm p-8 border space-y-10">

            {/* DESCRIPTION */}

            <div>

              <h2 className="text-2xl font-semibold mb-4">

                Job Overview

              </h2>

              <p className="text-gray-700 leading-8 whitespace-pre-line">

                {job.description || "No description"}

              </p>

            </div>

            {/* RESPONSIBILITIES */}

            {job.responsibilities && (

              <div>

                <h2 className="text-2xl font-semibold mb-4">

                  Responsibilities

                </h2>

                <ul className="space-y-3">

                  {job.responsibilities

                    .split(",")

                    .map((item: string, i: number) => (

                    <li

                      key={i}

                      className="flex items-start gap-3 text-gray-700"

                    >

                      <span>✔️</span>

                      <span>{item.trim()}</span>

                    </li>

                  ))}

                </ul>

              </div>

            )}

            {/* REQUIREMENTS */}

            {job.requirements && (

              <div>

                <h2 className="text-2xl font-semibold mb-4">

                  Requirements

                </h2>

                <ul className="space-y-3">

                  {job.requirements

                    .split(",")

                    .map((item: string, i: number) => (

                    <li

                      key={i}

                      className="flex items-start gap-3 text-gray-700"

                    >

                      <span>🎯</span>

                      <span>{item.trim()}</span>

                    </li>

                  ))}

                </ul>

              </div>

            )}

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">

          {/* 🚀 APPLY CARD */}

          <div className="bg-white rounded-3xl shadow-sm border p-6 sticky top-24">

            <h2 className="text-xl font-semibold mb-5">

              Apply for this Job

            </h2>

            {/* APPLY BUTTON */}

            {role === "doctor" && (

              <button

                onClick={applyJob}

                disabled={applying || alreadyApplied}

                className={`w-full py-4 rounded-2xl text-white font-medium transition

                ${

                  alreadyApplied

                    ? "bg-gray-400 cursor-not-allowed"

                    : "bg-black hover:opacity-90"

                }`}

              >

                {alreadyApplied

                  ? "Already Applied"

                  : applying

                  ? "Applying..."

                  : "Apply Now"}

              </button>

            )}

            {/* ADMIN MESSAGE */}

            {role === "admin" && (

              <p className="text-gray-500 text-sm">

                Admin accounts cannot apply for jobs.

              </p>

            )}

            {/* LOGIN */}

            {!role && (

              <a

                href="/auth"

                className="block text-center bg-black text-white py-4 rounded-2xl"

              >

                Login to Apply

              </a>

            )}

            {/* MESSAGE */}

            {message && (

              <div className="mt-4 bg-gray-100 rounded-xl p-3 text-sm text-center text-gray-700">

                {message}

              </div>

            )}

            {/* EXTRA INFO */}

            <div className="mt-6 border-t pt-5 space-y-3 text-sm text-gray-600">

              <p>

                📍 Location:

                <span className="font-medium text-black ml-2">

                  {job.location}

                </span>

              </p>

              <p>

                💼 Type:

                <span className="font-medium text-black ml-2">

                  {job.type || "N/A"}

                </span>

              </p>

              <p>

                🧠 Experience:

                <span className="font-medium text-black ml-2">

                  {job.experience || "N/A"}

                </span>

              </p>

            </div>

          </div>

          {/* 🔥 RELATED JOBS */}

          {relatedJobs.length > 0 && (

            <div className="bg-white rounded-3xl shadow-sm border p-6">

              <h2 className="text-xl font-semibold mb-5">

                Similar Jobs

              </h2>

              <div className="space-y-5">

                {relatedJobs.map((relatedJob) => (

                  <a

                    key={relatedJob.id}

                    href={`/jobs/${relatedJob.id}`}

                    className="block border rounded-2xl p-4 hover:bg-gray-50 transition"

                  >

                    <h3 className="font-semibold">

                      {relatedJob.title}

                    </h3>

                    <p className="text-sm text-gray-500 mt-1">

                      {relatedJob.hospital_name}

                    </p>

                    <p className="text-sm text-gray-500 mt-2">

                      📍 {relatedJob.location}

                    </p>

                  </a>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
