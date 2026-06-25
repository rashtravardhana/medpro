'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import { PageSkeleton } from '@/components/SkeletonLoader';

const PROFESSIONS = ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS', 'Nursing', 'Allied Healthcare'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract'];
const PAGE_SIZE = 9;

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [profession, setProfession] = useState('');
  const [jobType, setJobType] = useState('');

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // Get user role
    const userRes = await supabase.auth.getUser();
    if (userRes.data?.user) {
      const profileRes = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userRes.data.user.id)
        .single();
      setRole(profileRes.data?.role?.toLowerCase().trim() || null);
    }

    // Get jobs
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.log(error);
    else {
      setJobs(data || []);
      setFilteredJobs(data || []);
    }

    setLoading(false);
  }

  // Filter logic
  useEffect(() => {
    let result = jobs;

    if (search) {
      result = result.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.hospital_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (profession) {
      result = result.filter((job) => job.profession === profession);
    }

    if (jobType) {
      result = result.filter((job) => job.type === jobType);
    }

    setFilteredJobs(result);
    setPage(1);
  }, [search, location, profession, jobType, jobs]);

  function clearFilters() {
    setSearch('');
    setLocation('');
    setProfession('');
    setJobType('');
    setPage(1);
  }

  const hasFilters = search || location || profession || jobType;
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const paginated = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header + Filters */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Find Medical Jobs
          </h1>
          <p className="text-gray-500 mb-6">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
          </p>

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-3">

            {/* Search */}
            <div className="flex-1 min-w-[220px] relative">
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search job title or hospital..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Location */}
            <div className="relative min-w-[160px]">
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Profession */}
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="min-w-[150px] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-700"
            >
              <option value="">All Professions</option>
              {PROFESSIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Job Type */}
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="min-w-[130px] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-700"
            >
              <option value="">All Types</option>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <PageSkeleton />
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginated.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          page === p
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
