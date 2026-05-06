# 🏥 MedCareer AI Context File

## 📌 Project Overview
MedCareer is a full-stack web application that connects healthcare professionals (doctors) with hospitals for job opportunities.

The platform allows:
- Doctors to apply for jobs
- Hospitals/Admins to post jobs and manage applicants
- Resume upload and profile management
- Role-based dashboards (Doctor/Admin)

---

## 🏗️ Tech Stack

- Frontend: Next.js (App Router)
- Backend: Supabase (Auth + Database + Storage)
- Database: PostgreSQL (via Supabase)
- Styling: Tailwind CSS
- Hosting: Vercel

---

## 👥 User Roles

### 1. Doctor
- Register/Login
- View jobs
- Apply for jobs
- Upload resume
- Track application status

### 2. Admin (Hospital)
- Post jobs
- View applicants
- Accept / Reject applications
- View doctor profiles
- Access resumes

---

## 🗄️ Database Schema

### 🔹 profiles
Stores user profile data

Columns:
- id (uuid, PK, same as auth.users.id)
- name (text)
- role (text) → "doctor" or "admin"
- profession (text)
- resume_url (text)

---

### 🔹 jobs
Stores job listings

Columns:
- id (uuid, PK)
- title (text)
- hospital_name (text)
- location (text)
- salary (text)
- created_at (timestamp)

---

### 🔹 applications
Stores job applications

Columns:
- id (uuid, PK)
- user_id (uuid → profiles.id)
- job_id (uuid → jobs.id)
- status (text) → pending / accepted / rejected
- created_at (timestamp)

---

## 🔗 Relationships (IMPORTANT)

- applications.user_id → profiles.id
- applications.job_id → jobs.id

These must be properly linked in Supabase for JOIN queries to work.

---

## 🔐 Authentication Flow

- Supabase Auth handles login/signup
- On login:
  - Fetch user from auth.getUser()
  - Fetch role from profiles table
- Role-based routing:
  - doctor → /dashboard
  - admin → /admin/dashboard

---

## 📄 Core Pages

### 🔹 Homepage (/)
- Hero section
- CTA buttons (Get Started)
- Features
- Role-based actions

---

### 🔹 Auth Page (/auth)
- Login/Register form
- Supabase authentication
- Redirect based on role

---

### 🔹 Doctor Dashboard (/dashboard)
- Shows:
  - Applied jobs
  - Status tracking
- Fetch:
  - applications + jobs (JOIN)

---

### 🔹 Applications Page (/applications)
- Shows all applied jobs
- Uses JOIN:
  applications → jobs

---

### 🔹 Jobs Page (/jobs)
- Lists all jobs
- Doctors can apply

---

### 🔹 Admin Dashboard (/admin/dashboard)
- View all jobs
- Manage postings

---

### 🔹 Applicants Page (/admin/applicants/[id])
- Shows applicants per job
- Admin can:
  - Accept
  - Reject

---

### 🔹 Doctor Profile Page (/admin/doctor/[id])
- Shows:
  - Name
  - Role
  - Profession
  - Resume

---

## 📂 File Structure (Important Parts)

- /app/page.tsx → Homepage
- /app/auth → Login/Register
- /app/dashboard → Doctor dashboard
- /app/applications → Applications page
- /app/admin → Admin routes
- /lib/supabase.ts → Supabase client
- /lib/useAuth.ts → Auth + role protection hook
- /components/Navbar.tsx → Navigation

---

## ⚠️ Common Issues & Fixes

### ❌ "Error fetching user profile"
- Cause: Missing profile row
- Fix: Insert into profiles table

---

### ❌ Profile not found
- Cause: ID mismatch
- Fix: Ensure profiles.id = auth.users.id

---

### ❌ Applications showing only job_id
- Cause: No JOIN / no relationship
- Fix:
  - Create foreign key
  - Use:
    .select(jobs(title, hospital_name))

---

### ❌ Infinite loading
- Cause: setLoading(false) not called on error
- Fix: Always stop loading

---

## 🚀 Features Implemented

- Authentication (login/register)
- Role-based routing
- Job posting (admin)
- Job application (doctor)
- Resume upload (Supabase Storage)
- Admin applicant management
- Profile viewing
- Dashboard tracking
- Logout + redirect

---

## 🔮 Future Improvements

- Notifications system
- Real-time updates
- Chat between doctor & hospital
- Advanced filters for jobs
- Profile editing UI
- Pagination
- Email alerts

---

## 🎯 Purpose of This File

This file helps:
- AI tools understand the project
- Faster debugging
- Future feature development
- Team onboarding
