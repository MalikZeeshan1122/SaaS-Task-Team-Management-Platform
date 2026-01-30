import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          SaaS Task & Team Platform
        </h1>
        <p className="mt-3 text-2xl">
          Manage your projects with ease.
        </p>

        <div className="flex mt-6">
          <Link href="/login" className="px-6 py-3 mr-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-bold shadow-lg hover:bg-white/10 transition">
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
