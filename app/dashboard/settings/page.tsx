'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import Input from '../../components/Input';

export default function SettingsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [gymData, setGymData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactNumber: '',
        workingDays: [] as string[],
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (!user.gymId) {
                router.push('/create-gym');
            } else {
                fetchGymData();
            }
        }
    }, [user, isLoading, router]);

    const fetchGymData = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/gyms', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setGymData(data.gym);
                setFormData({
                    name: data.gym.name || '',
                    address: data.gym.address || '',
                    contactNumber: data.gym.contactNumber || '',
                    workingDays: Array.isArray(data.gym.workingDays) ? data.gym.workingDays : [],
                });
            }
        } catch (error) {
            console.error("Error fetching gym data", error);
        }
    };

    const handleWorkingDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(day)
                ? prev.workingDays.filter(d => d !== day)
                : [...prev.workingDays, day]
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        // In a real app, you'd have an API endpoint to update gym settings
        // For now, just show a success message
        setTimeout(() => {
            setMessage('Settings updated successfully!');
            setIsSaving(false);
        }, 1000);
    };

    if (isLoading || !user || !gymData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Gym Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your gym information and preferences
                    </p>
                </div>

                {/* Settings Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Settings */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">General Information</h2>
                            <form onSubmit={handleSave} className="space-y-6">
                                <Input
                                    label="Gym Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter gym name"
                                    required
                                />

                                <Input
                                    label="Address"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter gym address"
                                    required
                                />

                                <Input
                                    label="Contact Number"
                                    type="tel"
                                    value={formData.contactNumber}
                                    onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                    placeholder="Enter contact number"
                                    required
                                />

                                {/* Working Days */}
                                <div>
                                    <label className="block text-sm font-medium mb-3">Working Days</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {weekDays.map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => handleWorkingDayToggle(day)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.workingDays.includes(day)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-accent text-foreground hover:bg-accent/80'
                                                    }`}
                                            >
                                                {day.substring(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {formData.workingDays.length} days selected
                                    </p>
                                </div>

                                {message && (
                                    <div className={`p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-400'}`}>
                                        {message}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 font-medium transition-opacity"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fetchGymData()}
                                        className="px-6 py-2 bg-accent text-foreground rounded-md hover:bg-accent/80 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Gym Stats */}
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Members</p>
                                    <p className="text-2xl font-bold">{gymData.members?.length || 1}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Gym ID</p>
                                    <p className="text-sm font-mono">{gymData.id?.substring(0, 8)}...</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="text-sm">{new Date(gymData.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-2 text-destructive">Danger Zone</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Permanently delete this gym and all associated data
                            </p>
                            <button className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 font-medium transition-opacity">
                                Delete Gym
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
