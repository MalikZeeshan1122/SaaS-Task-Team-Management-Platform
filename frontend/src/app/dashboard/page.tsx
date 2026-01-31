'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Layout, CheckCircle, Clock, AlertCircle, ArrowRight, BarChart3, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Mock data for "Wow" factor if API is empty
const MOCK_STATS = [
    { label: 'Total Projects', value: '12', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Completed Tasks', value: '64', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'In Progress', value: '8', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Team Members', value: '24', icon: Users, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
];

interface Project {
    id: string;
    name: string;
    description?: string;
    tasks?: any[]; // Keep as any for now or define Task interface if known
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
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background p-8">
            <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Header Section */}
                <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                            Welcome back, Muhammad. Here's what's happening today.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="hidden sm:flex">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Reports
                        </Button>
                        <Link href="/projects/new">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                                <Plus className="mr-2 h-4 w-4" />
                                New Project
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_STATS.map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all duration-300 dark:bg-card">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{projects.length && stat.label === 'Total Projects' ? projects.length : stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Recent Projects Section */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Recent Projects</h2>
                        <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center group">
                            View all
                            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                    <Layout className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No projects yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2 mb-6">
                                    Get started by creating your first project to organize tasks and manage your team.
                                </p>
                                <Link href="/projects/new">
                                    <Button>Create Project</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project: Project) => (
                                <Link key={project.id} href={`/projects/${project.id}`}>
                                    <Card className="group cursor-pointer border-none shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {project.name}
                                                </CardTitle>
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
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
                                                        <Avatar key={i} className="w-6 h-6 border-2 border-white dark:border-gray-900">
                                                            <AvatarFallback className="text-[10px] bg-gray-200 dark:bg-gray-700">U{i}</AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
