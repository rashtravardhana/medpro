"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"

export default function ProfilePage(){

  const [file,setFile] = useState<File | null>(null)
  const [loading,setLoading] = useState(false)
  const [resumeUrl,setResumeUrl] = useState("")
  const [message,setMessage] = useState("")

  // 🔐 Load existing resume
  useEffect(() => {
    const getProfile = async () => {
      const { data:{user} } = await supabase.auth.getUser()

      if(!user) return

      const { data } = await supabase
        .from("profiles")
        .select("resume_url")
        .eq("id",user.id)
        .single()

      if(data?.resume_url){
        setResumeUrl(data.resume_url)
      }
    }

    getProfile()
  }, [])

  const uploadResume = async () => {

    setLoading(true)
    setMessage("")

    const { data:{user} } = await supabase.auth.getUser()

    if(!user){
      setMessage("Login required")
      setLoading(false)
      return
    }

    if(!file){
      setMessage("Please select a file")
      setLoading(false)
      return
    }

    // ✅ FILE TYPE CHECK
    if(file.type !== "application/pdf"){
      setMessage("Only PDF allowed")
      setLoading(false)
      return
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("resumes")
      .upload(filePath,file)

    if(error){
      setMessage(error.message)
      setLoading(false)
      return
    }

    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(filePath)

    if(!data?.publicUrl){
      setMessage("Error getting file URL")
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        resume_url:data.publicUrl
      })
      .eq("id",user.id)

    if(updateError){
      setMessage(updateError.message)
      setLoading(false)
      return
    }

    setResumeUrl(data.publicUrl)
    setMessage("✅ Resume uploaded successfully")
    setLoading(false)
  }

  return(

    <div className="min-h-screen p-10 bg-gray-50">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-semibold mb-6">
          Upload Resume
        </h1>

        {/* 📄 VIEW RESUME */}
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            className="block mb-4 text-blue-600 underline"
          >
            View Current Resume
          </a>
        )}

        <input
          type="file"
          accept=".pdf"
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={uploadResume}
          className="mt-4 bg-black text-white px-6 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-600">
            {message}
          </p>
        )}

      </div>

    </div>

  )

}
