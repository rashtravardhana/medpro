export type UserRole = 'doctor' | 'admin';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  profession: string;
  resume_url: string | null;
  avatar_url: string | null;
}

export interface Job {
  id: string;
  title: string;
  hospital_name: string;
  location: string;
  salary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  experience: string;
  profession: string;
  type: string;
  admin_id: string;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  jobs?: {
    title: string;
    hospital_name: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  jobs?: Job;
}
