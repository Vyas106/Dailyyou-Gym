'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '../../components/SidebarLayout';

export default function MembersPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [gymData, setGymData] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);

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
                setMembers(data.gym.membersWithDetails || []);
                setGymData(data.gym);
            }
        } catch (error) {
            console.error("Error fetching gym data", error);
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
                    <h1 className="text-4xl font-bold mb-2">Gym Members</h1>
                    <p className="text-muted-foreground">
                        Manage your gym members and track their progress
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Members</p>
                                <p className="text-2xl font-bold">{members.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Members</p>
                                <p className="text-2xl font-bold">{members.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">New This Month</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members List */}
                <div className="bg-card border border-border rounded-lg">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold">All Members</h2>
                    </div>
                    <div className="p-6">
                        {members.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="text-muted-foreground mb-2">No members yet</p>
                                <p className="text-sm text-muted-foreground">Add members using their connection code from the dashboard</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {members.map((member, index) => (
                                    <div key={member.userId || index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg font-semibold text-primary">
                                                {member.name ? member.name.charAt(0).toUpperCase() : (index + 1)}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{member.name || `Member #${index + 1}`}</p>
                                            <p className="text-sm text-muted-foreground">{member.email || 'No email'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {member.joinedAt ? `Joined ${new Date(member.joinedAt).toLocaleDateString()}` : 'Member'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/dashboard/members/${member.userId}`)}
                                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
