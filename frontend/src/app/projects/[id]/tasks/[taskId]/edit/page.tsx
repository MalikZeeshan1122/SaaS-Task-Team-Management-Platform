'use client';
import { useState, useEffect, use } from 'react';
import api from '../../../../../../lib/api';
import { useRouter } from 'next/navigation';

export default function EditTask({ params }: { params: Promise<{ id: string, taskId: string }> }) {
    const { id, taskId } = use(params);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [status, setStatus] = useState('TODO');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (taskId) {
            api.get(`/tasks/${taskId}`)
                .then((res) => {
                    const task = res.data;
                    setTitle(task.title);
                    setDescription(task.description || '');
                    setPriority(task.priority);
                    setStatus(task.status);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    alert('Failed to load task');
                    router.back();
                });
        }
    }, [taskId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/tasks/${taskId}`, {
                title,
                description,
                priority,
                status
            });
            router.push(`/projects/${id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-600">Loading Task...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Task</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full p-2 border rounded text-gray-800"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border rounded text-gray-800"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className={`w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {saving ? 'Saving...' : 'Update Task'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full mt-2 p-2 text-gray-600 hover:text-gray-800 transition"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
