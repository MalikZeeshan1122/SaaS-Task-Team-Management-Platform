'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
    const [taskStats, setTaskStats] = useState<any>(null);
    const [productivityStats, setProductivityStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from Analytics Service (running on port 8000)
                // Note: In a real app, we might proxy this through Next.js API routes to avoid CORS or expose it properly.
                // For now, assuming direct access or via existing proxy setup.
                // If CORS is an issue, we'll see it in validation.
                const [tasksRes, prodRes] = await Promise.all([
                    axios.get('http://localhost:8000/stats/tasks'),
                    axios.get('http://localhost:8000/stats/productivity')
                ]);
                setTaskStats(tasksRes.data);
                setProductivityStats(prodRes.data);
            } catch (err) {
                console.error("Failed to load reports", err);
                setError('Failed to load analytics data. Ensure the analytics service is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    // Calculate max for bar chart scaling
    const maxCount = Array.isArray(productivityStats)
        ? (productivityStats.reduce((max, d) => Math.max(max, d.count), 0) || 1)
        : 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-6 md:p-8">
            {/* Subtle background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="relative z-10 max-w-7xl mx-auto space-y-8"
            >
                {/* Header */}
                <motion.div variants={item} className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="h-8 w-8 text-blue-600" />
                            Project Reports
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Real-time insights into team performance and project health.
                        </p>
                    </div>
                </motion.div>

                {error && (
                    <motion.div variants={item} className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {error}
                    </motion.div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Task Status Cards */}
                        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        Completed Tasks
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {taskStats?.DONE || 0}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total tasks finished successfully
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        In Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {taskStats?.IN_PROGRESS || 0}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tasks currently being worked on
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        To Do / Backlog
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {(taskStats?.TODO || 0) + (taskStats?.BACKLOG || 0)}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tasks waiting to be started
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Productivity Chart (Custom Implementation with Framer Motion) */}
                        <motion.div variants={item}>
                            <Card className="border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle>Productivity Trends</CardTitle>
                                    <CardDescription>Tasks completed over the last 7 days</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-end justify-between gap-4 mt-4 px-4">
                                        {Array.isArray(productivityStats) && productivityStats.length > 0 ? (
                                            productivityStats.map((stat, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                                                    <div className="relative w-full flex justify-end flex-col items-center h-full">
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${(stat.count / maxCount) * 100}%` }}
                                                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                            className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg group-hover:from-indigo-500 group-hover:to-violet-400 transition-all relative shadow-lg shadow-indigo-500/20"
                                                        >
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {stat.count}
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium truncate w-full text-center">
                                                        {new Date(stat.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No productivity data available yet.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
