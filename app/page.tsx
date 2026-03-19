export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-10 py-6 border-b">

        <h1 className="text-xl font-semibold tracking-tight">
          MedCareer
        </h1>

        <div className="space-x-6 text-sm text-gray-600">
          <a href="/jobs" className="hover:text-black transition">Explore Jobs</a>
          <a href="/post-job" className="hover:text-black transition">Post Job</a>
          <a href="/auth" className="hover:text-black transition">Login / Register</a>
        </div>

      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">

        <h2 className="text-5xl font-semibold max-w-3xl leading-tight">
          Find the Right Medical Career.
        </h2>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          MedCareer connects doctors, nurses, and healthcare professionals with hospitals and clinics across India.
        </p>

        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          <a href="/auth" className="px-6 py-3 bg-black text-white rounded-full text-sm">
            Get Started
          </a>

          <a href="/jobs" className="px-6 py-3 border border-gray-300 rounded-full text-sm">
            Explore Jobs
          </a>
        </div>

      </section>

      {/* IMAGE / FEATURE SECTION */}
      <section className="px-10 py-20 bg-gray-50">

        <div className="grid md:grid-cols-3 gap-10 text-center">

          <div>
            <img
              src="https://images.unsplash.com/photo-1580281657527-47c0b6b3a1f4"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-lg font-semibold">For Doctors</h3>
            <p className="text-gray-600 mt-2">
              Discover jobs tailored to your profession like MBBS, BDS, BAMS and more.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1588776814546-ec7e3f1a8f17"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-lg font-semibold">For Hospitals</h3>
            <p className="text-gray-600 mt-2">
              Post jobs and connect with qualified healthcare professionals easily.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-lg font-semibold">Smart Matching</h3>
            <p className="text-gray-600 mt-2">
              Get relevant job recommendations based on your profession and skills.
            </p>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-20 text-center">

        <h2 className="text-3xl font-semibold mb-10">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-xl font-semibold">1. Register</h3>
            <p className="text-gray-600 mt-2">
              Create your account and choose your profession.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Explore / Post</h3>
            <p className="text-gray-600 mt-2">
              Doctors explore jobs. Hospitals post jobs.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">3. Apply / Hire</h3>
            <p className="text-gray-600 mt-2">
              Apply to jobs or hire the best candidates.
            </p>
          </div>

        </div>

      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 py-20 bg-black text-white text-center">

        <h2 className="text-3xl font-semibold">
          Start Your Journey Today
        </h2>

        <p className="mt-4 text-gray-300">
          Join MedCareer and unlock better opportunities in healthcare.
        </p>

        <a
          href="/auth"
          className="inline-block mt-6 px-6 py-3 bg-white text-black rounded-full"
        >
          Register / Login
        </a>

      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © {new Date().getFullYear()} MedCareer. All rights reserved.
      </footer>

    </div>
  );
}
