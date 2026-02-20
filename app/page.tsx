export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
        MedCareer Platform
      </h1>

      <p className="text-lg text-center max-w-2xl text-gray-600 mb-8">
        India’s Medical Job Portal for MBBS, BDS, BAMS, BHMS, BUMS,
        MD/MS, DM/MCh (Super Speciality), Nursing and Allied Healthcare Professionals.
      </p>

      <div className="flex gap-4">
        <a
          href="/register"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </a>

        <a
          href="/login"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          Login
        </a>
      </div>

    </div>
  );
}
