"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function AuthPage() {

const router = useRouter();

const [name,setName] = useState("");
const [role,setRole] = useState("doctor");
const [profession,setProfession] = useState("");

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [message,setMessage] = useState("");


// REGISTER USER
const handleRegister = async () => {

if(!name || !email || !password){
setMessage("Please fill all required fields");
return;
}

if(role === "doctor" && !profession){
setMessage("Please select your profession");
return;
}

const { data,error } = await supabase.auth.signUp({
email: email,
password: password
});

if(error){
setMessage(error.message);
return;
}

if(data.user){

const { error:profileError } = await supabase
.from("profiles")
.insert([
{
id: data.user.id,
name: name,
role: role,
profession: role === "doctor" ? profession : null
}
]);

if(profileError){
setMessage(profileError.message);
return;
}

setMessage("Registration successful. Please login.");

}

};


// LOGIN USER
const handleLogin = async () => {

const { data,error } = await supabase.auth.signInWithPassword({
email: email,
password: password
});

if(error){
setMessage(error.message);
return;
}

const user = data.user;

const { data:profile } = await supabase
.from("profiles")
.select("role")
.eq("id",user.id)
.single();

if(profile?.role === "admin"){
router.push("/admin/dashboard");
}else{
router.push("/jobs");
}

};


return(

<div className="min-h-screen flex items-center justify-center bg-white">

<div className="w-full max-w-md p-8 border rounded-xl">

<h1 className="text-3xl font-semibold mb-6 text-center">
Login / Register
</h1>

<input
type="text"
placeholder="Full Name"
className="w-full border p-3 rounded mb-4"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<select
className="w-full border p-3 rounded mb-4"
value={role}
onChange={(e)=>setRole(e.target.value)}
>
<option value="doctor">Doctor</option>
<option value="admin">Hospital Admin</option>
</select>


{/* Profession only visible for doctors */}

{role === "doctor" && (

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

)}

<input
type="email"
placeholder="Email"
className="w-full border p-3 rounded mb-4"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full border p-3 rounded mb-6"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={handleLogin}
className="w-full bg-black text-white py-3 rounded mb-3"
>
Login
</button>

<button
onClick={handleRegister}
className="w-full border py-3 rounded"
>
Register
</button>

{message && (
<p className="mt-4 text-center text-sm text-neutral-600">
{message}
</p>
)}

</div>

</div>

)

}
