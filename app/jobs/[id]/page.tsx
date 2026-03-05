const applyJob = async () => {

  const doctorId = crypto.randomUUID();

  // check if already applied
  const { data: existing } = await supabase
    .from("applications")
    .select("*")
    .eq("job_id", id)
    .eq("doctor_id", doctorId)
    .single();

  if (existing) {
    setMessage("You already applied for this job.");
    return;
  }

  const { error } = await supabase.from("applications").insert([
    {
      job_id: id,
      doctor_id: doctorId,
      status: "pending",
    },
  ]);

  if (error) {
    setMessage("Application failed");
  } else {
    setMessage("Application submitted successfully");
  }
};
