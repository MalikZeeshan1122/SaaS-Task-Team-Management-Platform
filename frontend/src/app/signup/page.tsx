'use client';
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', { name, email, password });
            alert('Signup successful! Please login.');
            router.push('/login');
        } catch (err) {
            alert('Signup failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSignup} className="p-8 bg-white rounded shadow-md w-96">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">Sign Up</h1>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-gray-800"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-gray-800"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-gray-800"
                    required
                />
                <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
                    Sign Up
                </button>
                <div className="mt-4 text-center">
                    <Link href="/login" className="text-blue-500 hover:underline">Already have an account?</Link>
                </div>
            </form>
        </div>
    );
}
