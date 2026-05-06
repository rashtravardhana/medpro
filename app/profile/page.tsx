"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"

export default function ProfilePage(){

  const [loading,setLoading] = useState(false)

  const [name,setName] = useState("")
  const [profession,setProfession] = useState("")
  const [avatar,setAvatar] = useState<File | null>(null)
  const [avatarUrl,setAvatarUrl] = useState("")
  const [resume,setResume] = useState<File | null>(null)
  const [resumeUrl,setResumeUrl] = useState("")
  const [message,setMessage] = useState("")

  // 🔐 LOAD PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      const { data:{user} } = await supabase.auth.getUser()

      if(!user) return

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id",user.id)
        .single()

      if(data){
        setName(data.name || "")
        setProfession(data.profession || "")
        setAvatarUrl(data.avatar_url || "")
        setResumeUrl(data.resume_url || "")
      }
    }

    loadProfile()
  }, [])

  // 🔥 SAVE PROFILE
  const handleSave = async () => {

    setLoading(true)
    setMessage("")

    const { data:{user} } = await supabase.auth.getUser()

    if(!user){
      setMessage("Login required")
      setLoading(false)
      return
    }

    let avatarPublicUrl = avatarUrl
    let resumePublicUrl = resumeUrl

    // 🖼️ UPLOAD AVATAR
    if(avatar){
      const filePath = `${user.id}/avatar-${Date.now()}`

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath,avatar,{ upsert:true })

      if(error){
        setMessage(error.message)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      avatarPublicUrl = data.publicUrl
    }

    // 📄 UPLOAD RESUME
    if(resume){
      if(resume.type !== "application/pdf"){
        setMessage("Only PDF allowed")
        setLoading(false)
        return
      }

      const filePath = `${user.id}/resume-${Date.now()}`

      const { error } = await supabase.storage
        .from("resumes")
        .upload(filePath,resume,{ upsert:true })

      if(error){
        setMessage(error.message)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath)

      resumePublicUrl = data.publicUrl
    }

    // 💾 UPDATE PROFILE
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        profession,
        avatar_url: avatarPublicUrl,
        resume_url: resumePublicUrl
      })
      .eq("id",user.id)

    if(error){
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage("✅ Profile updated successfully")
    setLoading(false)

    // 🔄 refresh UI (navbar avatar update)
    setTimeout(() => window.location.reload(), 1000)
  }

  return(
    <div className="min-h-screen bg-gray-50 py-16 px-6">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          My Profile
        </h1>

        {/* 🖼️ AVATAR */}
        <div className="flex flex-col items-center mb-6">

          <img
            src={avatarUrl || "https://via.placeholder.com/100"}
            className="w-24 h-24 rounded-full object-cover mb-4 border"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setAvatar(e.target.files?.[0] || null)}
          />

        </div>

        {/* 👤 NAME */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Name</label>
          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* 💼 PROFESSION */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Profession</label>
          <input
            value={profession}
            onChange={(e)=>setProfession(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* 📄 RESUME */}
        <div className="mb-4">

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              className="text-blue-600 underline block mb-2"
            >
              View Current Resume
            </a>
          )}

          <input
            type="file"
            accept=".pdf"
            onChange={(e)=>setResume(e.target.files?.[0] || null)}
          />

        </div>

        {/* 💾 SAVE */}
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-2 rounded mt-4"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="text-center text-sm mt-4 text-gray-600">
            {message}
          </p>
        )}

      </div>

    </div>
  )
}
