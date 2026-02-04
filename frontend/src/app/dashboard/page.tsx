'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layout, CheckCircle, Clock, AlertCircle, ArrowRight, BarChart3, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

// Mock data for "Wow" factor if API is empty
const MOCK_STATS = [
    { label: 'Total Projects', value: '12', icon: Layout, color: 'text-blue-500', bg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40', glow: 'group-hover:shadow-blue-500/30' },
    { label: 'Completed Tasks', value: '64', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40', glow: 'group-hover:shadow-emerald-500/30' },
    { label: 'In Progress', value: '8', icon: Clock, color: 'text-amber-500', bg: 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40', glow: 'group-hover:shadow-amber-500/30' },
    { label: 'Team Members', value: '24', icon: Users, color: 'text-violet-500', bg: 'bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40', glow: 'group-hover:shadow-violet-500/30' },
];

interface Project {
    id: string;
    name: string;
    description?: string;
    tasks?: any[];
}

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        show: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15
            }
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 md:p-8">
                {/* Subtle background decoration */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="relative z-10 max-w-7xl mx-auto space-y-8"
                >
                    {/* Header Section */}
                    <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <motion.div
                                    initial={{ rotate: -10, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                >
                                    <Sparkles className="w-8 h-8 text-amber-500" />
                                </motion.div>
                                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Welcome back, <span className="font-semibold text-gray-700 dark:text-gray-200">Muhammad</span>. Here's what's happening today.
                            </p>
                        </div>
                        <motion.div
                            variants={item}
                            className="flex items-center gap-3"
                        >
                            <Link href="/reports">
                                <Button variant="outline" className="hidden sm:flex group border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
                                    <BarChart3 className="mr-2 h-4 w-4 group-hover:text-purple-500 transition-colors" />
                                    View Reports
                                </Button>
                            </Link>
                            <Link href="/projects/new">
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 btn-premium">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Project
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {MOCK_STATS.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Card className={`group relative overflow-hidden border-0 shadow-md hover:shadow-xl ${stat.glow} transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <CardContent className="relative p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                            <motion.h3
                                                className="text-3xl font-bold mt-1 text-gray-900 dark:text-white"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3 + idx * 0.1, type: "spring", stiffness: 100 }}
                                            >
                                                {projects.length && stat.label === 'Total Projects' ? projects.length : stat.value}
                                            </motion.h3>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>+12%</span>
                                            </div>
                                        </div>
                                        <motion.div
                                            className={`p-4 rounded-2xl ${stat.bg} transition-transform duration-300 group-hover:scale-110`}
                                            whileHover={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Recent Projects Section */}
                    <motion.div variants={item} className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Recent Projects
                            </h2>
                            <Link href="/projects" className="text-sm font-medium text-purple-600 hover:text-purple-500 flex items-center group transition-colors">
                                View all
                                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                >
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                                            <div className="absolute inset-0 shimmer" />
                                        </div>
                                    ))}
                                </motion.div>
                            ) : projects.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800 bg-transparent hover:border-purple-300 dark:hover:border-purple-800 transition-colors duration-300">
                                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                            <motion.div
                                                className="p-5 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-5"
                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <Layout className="w-10 h-10 text-purple-500" />
                                            </motion.div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No projects yet</h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2 mb-6">
                                                Get started by creating your first project to organize tasks and manage your team.
                                            </p>
                                            <Link href="/projects/new">
                                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 btn-premium">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create Project
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="projects"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {projects.map((project: Project, index: number) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                        >
                                            <Link href={`/projects/${project.id}`}>
                                                <Card className="group cursor-pointer relative overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm card-hover">
                                                    {/* Gradient accent bar */}
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                    {/* Hover glow effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    <CardHeader className="relative">
                                                        <div className="flex justify-between items-start">
                                                            <CardTitle className="text-lg font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                                                                {project.name}
                                                            </CardTitle>
                                                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/50 dark:to-pink-900/50 dark:text-purple-300 border-0">
                                                                Active
                                                            </Badge>
                                                        </div>
                                                        <CardDescription className="line-clamp-2 mt-1">
                                                            {project.description || "No description provided."}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                                                            <div className="flex items-center gap-2">
                                                                <Layout className="w-4 h-4" />
                                                                <span>{project.tasks?.length || 0} Tasks</span>
                                                            </div>
                                                            <div className="flex -space-x-2">
                                                                {[1, 2, 3].map(i => (
                                                                    <Avatar key={i} className="w-7 h-7 border-2 border-white dark:border-gray-900 transition-transform hover:scale-110 hover:z-10">
                                                                        <AvatarFallback className="text-[10px] bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 text-purple-700 dark:text-purple-200">U{i}</AvatarFallback>
                                                                    </Avatar>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
