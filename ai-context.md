# 🏥 MedCareer AI Context File (Latest)

## 📌 Project Overview

MedCareer is a full-stack SaaS-style healthcare hiring platform that connects doctors and healthcare professionals with hospitals and recruiters.

Doctors can:
- Discover jobs
- Apply for jobs
- Upload resumes
- Manage profiles
- Track applications
- Receive notifications

Hospitals/Admins can:
- Post jobs
- Manage applicants
- Review doctor profiles
- Track hiring analytics

---

# 🏗️ Tech Stack

## Frontend
- Next.js (App Router)
- React
- Tailwind CSS

## Backend
- Supabase
  - Authentication
  - PostgreSQL Database
  - Storage

## Database
- PostgreSQL

## Hosting
- Vercel

---

# 📦 Package Setup

## Main Dependencies
- next
- react
- react-dom
- @supabase/supabase-js

## Dev Dependencies
- typescript
- tailwindcss
- eslint
- eslint-config-next

---

# 👥 User Roles

## 👨‍⚕️ Doctor

Doctors can:
- Register/Login
- View jobs
- Apply for jobs
- Upload resume
- Upload avatar
- Track applications
- View notifications
- Access dashboard
- View related jobs

---

## 🏥 Admin

Admins can:
- Post jobs
- View applicants
- Accept applications
- Reject applications
- View doctor profiles
- Access analytics dashboard
- Manage hiring workflow

---

# 🗄️ Database Schema

## 🔹 profiles

Stores user profile data.

Columns:
- id (uuid, PK, same as auth.users.id)
- name (text)
- role (text)
- profession (text)
- resume_url (text)
- avatar_url (text)

---

## 🔹 jobs

Stores job listings.

Columns:
- id (uuid, PK)
- title (text)
- hospital_name (text)
- location (text)
- salary (text)
- description (text)
- responsibilities (text)
- requirements (text)
- experience (text)
- profession (text)
- type (text)
- admin_id (uuid)
- created_at (timestamp)

---

## 🔹 applications

Stores job applications.

Columns:
- id (uuid, PK)
- user_id (uuid → profiles.id)
- job_id (uuid → jobs.id)
- status (text)
- created_at (timestamp)

Status values:
- pending
- accepted
- rejected

---

## 🔹 notifications

Stores user notifications.

Columns:
- id (uuid, PK)
- user_id (uuid → profiles.id)
- title (text)
- message (text)
- is_read (boolean)
- created_at (timestamp)

Used for:
- Application updates
- User alerts
- Future admin notifications

SQL used:

```sql
create table notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text,
  message text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);
```

---

# 🔗 Relationships

- applications.user_id → profiles.id
- applications.job_id → jobs.id
- notifications.user_id → profiles.id

Required for JOIN queries.

Example:

```js
.select("jobs(title, hospital_name)")
```

---

# 🔐 Authentication Flow

Supabase Auth handles login/signup.

After login:
1. Fetch authenticated user
2. Fetch role from profiles table
3. Redirect based on role

Role routes:
- doctor → `/dashboard`
- admin → `/admin/dashboard`

Example:

```js
const { data } = await supabase.auth.getUser();
```

---

# 📄 Core Pages

## 🔹 Homepage (`/`)
- Hero section
- CTA buttons
- Feature highlights
- Responsive layout

---

## 🔹 Auth (`/auth`)
- Login
- Register
- Role-based redirect

---

## 🔹 Jobs Page (`/jobs`)
Displays all jobs.

Shows:
- Job title
- Hospital name
- Salary
- Location
- Job type

---

## 🔹 Job Detail (`/jobs/[id]`)

Advanced job details page with:
- Full job description
- Responsibilities
- Requirements
- Profession tags
- Salary details
- Sticky apply card
- Related jobs section

Features:
- Duplicate application prevention
- Resume required before applying
- Admin cannot apply
- Notification insertion after apply
- Related jobs based on profession

---

## 🔹 Applications (`/applications`)
Displays doctor applications.

Uses JOIN query with jobs table.

Shows:
- Job title
- Hospital name
- Status
- Applied date

---

## 🔹 Doctor Dashboard (`/dashboard`)
Doctor dashboard includes:
- Welcome section
- Resume upload
- Application tracking
- Quick stats
- Job tracking

---

