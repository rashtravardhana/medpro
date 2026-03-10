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

    const { data:{user} } = await supabase.auth.getUser();

    if(!user){
      setMessage("Login required");
      return;
    }

    if(!title || !hospital || !location || !profession){
      setMessage("Please fill all required fields");
      return;
    }

    const { error } = await supabase
      .from("jobs")
      .insert([
        {
          title: title,
          hospital_name: hospital,
          location: location,
          salary: salary,
          description: description,
          profession: profession,
          admin_id: user.id
        }
      ]);

    if (error) {
      console.log(error);
      setMessage("Job posting failed");
    } else {

      setMessage("Job posted successfully");

      setTitle("");
      setHospital("");
      setLocation("");
      setSalary("");
      setDescription("");
      setProfession("");
    }

  };

  return (
    <div className="min-h-screen bg-white px-6 py-20">

      <div className="max-w-xl mx-auto">

        <h1 className="text-3xl font-semibold mb-8">
          Post a Job
        </h1>

        <input
          type="text"
          placeholder="Job Title"
          className="w-full border p-3 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Hospital Name"
          className="w-full border p-3 rounded mb-4"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-3 rounded mb-4"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Salary"
          className="w-full border p-3 rounded mb-4"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        {/* PROFESSION SELECT */}

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
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={postJob}
          className="w-full bg-black text-white py-3 rounded"
        >
          Post Job
        </button>

        {message && (
          <p className="mt-4 text-green-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}
