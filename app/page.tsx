export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-10 py-6 border-b">
        <h1 className="text-xl font-semibold">MedCareer</h1>

        <div className="space-x-6 text-sm text-gray-600">
          <a href="/jobs" className="hover:text-black">Explore Jobs</a>
          <a href="/post-job" className="hover:text-black">Post Job</a>
          <a href="/auth" className="hover:text-black">Login / Register</a>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-28">
        <h2 className="text-6xl font-semibold leading-tight max-w-4xl mx-auto">
          The Future of Medical Careers.
        </h2>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          A modern platform connecting healthcare professionals with the right opportunities — fast, simple, and efficient.
        </p>

        <div className="mt-10 flex gap-6 justify-center flex-wrap">
          <a href="/auth" className="px-8 py-3 bg-black text-white rounded-full hover:opacity-80">
            Get Started
          </a>

          <a href="/jobs" className="px-8 py-3 border rounded-full hover:bg-gray-100">
            Explore Jobs
          </a>
        </div>
      </section>

      {/* HERO IMAGE */}
      <section className="px-6">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
          className="w-full h-[400px] object-cover rounded-2xl"
        />
      </section>

      {/* FEATURES */}
      <section className="px-10 py-24">
        <div className="grid md:grid-cols-3 gap-12 text-center">

          {/* CARD 1 */}
          <div className="hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1600959907703-125ba1374a12"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold">Built for Doctors</h3>
            <p className="text-gray-500 mt-2">
              Find jobs that match your profession — MBBS, BDS, BAMS and more.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold">For Hospitals</h3>
            <p className="text-gray-500 mt-2">
              Hire qualified professionals quickly and efficiently.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
              className="rounded-xl mb-4 h-48 w-full object-cover"
            />
            <h3 className="text-xl font-semibold">Smart Matching</h3>
            <p className="text-gray-500 mt-2">
              Jobs tailored based on your profession and preferences.
            </p>
          </div>

        </div>
      </section>

      {/* SPLIT SECTION */}
      <section className="px-10 py-24 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <h2 className="text-4xl font-semibold">
            Designed for Simplicity
          </h2>
          <p className="text-gray-500 mt-4">
            MedCareer removes complexity from job searching and hiring.
            Everything is designed to be fast, clean, and intuitive.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
          className="rounded-2xl w-full h-[300px] object-cover"
        />

      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-24 text-center bg-gray-50">

        <h2 className="text-3xl font-semibold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-lg font-semibold">1. Create Account</h3>
            <p className="text-gray-500 mt-2">
              Sign up and select your profession.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. Explore or Post</h3>
            <p className="text-gray-500 mt-2">
              Doctors explore jobs, hospitals post openings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. Apply or Hire</h3>
            <p className="text-gray-500 mt-2">
              Apply instantly or hire the right candidate.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-6 py-28 bg-black text-white text-center">

        <h2 className="text-4xl font-semibold">
          Start Your Journey Today
        </h2>

        <p className="mt-4 text-gray-300">
          Join MedCareer and unlock better opportunities in healthcare.
        </p>

        <a
          href="/auth"
          className="inline-block mt-8 px-8 py-3 bg-white text-black rounded-full hover:opacity-80"
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
