import supabase from "@/lib/supabase";

interface Props {
  params: {
    id: string;
  };
}

export default async function JobDetail({ params }: Props) {
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-500 text-lg">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-semibold tracking-tight">
          {job.title}
        </h1>

        <p className="mt-3 text-neutral-500 text-lg">
          {job.hospital_name} • {job.location}
        </p>

        <div className="mt-10 text-neutral-700 leading-relaxed">
          {job.description}
        </div>

        <div className="mt-8 text-sm text-neutral-400">
          Salary: {job.salary}
        </div>

      </div>
    </div>
  );
}
