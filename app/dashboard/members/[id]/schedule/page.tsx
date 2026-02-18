'use client';

import { useAuth } from '../../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '../../../../components/SidebarLayout';

const DAYS = [
    { name: 'Monday', short: 'Mon', value: 1 },
    { name: 'Tuesday', short: 'Tue', value: 2 },
    { name: 'Wednesday', short: 'Wed', value: 3 },
    { name: 'Thursday', short: 'Thu', value: 4 },
    { name: 'Friday', short: 'Fri', value: 5 },
    { name: 'Saturday', short: 'Sat', value: 6 },
    { name: 'Sunday', short: 'Sun', value: 0 },
];

export default function MemberSchedulePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const memberId = params.id as string;

    const [activeDay, setActiveDay] = useState(1);
    const [memberData, setMemberData] = useState<any>(null);
    const [weekPlan, setWeekPlan] = useState<any>({});
    const [exercises, setExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDayPlanModal, setShowDayPlanModal] = useState(false);
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [dayPlanText, setDayPlanText] = useState('');

    // New State for Completed Exercises
    const [completedExercises, setCompletedExercises] = useState<any[]>([]);

    const quickExercises = ['Squats', 'Deadlifts', 'Bench Press', 'Pull-ups', 'Lunges', 'Rows', 'Planks', 'Burpees'];

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (!user.gymId) {
                router.push('/create-gym');
            } else {
                fetchMemberData();
                fetchExercises();
                fetchSchedule();
            }
        }
    }, [user, isLoading, router, memberId]);

    // Fetch logs when active day changes
    useEffect(() => {
        if (memberId && activeDay !== undefined) {
            fetchWorkoutLog();
        }
    }, [memberId, activeDay]);

    const getDateForDay = (dayValue: number) => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 (Sun) - 6 (Sat)
        const diff = dayValue - currentDay;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        return targetDate.toISOString().split('T')[0];
    };

    const fetchWorkoutLog = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const date = getDateForDay(activeDay);

            const res = await fetch(`/api/workout-logs/member/${memberId}?date=${date}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setCompletedExercises(data.log?.exercises || []);
            } else {
                setCompletedExercises([]);
            }
        } catch (error) {
            console.error("Error fetching logs", error);
            setCompletedExercises([]);
        }
    };

    const fetchMemberData = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const gymRes = await fetch('/api/gyms', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (gymRes.ok) {
                const gymData = await gymRes.json();
                const member = gymData.gym.membersWithDetails?.find((m: any) => m.userId === memberId);
                if (member) {
                    setMemberData(member);
                } else {
                    router.push('/dashboard/members');
                }
            }
        } catch (error) {
            console.error("Error fetching member data", error);
        }
    };

    const fetchExercises = async () => {
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

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch(`/api/workout-plans/member/${memberId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWeekPlan(data.plans || {});
            }
        } catch (error) {
            console.error("Error fetching schedule", error);
        } finally {
            setLoading(false);
        }
    };

    const saveDayPlan = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const dayInfo = DAYS.find(d => d.value === activeDay);

            const res = await fetch(`/api/workout-plans/member/${memberId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    dayOfWeek: activeDay,
                    dayName: dayInfo?.name,
                    dayPlan: dayPlanText,
                    exercises: weekPlan[activeDay]?.exercises || []
                })
            });

            if (res.ok) {
                setShowDayPlanModal(false);
                setDayPlanText('');
                fetchSchedule();
            }
        } catch (error) {
            console.error("Error saving day plan", error);
        }
    };

    const addExerciseToDay = async (exercise: any) => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const currentPlan = weekPlan[activeDay];

            if (!currentPlan) {
                const dayInfo = DAYS.find(d => d.value === activeDay);
                const createRes = await fetch(`/api/workout-plans/member/${memberId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        dayOfWeek: activeDay,
                        dayName: dayInfo?.name,
                        dayPlan: '',
                        exercises: [{
                            exerciseId: exercise.exerciseId,
                            exerciseName: exercise.name,
                            sets: exercise.sets,
                            reps: exercise.reps,
                            duration: exercise.duration,
                            restTime: exercise.restTime,
                            notes: '',
                            order: 1
                        }]
                    })
                });

                if (createRes.ok) {
                    setShowExerciseModal(false);
                    fetchSchedule();
                }
            } else {
                const res = await fetch(`/api/workout-plans/${currentPlan.planId}/exercises`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        exerciseId: exercise.exerciseId,
                        exerciseName: exercise.name,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        duration: exercise.duration,
                        restTime: exercise.restTime,
                        notes: ''
                    })
                });

                if (res.ok) {
                    setShowExerciseModal(false);
                    fetchSchedule();
                }
            }
        } catch (error) {
            console.error("Error adding exercise", error);
        }
    };

    const removeExercise = async (order: number) => {
        try {
            const currentPlan = weekPlan[activeDay];
            if (!currentPlan) return;

            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch(`/api/workout-plans/${currentPlan.planId}/exercises/${order}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                fetchSchedule();
            }
        } catch (error) {
            console.error("Error removing exercise", error);
        }
    };

    const currentDayPlan = weekPlan[activeDay];
    const currentDayName = DAYS.find(d => d.value === activeDay)?.name;
    const totalExercises = Object.values(weekPlan).reduce((acc: number, plan: any) =>
        acc + (plan?.exercises?.length || 0), 0);

    const isExerciseCompleted = (exerciseId: string) => {
        return completedExercises.some(ce => ce.exerciseId === exerciseId);
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push(`/dashboard/members/${memberId}`)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Member Details
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Weekly Workout Schedule
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {memberData?.name}'s personalized training plan
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4 min-w-[200px]">
                            <p className="text-sm text-muted-foreground mb-1">Total Exercises</p>
                            <p className="text-3xl font-bold text-primary">{totalExercises}</p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Day Tabs */}
                <div className="bg-card border border-border rounded-xl mb-8 overflow-hidden">
                    <div className="grid grid-cols-7 divide-x divide-border">
                        {DAYS.map((day) => {
                            const dayHasContent = weekPlan[day.value]?.dayPlan || weekPlan[day.value]?.exercises?.length > 0;
                            return (
                                <button
                                    key={day.value}
                                    onClick={() => setActiveDay(day.value)}
                                    className={`relative px-4 py-4 font-medium transition-all hover:bg-primary/5 ${activeDay === day.value
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-xs mb-1 opacity-70">{day.short}</div>
                                        <div className="font-bold">{day.name.slice(0, 3)}</div>
                                        {dayHasContent && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-2"></div>
                                        )}
                                    </div>
                                    {activeDay === day.value && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Day Plan Section */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold">{currentDayName} Plan</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setDayPlanText(currentDayPlan?.dayPlan || '');
                                        setShowDayPlanModal(true);
                                    }}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentDayPlan?.dayPlan ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                                    </svg>
                                    {currentDayPlan?.dayPlan ? 'Edit' : 'Add'}
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {currentDayPlan?.dayPlan ? (
                                <div className="prose prose-sm max-w-none">
                                    <div className="bg-accent/30 rounded-lg p-4 border border-border">
                                        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{currentDayPlan.dayPlan}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-muted-foreground font-medium">No plan added yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">Click "Add" to create a plan for this day</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Exercises Section */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{currentDayName} Exercises</h2>
                                        <p className="text-xs text-muted-foreground">
                                            {currentDayPlan?.exercises?.length || 0} exercises • {getDateForDay(activeDay)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowExerciseModal(true)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {currentDayPlan?.exercises && currentDayPlan.exercises.length > 0 ? (
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                    {currentDayPlan.exercises.map((ex: any, index: number) => {
                                        const isDone = isExerciseCompleted(ex.exerciseId);
                                        return (
                                            <div key={ex.order} className={`group relative rounded-lg p-4 border transition-all hover:shadow-md ${isDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gradient-to-r from-accent/30 to-accent/10 border-border'
                                                }`}>
                                                <div className="flex items-start gap-4">
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDone ? 'bg-emerald-500 text-white' : 'bg-primary/20 text-primary'
                                                        }`}>
                                                        {isDone ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className={`font-semibold text-lg ${isDone ? 'text-emerald-500 line-through' : ''}`}>{ex.exerciseName}</h3>
                                                            {isDone && <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">DONE</span>}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {ex.sets && (
                                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-medium">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {ex.sets} sets
                                                                </span>
                                                            )}
                                                            {ex.reps && (
                                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {ex.reps} reps
                                                                </span>
                                                            )}
                                                            {ex.duration && (
                                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-medium">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {ex.duration}min
                                                                </span>
                                                            )}
                                                            {ex.restTime && (
                                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-medium">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {ex.restTime}s rest
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeExercise(ex.order)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/20 rounded-lg text-destructive transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-muted-foreground font-medium">No exercises added yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">Build your workout by adding exercises</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Day Plan Modal */}
                {showDayPlanModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-card border border-border rounded-2xl max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
                            {/* (Modal Content Omitted for brevity, assuming it was consistent in previous version) */}
                            {/* Re-inserting explicit content to ensure file completion */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b border-border flex items-center justify-between rounded-t-2xl">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    {currentDayName} Plan
                                </h2>
                                <button onClick={() => setShowDayPlanModal(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-3">Plan Notes & Goals</label>
                                    <textarea
                                        value={dayPlanText}
                                        onChange={(e) => setDayPlanText(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border-2 border-border focus:border-primary rounded-xl transition-colors resize-none"
                                        rows={8}
                                        placeholder="Enter workout plan details, goals, or notes for this day..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3">Quick Add Exercise Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {quickExercises.map((ex) => (
                                            <button
                                                key={ex}
                                                type="button"
                                                onClick={() => setDayPlanText(prev => prev ? `${prev}\n- ${ex}` : `- ${ex}`)}
                                                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
                                            >
                                                + {ex}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={saveDayPlan}
                                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                                    >
                                        Save Plan
                                    </button>
                                    <button
                                        onClick={() => setShowDayPlanModal(false)}
                                        className="px-6 py-3 bg-accent text-foreground rounded-xl hover:bg-accent/80 font-semibold transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exercise Picker Modal */}
                {showExerciseModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-card border border-border rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 border-b border-border flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    Add Exercise to {currentDayName}
                                </h2>
                                <button onClick={() => setShowExerciseModal(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                {exercises.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-muted-foreground font-medium mb-6">No exercises available</p>
                                        <button
                                            onClick={() => router.push('/dashboard/exercises')}
                                            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 font-semibold transition-all hover:scale-105 shadow-lg"
                                        >
                                            Create Exercises First
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {exercises.map((exercise) => (
                                            <div
                                                key={exercise.exerciseId}
                                                className="group border-2 border-border hover:border-primary rounded-xl overflow-hidden hover:shadow-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                                                onClick={() => addExerciseToDay(exercise)}
                                            >
                                                {exercise.imageUrl && (
                                                    <div className="w-full h-40 overflow-hidden bg-muted">
                                                        <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-bold text-lg">{exercise.name}</h3>
                                                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium shrink-0">
                                                            {exercise.category}
                                                        </span>
                                                    </div>
                                                    {exercise.description && (
                                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{exercise.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap gap-2">
                                                        {exercise.sets && <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md text-xs font-medium">{exercise.sets} sets</span>}
                                                        {exercise.reps && <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs font-medium">{exercise.reps} reps</span>}
                                                        {exercise.duration && <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded-md text-xs font-medium">{exercise.duration}min</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
