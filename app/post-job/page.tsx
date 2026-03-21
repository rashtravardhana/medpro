"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

export default function PostJobPage() {

  const [title, setTitle] = useState("");
  const [hospital, setHospital] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [profession, setProfession] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const postJob = async () => {

    setMessage("");
    setLoading(true);

    // 🔐 GET USER
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      setMessage("Please login first");
      setLoading(false);
      return;
    }

    // 🔥 CHECK ROLE (ADMIN ONLY)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      setMessage("Only admin can post jobs");
      setLoading(false);
      return;
    }

    // 🧾 VALIDATION
    if (!title || !hospital || !location || !profession) {
      setMessage("Please fill all required fields");
      setLoading(false);
      return;
    }

    // 📤 INSERT JOB
    const { error } = await supabase
      .from("jobs")
      .insert({
        title,
        hospital_name: hospital,
        location,
        salary,
        description,
        profession,
        admin_id: user.id
      });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // ✅ SUCCESS
    setMessage("Job posted successfully");

    // 🔄 RESET
    setTitle("");
    setHospital("");
    setLocation("");
    setSalary("");
    setDescription("");
    setProfession("");

    setLoading(false);
  };

  return (

    <div className="min-h-screen px-6 py-20">

      <div className="max-w-xl mx-auto glass soft-shadow p-8 fade-up">

        <h1 className="text-3xl font-semibold mb-8 text-center">
          Post a Job
        </h1>

        {/* INPUTS */}

        <input
          type="text"
          placeholder="Job Title"
          className="w-full border p-3 rounded mb-4"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Hospital Name"
          className="w-full border p-3 rounded mb-4"
          value={hospital}
          onChange={(e)=>setHospital(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-3 rounded mb-4"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Salary (optional)"
          className="w-full border p-3 rounded mb-4"
          value={salary}
          onChange={(e)=>setSalary(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded mb-4"
          value={profession}
          onChange={(e)=>setProfession(e.target.value)}
        >
          <option value="">Select Profession</option>
          <option value="MBBS">MBBS</option>
          <option value="BDS">BDS</option>
          <option value="BAMS">BAMS</option>
          <option value="BHMS">BHMS</option>
          <option value="BUMS">BUMS</option>
          <option value="Nursing">Nursing</option>
          <option value="Allied Healthcare">Allied Healthcare</option>
        </select>

        <textarea
          placeholder="Job Description"
          className="w-full border p-3 rounded mb-4"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        {/* BUTTON */}

        <button
          onClick={postJob}
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

        {/* MESSAGE */}

        {message && (
          <p className="mt-4 text-center text-red-500">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
