'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/projects')
            .then((res) => setProjects(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
            <Link href="/projects/new" className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
                + New Project
            </Link>

            {loading ? (
                <p className="mt-4 text-gray-600">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {projects.map((p: any) => (
                        <Link key={p.id} href={`/projects/${p.id}`} className="block">
                            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                                <h2 className="text-xl font-bold text-gray-800">{p.name || 'Untitled Project'}</h2>
                                <p className="text-gray-600">{p.description || 'No description'}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    Tasks: {p.tasks?.length || 0}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
