export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-10 py-6 border-b">

        <h1 className="text-xl font-semibold tracking-tight">
          MedCareer
        </h1>

        <div className="space-x-6 text-sm text-gray-600">

          <a href="/jobs" className="hover:text-black transition">
            Browse Jobs
          </a>

          <a href="/applications" className="hover:text-black transition">
            My Applications
          </a>

          <a href="/post-job" className="hover:text-black transition">
            Post Job
          </a>

          <a href="/auth" className="hover:text-black transition">
            Login / Register
          </a>

        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">

        <h2 className="text-5xl font-semibold tracking-tight max-w-3xl leading-tight">
          Medical Careers.
          <br />
          Reimagined.
        </h2>

        {/* SHORT CLEAN DESCRIPTION */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Connecting healthcare professionals with the right opportunities.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex gap-6 flex-wrap justify-center">

          <a
            href="/jobs"
            className="px-6 py-3 bg-black text-white rounded-full text-sm hover:opacity-80 transition"
          >
            Browse Jobs
          </a>

          <a
            href="/applications"
            className="px-6 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
          >
            My Applications
          </a>

          <a
            href="/post-job"
            className="px-6 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
          >
            Post Job
          </a>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} MedCareer. All rights reserved.
      </footer>

    </div>
  );
}
