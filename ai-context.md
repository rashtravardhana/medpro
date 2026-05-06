# 🏥 MedCareer AI Context File (Latest)

## 📌 Project Overview
MedCareer is a full-stack SaaS web application that connects healthcare professionals (doctors) with hospitals for job opportunities.

Doctors can explore jobs, apply, upload resumes, and track applications.  
Admins (hospitals) can post jobs, review applicants, and manage hiring.

---

## 🏗️ Tech Stack

- Frontend: Next.js (App Router, Client Components)
- Backend: Supabase (Auth + PostgreSQL + Storage)
- Database: PostgreSQL
- Storage: Supabase Storage (resumes, avatars)
- Styling: Tailwind CSS
- Hosting: Vercel

---

## 👥 User Roles

### 👨‍⚕️ Doctor
- Register / Login
- View jobs
- Apply for jobs
- Upload resume (PDF)
- Upload profile avatar
- Track applications (dashboard)
- View application status

---

### 🏥 Admin
- Post jobs
- View all posted jobs
- View applicants per job
- Accept / Reject applications
- View doctor profiles
- View resumes
- Access analytics dashboard

---

## 🗄️ Database Schema

### 🔹 profiles
- id (uuid, PK, same as auth.users.id)
- name (text)
- role (text) → "doctor" or "admin"
- profession (text)
- resume_url (text)
- avatar_url (text)

---

### 🔹 jobs
- id (uuid, PK)
- title (text)
- hospital_name (text)
- location (text)
- salary (text)
- description (text)
- responsibilities (text)
- requirements (text)
- experience (text)
- type (text)
- profession (text)
- admin_id (uuid)
- created_at (timestamp)

---

### 🔹 applications
- id (uuid, PK)
- user_id (uuid → profiles.id)
- job_id (uuid → jobs.id)
- status (text) → pending / accepted / rejected
- created_at (timestamp)

---

## 🔗 Relationships

- applications.user_id → profiles.id
- applications.job_id → jobs.id

👉 Required for JOIN queries:
```js
.select("jobs(title, hospital_name)")
```

---

## 🔐 Authentication Flow

- Supabase Auth handles login/signup
- After login:
  1. Fetch user → `auth.getUser()`
  2. Fetch role → `profiles` table
- Role-based routing:
  - doctor → `/dashboard`
  - admin → `/admin/dashboard`

---

## 📄 Core Pages

### 🔹 Homepage (/)
- Hero section
- CTA buttons
- Feature highlights

---

### 🔹 Auth (/auth)
- Login / Register
- Redirect based on role

---

### 🔹 Doctor Dashboard (/dashboard)
- Welcome message
- Resume upload
- Application tracking
- Uses JOIN with jobs table

---

### 🔹 Applications (/applications)
- Shows applied jobs
- Displays:
  - Job title
  - Hospital name
  - Status

---

### 🔹 Jobs (/jobs)
- List of all jobs
- Shows title, hospital, location, salary

---

### 🔹 Job Detail (/jobs/[id])
- Full job details
- Apply button
- Prevents duplicate applications
- Admin cannot apply

---

### 🔹 Profile (/profile)
- Upload resume (PDF)
- Upload avatar
- View resume

---

### 🔹 Admin Dashboard (/admin/dashboard)
- Shows jobs posted by admin
- Links to:
  - Job detail
  - Applicants page

---

### 🔹 Applicants (/admin/applicants/[id])
- Shows applicants for a job
- Displays:
  - Name
  - Role
  - Status
- Actions:
  - Accept
  - Reject

---

### 🔹 Doctor Profile (/admin/doctor/[id])
- Shows:
  - Name
  - Role
  - Profession
  - Resume

---

### 🔹 Admin Analytics (/admin/analytics)
- Shows:
  - Total jobs
  - Total applications
  - Accepted / Rejected counts
- (Charts optional / future)

---

## 🧭 Navigation System

- Dynamic Navbar based on role
- Shows:
  - Jobs
  - Dashboard/Admin
- Avatar dropdown:
  - Profile
  - Dashboard
  - Logout

---

## 🚀 Features Implemented

- Authentication system
- Role-based routing
- Job posting
- Job applying
- Duplicate application prevention (frontend)
- Resume upload
- Avatar upload
- Admin applicant management
- Profile viewing
- Dashboard tracking
- Basic analytics
- Premium navbar with dropdown

---

## ⚠️ Common Issues & Fixes

### ❌ Applications showing only job_id
Fix:
```js
.select(`
  id,
  status,
  jobs(title, hospital_name)
`)
```

---

### ❌ Duplicate applications
Fix:
```sql
create unique index unique_application 
on applications (user_id, job_id);
```

---

### ❌ Profile not found
Fix:
- profiles.id must equal auth.users.id
- Insert profile after signup

---

### ❌ Storage issues
Check:
- Bucket exists (resumes / avatars)
- Correct file type
- Public URL generated

---

### ❌ Infinite loading
Fix:
Always call:
```js
setLoading(false)
```

---

## 🔮 Future Improvements

- Charts (Chart.js)
- Notifications
- Chat system
- Job filters & search
- Pagination
- Email alerts

---

## 🎯 Purpose

Used for:
- AI understanding
- Debugging
- Faster development
- Scaling project

---

## 🧠 Status

MedCareer is now a working MVP SaaS platform with full doctor ↔ hospital workflow.
