'use client';

import { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PlansPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [plans, setPlans] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);

    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('1 month');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/plans', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPlans(data.plans || []);
            }
        } catch (error) {
            console.error("Error fetching plans", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else {
                fetchPlans();
            }
        }
    }, [user, isLoading]);

    const handleEditClick = (plan: any) => {
        setEditingPlan(plan);
        setName(plan.name);
        setPrice(plan.price.toString());
        setDuration(plan.duration);
        setDescription(plan.description || '');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
        setName('');
        setPrice('');
        setDuration('1 month');
        setDescription('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('gym_auth_token');
            const url = editingPlan ? `/api/plans/${editingPlan.id}` : '/api/plans';
            const method = editingPlan ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    price,
                    duration,
                    description
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `Failed to ${editingPlan ? 'update' : 'create'} plan`);
            }

            // Success
            handleCloseModal();
            fetchPlans(); // Refresh list

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || isFetching) {
        return (
            <SidebarLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Membership Plans</h1>
                        <p className="text-muted-foreground">Manage your gym's membership tiers and pricing.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Plan
                    </button>
                </div>

                {plans.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-9-9a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No plans created yet</h3>
                        <p className="text-muted-foreground mb-6">Create your first membership plan to start enrolling members.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-primary font-medium hover:underline"
                        >
                            Create a plan now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div key={plan.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground">{plan.duration}</p>
                                    </div>
                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                                        ₹{plan.price}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                                    {plan.description || "No description provided."}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(plan)}
                                        className="flex-1 py-2 rounded-md border border-border hover:bg-accent text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Creation/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-card p-8 rounded-xl w-full max-w-md border border-border shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Plan Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., Annual Pro Membership"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Duration</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="1 month">1 Month</option>
                                        <option value="3 months">3 Months</option>
                                        <option value="6 months">6 Months</option>
                                        <option value="1 year">1 Year</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={3}
                                    placeholder="Describe what's included in this plan..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-2 px-4 border border-border rounded-md hover:bg-accent text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2 px-4 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? (editingPlan ? 'Saving...' : 'Creating...') : (editingPlan ? 'Save Changes' : 'Create Plan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
