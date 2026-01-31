'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import KanbanBoard from '../../../components/KanbanBoard';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

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

    if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
    if (!project) return <div className="p-6 text-red-500">Project not found</div>;

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
        // Optimistic update
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
        <div className="min-h-screen bg-white p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mb-2 inline-block text-sm">&larr; Back to Dashboard</Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
                        <Dialog open={isEditing} onOpenChange={setIsEditing}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Project</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleUpdateProject}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <p className="text-gray-500 mt-1">{project.description}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('list')}
                        className={`px-3 py-1 rounded text-sm ${view === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setView('board')}
                        className={`px-3 py-1 rounded text-sm ${view === 'board' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Board
                    </button>
                    <Link href={`/projects/${id}/tasks/new`} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center">
                        + New
                    </Link>
                </div>
            </div>

            {view === 'board' ? (
                <div className="flex-1 overflow-hidden">
                    <KanbanBoard tasks={project.tasks || []} onTaskUpdate={handleTaskUpdate} onDeleteTask={handleDeleteTask} projectId={project.id} />
                </div>
            ) : (
                <div className="space-y-3">
                    {project.tasks?.length === 0 && <p className="text-gray-500">No tasks yet.</p>}
                    {project.tasks?.map((task: any) => (
                        <div key={task.id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md flex justify-between items-center transition bg-white">
                            <div>
                                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                <p className="text-sm text-gray-500">{task.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {task.status}
                                </span>
                                <Link
                                    href={`/projects/${id}/tasks/${task.id}/edit`}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
