'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import KanbanBoard from '../../../components/KanbanBoard';
import { motion } from 'framer-motion';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pencil, ArrowLeft, Plus, LayoutGrid, List, Loader2 } from 'lucide-react';

export default function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'board'>('board');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', description: '' });

    useEffect(() => {
        if (id) {
            api.get(`/projects/${id}`)
                .then((res) => {
                    setProject(res.data);
                    setEditForm({ name: res.data.name, description: res.data.description || '' });
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleUpdateProject = async () => {
        try {
            const res = await api.patch(`/projects/${id}`, editForm);
            setProject(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update project');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
            <div className="flex items-center gap-3 text-indigo-600">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg font-medium">Loading project...</span>
            </div>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-500 text-lg font-medium">Project not found</p>
                <Link href="/dashboard" className="text-indigo-600 hover:underline mt-2 inline-block">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            setProject((prev: any) => ({
                ...prev,
                tasks: prev.tasks.filter((t: any) => t.id !== taskId)
            }));
        } catch (err) {
            console.error(err);
            alert('Failed to delete task');
        }
    };

    const handleTaskUpdate = async (id: string, status: string) => {
        setProject((prev: any) => ({
            ...prev,
            tasks: prev.tasks.map((t: any) => t.id === id ? { ...t, status } : t)
        }));

        try {
            await api.patch(`/tasks/${id}`, { status });
        } catch (err) {
            console.error(err);
            alert('Failed to update task status');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-6 flex flex-col">
            {/* Subtle background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-500/5 to-pink-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex-1 flex flex-col max-w-[1600px] mx-auto w-full"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-3 text-sm transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                {project.name}
                            </h1>
                            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                                        <Pencil className="h-4 w-4 text-indigo-600" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" className="font-semibold">Name</Label>
                                            <Input
                                                id="name"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="input-glow"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description" className="font-semibold">Description</Label>
                                            <Input
                                                id="description"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="input-glow"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button onClick={handleUpdateProject} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white">
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {project.description && (
                            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">{project.description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setView('list')}
                                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${view === 'list'
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <List className="h-4 w-4" />
                                List
                            </button>
                            <button
                                onClick={() => setView('board')}
                                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${view === 'board'
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                                Board
                            </button>
                        </div>
                        <Link href={`/projects/${id}/tasks/new`}>
                            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 btn-premium">
                                <Plus className="h-4 w-4 mr-2" />
                                New Task
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                {view === 'board' ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4"
                    >
                        <KanbanBoard tasks={project.tasks || []} onTaskUpdate={handleTaskUpdate} onDeleteTask={handleDeleteTask} projectId={project.id} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        {project.tasks?.length === 0 && (
                            <div className="text-center py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500">No tasks yet. Create your first task!</p>
                            </div>
                        )}
                        {project.tasks?.map((task: any, index: number) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg flex justify-between items-center transition-all duration-300 card-hover"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">{task.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                        }`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <Link
                                        href={`/projects/${id}/tasks/${task.id}/edit`}
                                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
