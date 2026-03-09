"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"

export default function JobsPage(){

const [jobs,setJobs] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{
fetchJobs()
},[])


// FETCH JOBS
const fetchJobs = async () => {

const { data,error } = await supabase
.from("jobs")
.select("*")
.order("created_at",{ascending:false})

if(error){
console.log(error)
}else{
setJobs(data || [])
}

setLoading(false)
}


// APPLY JOB
const applyJob = async (jobId:string)=>{

const { data:{user} } = await supabase.auth.getUser()

if(!user){
alert("Please login first")
return
}


// CHECK IF ALREADY APPLIED
const { data:existing } = await supabase
.from("applications")
.select("id")
.eq("job_id",jobId)
.eq("doctor_id",user.id)
.single()


if(existing){
alert("You already applied for this job")
return
}


// INSERT APPLICATION
const { error } = await supabase
.from("applications")
.insert([
{
job_id:jobId,
doctor_id:user.id,
status:"pending"
}
])

if(error){
alert(error.message)
}else{
alert("Application submitted successfully")
}

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

<h1 className="text-3xl mb-8 font-semibold">
Available Jobs
</h1>

{jobs.length === 0 && (
<p>No jobs available</p>
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
onClick={()=>applyJob(job.id)}
className="mt-4 bg-black text-white px-4 py-2 rounded"
>

Apply

</button>

</div>
))}

</div>

</div>

)

}
