"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"

export default function MyApplicationsPage(){

const [applications,setApplications] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{
fetchApplications()
},[])

const fetchApplications = async () => {

const { data:{user} } = await supabase.auth.getUser()

if(!user){
setLoading(false)
return
}

const { data,error } = await supabase
.from("applications")
.select(`
id,
status,
jobs (
title,
hospital_name,
location
)
`)
.eq("doctor_id",user.id)

if(error){
console.log(error)
}else{
setApplications(data || [])
}

setLoading(false)

}

if(loading){
return(
<div className="p-10">
<p>Loading applications...</p>
</div>
)
}

return(

<div className="p-10">

<h1 className="text-3xl font-semibold mb-8">
My Applications
</h1>

{applications.length === 0 && (
<p className="text-neutral-500">
You have not applied to any jobs yet
</p>
)}

<div className="space-y-6">

{applications.map((app)=>(

<div
key={app.id}
className="border p-6 rounded-lg"
>

<h2 className="text-xl font-semibold">
{app.jobs?.title}
</h2>

<p className="text-neutral-500">
{app.jobs?.hospital_name}
</p>

<p>
Location: {app.jobs?.location}
</p>

<p className="mt-3 font-medium">
Status: {app.status}
</p>

</div>

))}

</div>

</div>

)

}
