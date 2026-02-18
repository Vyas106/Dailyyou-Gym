'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import Input from '../components/Input';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [gymData, setGymData] = useState<any>(null);
    const [connectionCode, setConnectionCode] = useState('');
    const [addMemberMessage, setAddMemberMessage] = useState('');
    const [isAdding, setIsAdding] = useState(false);

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
            // Changed from /api/gym to /api/gyms to match the route we created
            const res = await fetch('/api/gyms', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setGymData(data.gym);
            }
        } catch (error) {
            console.error("Error fetching gym data", error);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!connectionCode) return;

        setIsAdding(true);
        setAddMemberMessage('');

        try {
            const token = localStorage.getItem('gym_auth_token');
            // Changed from /api/gym/members to /api/gyms/members
            const res = await fetch('/api/gyms/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ connectionCode })
            });

            const data = await res.json();
            if (res.ok) {
                setAddMemberMessage(`Success: ${data.message}`);
                setConnectionCode('');
                fetchGymData();
            } else {
                setAddMemberMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setAddMemberMessage('Error adding member');
        } finally {
            setIsAdding(false);
        }
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
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {user.name?.split(' ')[0]}
                    </h1>
                    <p className="text-muted-foreground">
                        Your gym is running smoothly. You have{' '}
                        <span className="text-primary font-semibold">{gymData.members?.length || 1} members</span>
                        {' '}total.
                    </p>
                </div>


                {/* Action Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ActionCard
                        title="Add Member"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        }
                        color="blue"
                        onClick={() => document.getElementById('add-member-input')?.focus()}
                    />
                    <ActionCard
                        title="View Members"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        }
                        color="purple"
                        onClick={() => router.push('/dashboard/members')}
                    />
                    <ActionCard
                        title="Gym Settings"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                        }
                        color="green"
                        onClick={() => router.push('/dashboard/settings')}
                    />
                    <ActionCard
                        title="Reports"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                        color="orange"
                        onClick={() => { }} // Placeholder
                    />
                </div>

                {/* Main Content Grid */}
                {/* ... (rest of the content) ... */}

                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-lg p-6">
                        {/* ... */}
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <Input
                                id="add-member-input"
                                label="Member Connection Code"
                                // ...
                                placeholder="Enter 6-digit code"
                                value={connectionCode}
                                onChange={e => setConnectionCode(e.target.value)}
                                maxLength={6}
                                className="text-center font-mono text-lg tracking-widest uppercase"
                            />
                            <p className="text-xs text-muted-foreground">
                                Ask the member to find this code in their mobile app under Progress → Connect to Gym.
                            </p>

                            {addMemberMessage && (
                                <div className={`p-3 rounded-lg text-sm ${addMemberMessage.startsWith('Error') ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-400'}`}>
                                    {addMemberMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!connectionCode || isAdding}
                                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 font-medium transition-opacity"
                            >
                                {isAdding ? 'Adding...' : 'Add Member'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Gym Overview Card */}
                <div className="lg:col-span-2">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Gym Overview
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-muted-foreground mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium">{gymData.name}</p>
                                    <p className="text-sm text-muted-foreground">{gymData.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-muted-foreground mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium">Contact</p>
                                    <p className="text-sm text-muted-foreground">{gymData.contactNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-muted-foreground mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium">Working Days</p>
                                    <p className="text-sm text-muted-foreground">
                                        {Array.isArray(gymData.workingDays) ? gymData.workingDays.join(', ') : gymData.workingDays}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout >
    );
}


function ActionCard({ title, icon, color, onClick }: { title: string; icon: React.ReactNode; color: string; onClick?: () => void }) {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-500',
        purple: 'bg-purple-500/10 text-purple-500',
        green: 'bg-green-500/10 text-green-500',
        orange: 'bg-orange-500/10 text-orange-500',
    };

    return (
        <button
            onClick={onClick}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors text-left group w-full"
        >
            <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
        </button>
    );
}
