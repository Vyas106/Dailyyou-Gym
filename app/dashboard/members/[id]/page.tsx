'use client';

import { useAuth } from '../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '../../../components/SidebarLayout';

export default function MemberDetailPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const memberId = params.id as string;

    const [memberProfile, setMemberProfile] = useState<any>(null);
    const [statsRange, setStatsRange] = useState('24h');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [meals, setMeals] = useState<any[]>([]);
    const [nutritionTotals, setNutritionTotals] = useState({
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
        mealCount: 0
    });

    const [plans, setPlans] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        joiningDate: '',
        planId: '',
        discount: 0
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    const [hasMounted, setHasMounted] = useState(false);

    const [exercises, setExercises] = useState<any[]>([]);
    const [assignedWorkouts, setAssignedWorkouts] = useState<any[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignForm, setAssignForm] = useState({
        exerciseId: '',
        sets: '',
        reps: '',
        weight: '',
        notes: ''
    });

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (!user.gymId) {
                router.push('/create-gym');
            } else {
                fetchMemberData();
                fetchMemberProfile();
                fetchPlans();
                fetchGymExercises();
            }
        }
    }, [user, isLoading, router, memberId]);

    const fetchGymExercises = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/gym-exercises', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setExercises(data.exercises || []);
            }
        } catch (error) {
            console.error("Error fetching exercises", error);
        }
    };

    const fetchAssignedWorkouts = async (date: Date) => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const dateStr = date.toISOString().split('T')[0];
            const res = await fetch(`/api/members/${memberId}/workouts?date=${dateStr}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAssignedWorkouts(data.workouts || []);
            }
        } catch (error) {
            console.error("Error fetching workouts", error);
        }
    };

    const handleAssignExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('gym_auth_token');
            const selectedExercise = exercises.find(ex => ex.exerciseId === assignForm.exerciseId);

            const res = await fetch(`/api/members/${memberId}/workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: selectedDate.toISOString().split('T')[0],
                    exerciseId: assignForm.exerciseId,
                    exerciseName: selectedExercise?.name,
                    sets: assignForm.sets,
                    reps: assignForm.reps,
                    weight: assignForm.weight,
                    notes: assignForm.notes
                })
            });

            if (res.ok) {
                setIsAssigning(false);
                setAssignForm({
                    exerciseId: '',
                    sets: '',
                    reps: '',
                    weight: '',
                    notes: ''
                });
                fetchAssignedWorkouts(selectedDate);
            } else {
                alert('Failed to assign exercise');
            }
        } catch (error) {
            console.error("Error assigning exercise", error);
            alert('Error assigning exercise');
        }
    };

    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/plans', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setPlans(data.plans);
                }
            }
        } catch (error) {
            console.error("Error fetching plans", error);
        }
    };

    const fetchMemberProfile = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch(`/api/members/${memberId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setMemberProfile(data.profile);
                    // Initialize edit form
                    setEditForm({
                        joiningDate: data.profile.joinedAt ? new Date(data.profile.joinedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        planId: data.profile.planId || '',
                        discount: data.profile.discount || 0
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching member profile", error);
        }
    };

    const handleUpdateMember = async () => {
        setUpdateLoading(true);
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch(`/api/members/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    joiningDate: editForm.joiningDate,
                    planId: editForm.planId,
                    discount: Number(editForm.discount)
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setIsEditing(false);
                    fetchMemberProfile(); // Refresh data
                } else {
                    alert('Failed to update member: ' + data.message);
                }
            } else {
                alert('Failed to update member');
            }
        } catch (error) {
            console.error("Error updating member", error);
            alert('Error updating member');
        } finally {
            setUpdateLoading(false);
        }
    };

    const fetchMemberData = async () => {
        // Combined data fetch
        // We'll rely on fetchMemberProfile to get user details
    };

    const fetchMealsForDate = async (date: Date) => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const dateStr = date.toISOString().split('T')[0];
            const res = await fetch(`/api/members/${memberId}/nutrition?date=${dateStr}&range=24h`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMeals(data.mealsList || []);
                if (statsRange === '24h') {
                    setNutritionTotals(data.totals);
                }
            }
        } catch (error) {
            console.error("Error fetching meals", error);
        }
    };

    const fetchNutritionStats = async () => {
        if (statsRange === '24h') {
            fetchMealsForDate(selectedDate);
            return;
        }
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch(`/api/members/${memberId}/nutrition?range=${statsRange}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNutritionTotals(data.totals);
            }
        } catch (error) {
            console.error("Error fetching nutrition stats", error);
        }
    };

    const navigateDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    useEffect(() => {
        if (memberId) {
            fetchMealsForDate(selectedDate);
            fetchAssignedWorkouts(selectedDate);
        }
    }, [selectedDate, memberId]);

    useEffect(() => {
        if (memberId) {
            fetchNutritionStats();
        }
    }, [statsRange, memberId]);

    // Derived state for memberData to support existing JSX
    const memberData = memberProfile || { name: 'Loading...', email: '', joinedAt: null };
    const currentPlan = plans.find(p => p.id === memberProfile?.planId);

    // Loading State
    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Member Loading State
    if (!memberProfile) {
        return (
            <SidebarLayout>
                <div className="p-8 flex items-center justify-center h-full">
                    <p>Loading Member Details...</p>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                    <span className="text-3xl font-bold text-primary">
                                        {memberData.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-center">{memberData.name}</h2>
                                <p className="text-xs text-muted-foreground">{memberData.email}</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs text-muted-foreground">Membership Details</p>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            {isEditing ? 'Cancel' : 'Edit'}
                                        </button>
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-3 mt-2">
                                            <div>
                                                <label className="text-xs font-medium block mb-1">Joining Date</label>
                                                <input
                                                    type="date"
                                                    value={editForm.joiningDate}
                                                    onChange={(e) => setEditForm({ ...editForm, joiningDate: e.target.value })}
                                                    className="w-full text-sm px-2 py-1 border border-border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium block mb-1">Plan</label>
                                                <select
                                                    value={editForm.planId}
                                                    onChange={(e) => setEditForm({ ...editForm, planId: e.target.value })}
                                                    className="w-full text-sm px-2 py-1 border border-border rounded"
                                                >
                                                    <option value="">Select Plan</option>
                                                    {plans.map(plan => (
                                                        <option key={plan.id} value={plan.id}>
                                                            {plan.name} - ₹{plan.price}/{plan.duration}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium block mb-1">Discount (%)</label>
                                                <input
                                                    type="number"
                                                    value={editForm.discount}
                                                    onChange={(e) => setEditForm({ ...editForm, discount: Number(e.target.value) })}
                                                    className="w-full text-sm px-2 py-1 border border-border rounded"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <button
                                                onClick={handleUpdateMember}
                                                disabled={updateLoading}
                                                className="w-full py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                                            >
                                                {updateLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Joined Date</p>
                                                <p className="text-sm font-medium">
                                                    {memberData.joinedAt && hasMounted ? new Date(memberData.joinedAt).toLocaleDateString() : '---'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Plan</p>
                                                {currentPlan ? (
                                                    <p className="text-sm font-medium">
                                                        {currentPlan.name} ({currentPlan.duration})
                                                    </p>
                                                ) : (
                                                    <div className="mt-1">
                                                        <p className="text-sm font-medium text-amber-600 mb-2">No Plan Assigned</p>
                                                        <button
                                                            onClick={() => setIsEditing(true)}
                                                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                                                        >
                                                            Select Plan
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {memberData.discount > 0 && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Discount</p>
                                                    <p className="text-sm font-medium text-green-600">
                                                        {memberData.discount}% Off
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="pt-2 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Info Card */}
                        {memberProfile && (
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="font-semibold mb-4">Member Details</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Height</p>
                                            <p className="text-sm font-medium">{memberProfile.height || 'N/A'} cm</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Weight</p>
                                            <p className="text-sm font-medium">{memberProfile.weight || 'N/A'} kg</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Gender</p>
                                            <p className="text-sm font-medium capitalize">{memberProfile.gender || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Age</p>
                                            <p className="text-sm font-medium">{memberProfile.age || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {memberProfile.weightGoal && (
                                        <div className="pt-2 border-t border-border">
                                            <p className="text-xs text-muted-foreground mb-1">Weight Goal</p>
                                            <p className="text-sm font-medium">{memberProfile.weightGoal} kg</p>
                                        </div>
                                    )}

                                    {memberProfile.conditions && (
                                        <div className="pt-2 border-t border-border">
                                            <p className="text-xs text-muted-foreground mb-1">Medical Conditions</p>
                                            <p className="text-sm font-medium text-amber-600">{memberProfile.conditions}</p>
                                        </div>
                                    )}
                                    {memberProfile.dietaryPreferences && (
                                        <div className="pt-2 border-t border-border">
                                            <p className="text-xs text-muted-foreground mb-1">Dietary Preferences</p>
                                            <p className="text-sm font-medium">{memberProfile.dietaryPreferences}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Workouts Section */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                    Workouts for {hasMounted ? new Date(selectedDate).toLocaleDateString() : '---'}
                                </h3>
                                <button
                                    onClick={() => setIsAssigning(true)}
                                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
                                >
                                    Add Exercise
                                </button>
                            </div>

                            {assignedWorkouts.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">No exercises assigned for this date.</p>
                            ) : (
                                <div className="space-y-3">
                                    {assignedWorkouts.map((workout) => (
                                        <div key={workout.id} className="p-4 rounded-lg bg-accent/30 border border-border">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{workout.exerciseName}</h4>
                                                    <p className="text-sm text-muted-foreground">{workout.sets} sets x {workout.reps} reps @ {workout.weight}kg</p>
                                                    {workout.notes && <p className="text-xs text-muted-foreground mt-1">Note: {workout.notes}</p>}
                                                </div>
                                                <div className="text-xs px-2 py-1 rounded bg-background border border-border">
                                                    {workout.completed ? 'Completed' : 'Pending'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nutrition Card */}
                        <div className="bg-card border border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">
                                    {statsRange === '24h' ? "Today's Nutrition" : `Average Nutrition (${statsRange === '7d' ? '7 Days' : statsRange === '15d' ? '15 Days' : '30 Days'})`}
                                </h3>
                                <div className="flex bg-muted/30 rounded-lg p-1">
                                    {['24h', '7d', '15d', '30d'].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setStatsRange(range)}
                                            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${statsRange === range
                                                ? 'bg-background shadow-sm text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {range === '24h' ? '24h' : range.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center mb-2">
                                        <span className="text-2xl font-bold">{Math.round(nutritionTotals.calories)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">CALORIES {statsRange !== '24h' && '(Avg)'}</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500/20 flex items-center justify-center mb-2">
                                        <span className="text-2xl font-bold text-blue-500">{Math.round(nutritionTotals.protein)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">PROTEIN (g)</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-orange-500/20 flex items-center justify-center mb-2">
                                        <span className="text-2xl font-bold text-orange-500">{Math.round(nutritionTotals.carbohydrates)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">CARBS (g)</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-red-500/20 flex items-center justify-center mb-2">
                                        <span className="text-2xl font-bold text-red-500">{Math.round(nutritionTotals.fats)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">FATS (g)</p>
                                </div>
                            </div>
                            {statsRange === '24h' && (
                                <div className="mt-4 pt-4 border-t border-border text-center">
                                    <p className="text-sm text-muted-foreground">{nutritionTotals.mealCount} meals logged today</p>
                                </div>
                            )}
                        </div>

                        {/* Meals List */}
                        <div className="bg-card border border-border rounded-lg">
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Meals for {hasMounted ? new Date(selectedDate).toLocaleDateString() : '---'}</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigateDate(-1)}
                                        className="p-2 hover:bg-accent rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className="text-sm font-medium min-w-[100px] text-center">
                                        {hasMounted ? new Date(selectedDate).toLocaleDateString() : '---'}
                                    </span>
                                    <button
                                        onClick={() => navigateDate(1)}
                                        className="p-2 hover:bg-accent rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {meals.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p className="text-muted-foreground mb-2">No meals logged</p>
                                        <p className="text-sm text-muted-foreground">Member hasn't logged any meals for this date</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {meals.map((meal: any, index: number) => (
                                            <div key={meal.mealId || index} className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                                                {meal.imageUrl && (
                                                    <img
                                                        src={meal.imageUrl}
                                                        alt={meal.mealName}
                                                        className="w-20 h-20 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium">{meal.mealName}</p>
                                                    <p className="text-xs text-muted-foreground">{meal.servingSize}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {hasMounted ? new Date(meal.createdAt).toLocaleTimeString() : '---'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-4 text-center">
                                                    <div>
                                                        <p className="text-lg font-bold">{Math.round(meal.calories)}</p>
                                                        <p className="text-xs text-muted-foreground">cal</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold text-blue-500">{Math.round(meal.protein)}</p>
                                                        <p className="text-xs text-muted-foreground">P</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold text-orange-500">{Math.round(meal.carbohydrates)}</p>
                                                        <p className="text-xs text-muted-foreground">C</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold text-red-500">{Math.round(meal.fats)}</p>
                                                        <p className="text-xs text-muted-foreground">F</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Assigning Exercise */}
            {isAssigning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg w-full max-w-md border border-border">
                        <h3 className="text-lg font-semibold mb-4">Assign Exercise</h3>
                        <form onSubmit={handleAssignExercise} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Exercise</label>
                                <select
                                    value={assignForm.exerciseId}
                                    onChange={(e) => setAssignForm({ ...assignForm, exerciseId: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                    required
                                >
                                    <option value="">Select Exercise</option>
                                    {exercises.map(ex => (
                                        <option key={ex.exerciseId} value={ex.exerciseId}>{ex.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sets</label>
                                    <input
                                        type="number"
                                        value={assignForm.sets}
                                        onChange={(e) => setAssignForm({ ...assignForm, sets: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                        placeholder="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Reps</label>
                                    <input
                                        type="number"
                                        value={assignForm.reps}
                                        onChange={(e) => setAssignForm({ ...assignForm, reps: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                        placeholder="12"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={assignForm.weight}
                                        onChange={(e) => setAssignForm({ ...assignForm, weight: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                        placeholder="20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    value={assignForm.notes}
                                    onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                    rows={2}
                                    placeholder="Instructions..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAssigning(false)}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
