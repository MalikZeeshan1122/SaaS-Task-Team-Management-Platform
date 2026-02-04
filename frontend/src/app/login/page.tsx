'use client';
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.access_token);
            router.push('/dashboard');
        } catch (err) {
            alert('Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
            {/* Floating Decorative Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 shape-blob float"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-300/30 shape-blob-2 float float-delay-1"
                />
                <div className="absolute top-1/2 left-1/6 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl float-slow" />
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
                        <p className="text-white/70 mt-2">Welcome back! Sign in to continue.</p>
                    </motion.div>

                    {/* Login Form Card */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        onSubmit={handleLogin}
                        className="glass-card p-8 rounded-2xl shadow-2xl"
                    >
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                            Sign In
                        </h1>

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
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed btn-premium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                                    New to SaaS Platform?
                                </span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <Link
                            href="/signup"
                            className="block w-full py-3 px-4 text-center font-semibold text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                        >
                            Create an Account
                        </Link>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
}