## 🔹 Profile (`/profile`)
Users can:
- Upload resume PDF
- Upload avatar image
- Update profile info
- View current resume

Uses Supabase Storage.

Buckets:
- resumes
- avatars

---

## 🔹 Notifications (`/notifications`)

Displays user notifications.

Features:
- Notification list
- Unread indicator
- Ordered by latest
- Loading state
- Empty state UI

Navbar also shows:
- Notification badge count
- Dropdown notification count

---

## 🔹 Admin Dashboard (`/admin/dashboard`)
Admin can:
- View posted jobs
- Navigate to applicants
- Manage job listings

---

## 🔹 Applicants (`/admin/applicants/[id]`)
Shows applicants per job.

Displays:
- Doctor name
- Profession
- Status

Actions:
- Accept
- Reject

---

## 🔹 Doctor Profile (`/admin/doctor/[id]`)
Admin can view:
- Doctor name
- Profession
- Resume
- Avatar

---

## 🔹 Admin Analytics (`/admin/analytics`)
Shows:
- Total jobs
- Total applications
- Accepted count
- Rejected count

Future:
- Charts
- Advanced analytics

---

# 🧭 Navigation System

## Navbar Features

Dynamic navbar based on:
- Authentication
- User role

Links include:
- Jobs
- Notifications
- Dashboard
- Applications
- Admin dashboard
- Analytics
- Post Job

Avatar dropdown includes:
- Profile
- Dashboard
- Notifications
- Logout

---

# 🚀 Features Implemented

## Authentication
- Login/Register
- Supabase Auth
- Role-based routing

## Jobs
- Post jobs
- View jobs
- Related jobs
- Job details

## Applications
- Apply system
- Duplicate prevention
- Resume validation
- Status tracking

## Profiles
- Avatar upload
- Resume upload
- Profile management

## Notifications
- Notification table
- Notification badge
- Notification page
- Unread count
- Auto insert after applying

## Admin Features
- Applicant management
- Accept/Reject workflow
- Analytics dashboard

## UI/UX
- Premium navbar
- Responsive layouts
- Sticky apply card
- Tailwind modern UI
- Dropdown menus
- Loading states

---

# ⚠️ Common Issues & Fixes

## ❌ Applications showing only job_id

Fix:

```js
.select(`
  id,
  status,
  jobs(title, hospital_name)
`)
```

---

## ❌ Duplicate applications

Fix:

```sql
create unique index unique_application
on applications (user_id, job_id);
```

---

## ❌ Profile not found

Fix:
- profiles.id must equal auth.users.id
- Insert profile row after signup

---

## ❌ Resume upload issues

Check:
- resumes bucket exists
- PDF allowed
- Public URL generated

---

## ❌ Avatar upload issues

Check:
- avatars bucket exists
- Image file allowed
- Public URL generated

---

## ❌ Infinite loading

Fix:

```js
setLoading(false)
```

---

## ❌ Notifications not showing

Check:
- notifications table exists
- RLS policy enabled correctly
- user_id inserted properly

---

# 🔒 RLS (Row Level Security)

Recommended RLS for notifications:

```sql
alter table notifications enable row level security;
```

Policy:

```sql
create policy "Users can view own notifications"
on notifications
for select
using (auth.uid() = user_id);
```

Insert policy:

```sql
create policy "Users can insert own notifications"
on notifications
for insert
with check (auth.uid() = user_id);
```

Update policy:

```sql
create policy "Users can update own notifications"
on notifications
for update
using (auth.uid() = user_id);
```

---

# 📁 Supabase Storage

## Buckets

### resumes
Stores PDF resumes.

### avatars
Stores user profile images.

---

# 🔮 Future Improvements

Planned features:
- Realtime notifications
- Chat system
- Email alerts
- Job search & filters
- Pagination
- Saved jobs
- Profile completeness score
- Charts with Chart.js
- Admin moderation tools
- Realtime analytics

---

# 🎯 Purpose

This AI context file is used for:
- AI coding assistance
- Faster debugging
- Feature planning
- Project scaling
- Architecture understanding

---

# 🧠 Current Project Status

MedCareer is now a working MVP SaaS healthcare hiring platform with:
- Full authentication
- Doctor/Admin workflow
- Job system
- Application tracking
- Notification system
- Analytics
- Responsive modern UI
- Supabase backend integration
