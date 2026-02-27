export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">

      {/* Header */}
      <header className="w-full flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-semibold tracking-tight">
          MedCareer
        </h1>

        <div className="space-x-6 text-sm text-neutral-600">
          <a
            href="/auth?mode=login"
            className="hover:text-black transition"
          >
            Login
          </a>

          <a
            href="/auth?mode=register"
            className="hover:text-black transition"
          >
            Register
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">

        <h2 className="text-5xl font-semibold tracking-tight max-w-3xl leading-tight">
          Medical Careers.
          <br />
          Reimagined.
        </h2>

        <p className="mt-6 text-lg text-neutral-500 max-w-2xl">
          A refined job platform built exclusively for MBBS, BDS, BAMS, BHMS,
          BUMS, MD/MS, DM/MCh, Nursing and allied healthcare professionals.
        </p>

        <div className="mt-10 flex gap-6">
          <a
            href="/auth?mode=register"
            className="px-6 py-3 bg-black text-white rounded-full text-sm hover:opacity-80 transition"
          >
            Get Started
          </a>

          <a
            href="/jobs"
            className="px-6 py-3 border border-neutral-300 rounded-full text-sm hover:bg-neutral-100 transition"
          >
            Browse Jobs
          </a>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-neutral-400 py-6">
        © {new Date().getFullYear()} MedCareer. All rights reserved.
      </footer>

    </div>
  );
}
