'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, User, Mail, Lock, Save, Shield, Bell, Palette,
    LogOut, Loader2, CheckCircle, AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setUser(res.data);
            setFormData(prev => ({
                ...prev,
                name: res.data.name || '',
                email: res.data.email || ''
            }));
        } catch (err) {
            console.error('Failed to fetch user profile', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.patch('/users/me', {
                name: formData.name,
                email: formData.email
            });
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.patch('/users/me/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setSuccess('Password changed successfully!');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center">
                <div className="flex items-center gap-3 text-indigo-600">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg font-medium">Loading settings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-6 md:p-8">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-500/5 to-pink-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage your account preferences
                        </p>
                    </div>
                    <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                {/* Alerts */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300"
                    >
                        <CheckCircle className="h-5 w-5" />
                        {success}
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300"
                    >
                        <AlertTriangle className="h-5 w-5" />
                        {error}
                    </motion.div>
                )}

                <div className="grid gap-6">
                    {/* Profile Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="glass-card border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-indigo-600" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name" className="flex items-center gap-2 mb-2 font-semibold">
                                                <User className="h-4 w-4 text-indigo-500" />
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-glow"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="flex items-center gap-2 mb-2 font-semibold">
                                                <Mail className="h-4 w-4 text-indigo-500" />
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-glow"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white btn-premium"
                                    >
                                        {saving ? (
                                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                                        ) : (
                                            <><Save className="h-4 w-4 mr-2" /> Save Changes</>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Security Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="glass-card border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-indigo-600" />
                                    Security
                                </CardTitle>
                                <CardDescription>Change your password</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <Label htmlFor="currentPassword" className="flex items-center gap-2 mb-2 font-semibold">
                                            <Lock className="h-4 w-4 text-amber-500" />
                                            Current Password
                                        </Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="input-glow"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="newPassword" className="flex items-center gap-2 mb-2 font-semibold">
                                                <Lock className="h-4 w-4 text-emerald-500" />
                                                New Password
                                            </Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                className="input-glow"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2 font-semibold">
                                                <Lock className="h-4 w-4 text-emerald-500" />
                                                Confirm New Password
                                            </Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="input-glow"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        variant="outline"
                                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
                                    >
                                        {saving ? (
                                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
                                        ) : (
                                            <><Lock className="h-4 w-4 mr-2" /> Change Password</>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Danger Zone */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                    <AlertTriangle className="h-5 w-5" />
                                    Danger Zone
                                </CardTitle>
                                <CardDescription>Irreversible actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-800/50">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Sign out of all devices</h4>
                                        <p className="text-sm text-gray-500">This will sign you out of your current session</p>
                                    </div>
                                    <Button
                                        onClick={handleSignOut}
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
