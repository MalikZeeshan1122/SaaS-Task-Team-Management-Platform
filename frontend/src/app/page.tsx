'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/30 via-transparent to-cyan-500/20 animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Floating Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blob top-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-white/20 to-pink-500/20 shape-blob float blur-sm"
        />
        {/* Medium blob bottom-left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-cyan-400/30 to-blue-500/20 shape-blob-2 float float-delay-1 blur-sm"
        />
        {/* Small floating circles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-white/40 to-white/10 rounded-full float float-delay-2 blur-[2px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 0.7 }}
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-pink-400/50 to-rose-400/30 rounded-full float-slow float-delay-3"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 2, delay: 0.9 }}
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-cyan-300/40 to-blue-400/20 rounded-full float float-delay-1"
        />
        {/* Glowing orbs */}
        <div className="absolute top-1/2 left-[15%] w-40 h-40 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-full blur-2xl float-slow" />
        <div className="absolute bottom-1/4 right-[15%] w-48 h-48 bg-gradient-to-br from-blue-500/25 to-cyan-500/25 rounded-full blur-2xl float float-delay-2" />
        <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-full blur-xl float-slow float-delay-3" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Now with Kanban Boards & Real-time Updates</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-glow"
          >
            <span className="block">SaaS Task &</span>
            <span className="block mt-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Team Platform
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Manage your projects with ease. Collaborate seamlessly, track progress in real-time, and boost your team's productivity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-2xl shadow-white/20 hover:shadow-white/40 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/signup"
              className="group px-8 py-4 glass rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 glow-hover"
            >
              <span className="flex items-center gap-2">
                Create Account
                <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Drag & Drop Kanban</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Team Collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Analytics Dashboard</span>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
