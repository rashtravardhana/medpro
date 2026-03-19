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

  const postJob = async () => {

    setMessage("");

    // GET USER
    const { data, error: userError } = await supabase.auth.getUser();
    const user = data?.user;

    if (userError || !user) {
      setMessage("❌ Login required");
      return;
    }

    // VALIDATION
    if (!title || !hospital || !location || !profession) {
      setMessage("❌ Please fill all required fields");
      return;
    }

    // INSERT JOB
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
      console.log("Supabase Error:", error);
      setMessage(`❌ ${error.message}`);
      return;
    }

    // SUCCESS
    setMessage("✅ Job posted successfully");

    setTitle("");
    setHospital("");
    setLocation("");
    setSalary("");
    setDescription("");
    setProfession("");
  };

  return (

    <div className="min-h-screen bg-gray-50 text-black px-6 py-20">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-semibold mb-8 text-center">
          Post a Job
        </h1>

        <input
          type="text"
          placeholder="Job Title"
          className="w-full border p-3 rounded mb-4 text-black"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Hospital Name"
          className="w-full border p-3 rounded mb-4 text-black"
          value={hospital}
          onChange={(e)=>setHospital(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-3 rounded mb-4 text-black"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Salary"
          className="w-full border p-3 rounded mb-4 text-black"
          value={salary}
          onChange={(e)=>setSalary(e.target.value)}
        />

        {/* PROFESSION */}
        <select
          className="w-full border p-3 rounded mb-4 text-black"
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
          className="w-full border p-3 rounded mb-4 text-black"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <button
          onClick={postJob}
          className="w-full bg-black text-white py-3 rounded hover:opacity-80"
        >
          Post Job
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">
            {message}
          </p>
        )}

      </div>

    </div>

  );
}
