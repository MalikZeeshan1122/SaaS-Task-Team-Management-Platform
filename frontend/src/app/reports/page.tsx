'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import {
    BarChart3, ArrowLeft, CheckCircle, TrendingUp, AlertTriangle,
    Clock, ListTodo, FolderKanban, Activity, Zap, Target, PieChart,
    Download, RefreshCw, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskStats {
    completed: number;
    in_progress: number;
    todo: number;
    total: number;
    completionRate: number;
    byPriority: {
        high: number;
        medium: number;
        low: number;
    };
}

interface ProductivityStat {
    name: string;
    count: number;
}

interface ProjectStat {
    id: string;
    name: string;
    totalTasks: number;
    completed: number;
    inProgress: number;
    todo: number;
    progress: number;
}

export default function ReportsPage() {
    const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
    const [productivityStats, setProductivityStats] = useState<ProductivityStat[]>([]);
    const [projectStats, setProjectStats] = useState<ProjectStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const [tasksRes, prodRes, projectsRes] = await Promise.all([
                api.get('/analytics/stats/tasks'),
                api.get('/analytics/stats/productivity'),
                api.get('/analytics/stats/projects')
            ]);
            setTaskStats(tasksRes.data);
            setProductivityStats(prodRes.data);
            setProjectStats(projectsRes.data);
            setError('');
        } catch (err) {
            console.error("Failed to load reports", err);
            setError('Failed to load analytics data. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
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

    const maxCount = Array.isArray(productivityStats)
        ? (productivityStats.reduce((max, d) => Math.max(max, d.count), 0) || 1)
        : 1;

    const statCards = [
        {
            title: 'Completed Tasks',
            value: taskStats?.completed || 0,
            icon: CheckCircle,
            color: 'text-emerald-500',
            bg: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/20',
            glow: 'group-hover:shadow-emerald-500/20',
            description: 'Tasks finished successfully'
        },
        {
            title: 'In Progress',
            value: taskStats?.in_progress || 0,
            icon: Clock,
            color: 'text-blue-500',
            bg: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20',
            glow: 'group-hover:shadow-blue-500/20',
            description: 'Tasks currently being worked on'
        },
        {
            title: 'To Do',
            value: taskStats?.todo || 0,
            icon: ListTodo,
            color: 'text-amber-500',
            bg: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/20',
            glow: 'group-hover:shadow-amber-500/20',
            description: 'Tasks waiting to be started'
        },
        {
            title: 'Completion Rate',
            value: `${taskStats?.completionRate || 0}%`,
            icon: Target,
            color: 'text-violet-500',
            bg: 'bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/20',
            glow: 'group-hover:shadow-violet-500/20',
            description: 'Overall task completion'
        }
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-6 md:p-8">
                {/* Background decoration */}
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
                    <motion.div variants={item} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon" className="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-3">
                                    <BarChart3 className="h-8 w-8 text-indigo-600" />
                                    Project Reports
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Real-time insights into team performance and project health.
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            variant="outline"
                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800"
                        >
                            {refreshing ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                            )}
                            Refresh
                        </Button>
                    </motion.div>

                    {/* Error State */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300"
                            >
                                <AlertTriangle className="h-5 w-5" />
                                {error}
                                <Button
                                    onClick={() => fetchData()}
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto text-red-600 hover:bg-red-100"
                                >
                                    Try Again
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stats Cards */}
                    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className={`group relative overflow-hidden ${stat.bg} border-0 shadow-lg ${stat.glow} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                                                    <motion.p
                                                        className={`text-4xl font-bold mt-2 ${stat.color}`}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: idx * 0.1 + 0.2, type: 'spring' }}
                                                    >
                                                        {loading ? '-' : stat.value}
                                                    </motion.p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                                                </div>
                                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Productivity Trends */}
                        <motion.div variants={item}>
                            <Card className="glass-card border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                                        Productivity Trends
                                    </CardTitle>
                                    <CardDescription>Tasks completed over the last 7 days</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="h-64 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                        </div>
                                    ) : productivityStats.length > 0 ? (
                                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                                            {productivityStats.map((stat, idx) => (
                                                <div key={stat.name} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <motion.div
                                                        className="w-full max-w-[50px] bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg hover:from-indigo-500 hover:to-violet-400 transition-all relative shadow-lg shadow-indigo-500/20"
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${(stat.count / maxCount) * 100}%` }}
                                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                        style={{ minHeight: stat.count > 0 ? '20px' : '4px' }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            {stat.count} tasks
                                                        </div>
                                                    </motion.div>
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                <p>No productivity data yet</p>
                                                <p className="text-sm">Complete some tasks to see trends</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Priority Distribution */}
                        <motion.div variants={item}>
                            <Card className="glass-card border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="h-5 w-5 text-indigo-600" />
                                        Task Priority Distribution
                                    </CardTitle>
                                    <CardDescription>Breakdown of tasks by priority level</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="h-64 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                        </div>
                                    ) : taskStats ? (
                                        <div className="space-y-4">
                                            {[
                                                { label: 'High Priority', value: taskStats.byPriority.high, color: 'bg-red-500', lightBg: 'bg-red-100 dark:bg-red-900/30' },
                                                { label: 'Medium Priority', value: taskStats.byPriority.medium, color: 'bg-amber-500', lightBg: 'bg-amber-100 dark:bg-amber-900/30' },
                                                { label: 'Low Priority', value: taskStats.byPriority.low, color: 'bg-emerald-500', lightBg: 'bg-emerald-100 dark:bg-emerald-900/30' }
                                            ].map((priority, idx) => {
                                                const total = (taskStats.byPriority.high + taskStats.byPriority.medium + taskStats.byPriority.low) || 1;
                                                const percentage = Math.round((priority.value / total) * 100);
                                                return (
                                                    <motion.div
                                                        key={priority.label}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.15 }}
                                                        className="space-y-2"
                                                    >
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">{priority.label}</span>
                                                            <span className="text-gray-500">{priority.value} tasks ({percentage}%)</span>
                                                        </div>
                                                        <div className={`h-3 rounded-full ${priority.lightBg} overflow-hidden`}>
                                                            <motion.div
                                                                className={`h-full ${priority.color} rounded-full`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 0.8, delay: idx * 0.15 }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-gray-400">
                                            No priority data available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Project Progress */}
                    <motion.div variants={item}>
                        <Card className="glass-card border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderKanban className="h-5 w-5 text-indigo-600" />
                                    Project Progress
                                </CardTitle>
                                <CardDescription>Overview of all your projects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-40 flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                    </div>
                                ) : projectStats.length > 0 ? (
                                    <div className="space-y-4">
                                        {projectStats.map((project, idx) => (
                                            <motion.div
                                                key={project.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <Link href={`/projects/${project.id}`}>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                            {project.name}
                                                        </h4>
                                                    </Link>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                            {project.completed}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4 text-blue-500" />
                                                            {project.inProgress}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <ListTodo className="h-4 w-4 text-amber-500" />
                                                            {project.todo}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${project.progress}%` }}
                                                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-indigo-600 min-w-[45px]">
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-40 flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p>No projects yet</p>
                                            <Link href="/projects/new">
                                                <Button variant="link" className="text-indigo-600">
                                                    Create your first project
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
