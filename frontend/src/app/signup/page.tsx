'use client';
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/signup', { name, email, password });
            alert('Signup successful! Please login.');
            router.push('/login');
        } catch (err) {
            alert('Signup failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500">
            {/* Floating Decorative Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 shape-blob float"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-300/30 shape-blob-2 float float-delay-1"
                />
                <div className="absolute bottom-1/2 right-1/6 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl float-slow" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Logo / Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-bold text-white text-glow">
                                SaaS Platform
                            </h2>
                        </Link>
                        <p className="text-white/70 mt-2">Create your account and get started.</p>
                    </motion.div>

                    {/* Signup Form Card */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        onSubmit={handleSignup}
                        className="glass-card p-8 rounded-2xl shadow-2xl"
                    >
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                            Create Account
                        </h1>

                        {/* Name Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none input-glow transition-all duration-300"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none input-glow transition-all duration-300"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none input-glow transition-all duration-300"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed btn-premium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <Link
                            href="/login"
                            className="block w-full py-3 px-4 text-center font-semibold text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                        >
                            Sign In Instead
                        </Link>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
}
