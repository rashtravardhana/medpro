'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#F59E0B', '#10B981', '#EF4444'];

export default function AdminAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) { router.push('/auth'); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      router.push('/');
      return;
    }

    // Total jobs
    const { count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('admin_id', user.id);

    // Get admin's job ids
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title')
      .eq('admin_id', user.id);

    const ids = (jobs || []).map((j) => j.id);

    // Applications for admin's jobs only
    const { data: allApps } = ids.length > 0
      ? await supabase
          .from('applications')
          .select('status, created_at, job_id')
          .in('job_id', ids)
      : { data: [] };

    const apps = allApps || [];

    const accepted = apps.filter((a) => a.status === 'accepted').length;
    const rejected = apps.filter((a) => a.status === 'rejected').length;
    const pending = apps.filter((a) => a.status === 'pending').length;

    setStats({
      jobs: jobsCount || 0,
      applications: apps.length,
      accepted,
      rejected,
      pending,
    });

    // Jobs with application count
    const jobsWithApps = (jobs || []).map((job) => ({
      ...job,
      applications: apps.filter((a) => a.job_id === job.id).length,
    }));

    setJobsData(jobsWithApps);

    // Monthly data (last 6 months)
    const monthly: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthly[d.toLocaleString('default', { month: 'short' })] = 0;
    }

    apps.forEach((a) => {
      const month = new Date(a.created_at).toLocaleString('default', { month: 'short' });
      if (monthly[month] !== undefined) monthly[month]++;
    });

    setMonthlyData(
      Object.entries(monthly).map(([month, count]) => ({ month, count }))
    );

    setLoading(false);
  }

  const pieData = [
    { name: 'Pending', value: stats.pending },
    { name: 'Accepted', value: stats.accepted },
    { name: 'Rejected', value: stats.rejected },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Analytics Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: stats.jobs, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Applications', value: stats.applications, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Accepted', value: stats.accepted, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-6`}>
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              Applications (Last 6 Months)
            </h2>
            {monthlyData.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    name="Applications"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No application data yet
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              Application Status Breakdown
            </h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No applications yet
              </div>
            )}
          </div>
        </div>

        {/* Applications Per Job Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">
            Applications per Job
          </h2>

          {jobsData.length === 0 ? (
            <p className="text-gray-400">No job data available.</p>
          ) : (
            <div className="space-y-3">
              {jobsData.map((job) => {
                const percent = stats.applications > 0
                  ? Math.round((job.applications / stats.applications) * 100)
                  : 0;

                return (
                  <div key={job.id}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-700">
                        {job.title}
                      </p>
                      <span className="text-sm text-gray-500">
                        {job.applications} applicants
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
