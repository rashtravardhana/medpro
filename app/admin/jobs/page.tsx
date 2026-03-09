"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabase"

export default function AdminJobsPage(){

const router = useRouter()

const [jobs,setJobs] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{
  fetchJobs()
},[])

const fetchJobs = async () => {

  const { data:{ user } } = await supabase.auth.getUser()

  if(!user){
    setLoading(false)
    return
  }

  const { data,error } = await supabase
    .from("jobs")
    .select("*")
    .eq("admin_id",user.id)
    .order("created_at",{ascending:false})

  if(error){
    console.log(error)
  }else{
    setJobs(data || [])
  }

  setLoading(false)
}

if(loading){
  return(
    <div className="p-10">
      <p>Loading jobs...</p>
    </div>
  )
}

return(

<div className="p-10">

<h1 className="text-3xl font-semibold mb-8">
My Posted Jobs
</h1>

{jobs.length === 0 && (
<p className="text-neutral-500">
You have not posted any jobs yet
</p>
)}

<div className="space-y-6">

{jobs.map((job)=>(

<div
key={job.id}
className="border p-6 rounded-lg"
>

<h2 className="text-xl font-semibold">
{job.title}
</h2>

<p className="text-neutral-500">
{job.hospital_name}
</p>

<p>
Location: {job.location}
</p>

<p>
Salary: {job.salary}
</p>

<p className="mt-2 text-sm text-neutral-600">
{job.description}
</p>

<button
onClick={()=>router.push(`/admin/applicants/${job.id}`)}
className="mt-4 bg-black text-white px-4 py-2 rounded"
>

View Applicants

</button>

</div>

))}

</div>

</div>

)

}
