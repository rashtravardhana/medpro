"use client"

import { useState } from "react"
import supabase from "@/lib/supabase"

export default function ProfilePage(){

const [file,setFile] = useState<File | null>(null)
const [loading,setLoading] = useState(false)

const uploadResume = async () => {

setLoading(true)

const { data:{user} } = await supabase.auth.getUser()

if(!user){
alert("Login required")
setLoading(false)
return
}

if(!file){
alert("Please select a file")
setLoading(false)
return
}

/* Create unique file path */
const filePath = `${user.id}/${Date.now()}-${file.name}`

/* Upload file */
const { error } = await supabase.storage
.from("resumes")
.upload(filePath,file)

if(error){
alert(error.message)
setLoading(false)
return
}

/* Get public URL */
const { data } = supabase.storage
.from("resumes")
.getPublicUrl(filePath)

/* Save URL in profiles table */
const { error: updateError } = await supabase
.from("profiles")
.update({
resume_url:data.publicUrl
})
.eq("id",user.id)

if(updateError){
alert(updateError.message)
setLoading(false)
return
}

alert("Resume uploaded successfully")

setLoading(false)

}

return(

<div className="p-10">

<h1 className="text-3xl mb-6">
Upload Resume
</h1>

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

</div>

)

}
