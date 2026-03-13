'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '../../components/SidebarLayout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyWorkoutsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [exercises, setExercises] = useState<any[]>([]);
    const [weeklyPlan, setWeeklyPlan] = useState<any>({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeDay, setActiveDay] = useState('Monday');
    const [showExercisePicker, setShowExercisePicker] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (!user.gymId) {
                router.push('/create-gym');
            } else {
                fetchData();
            }
        }
    }, [user, isLoading, router]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('gym_auth_token');
            const [exRes, planRes] = await Promise.all([
                fetch('/api/gym-exercises', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/gym/weekly-workout', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (exRes.ok) {
                const data = await exRes.json();
                setExercises(data.exercises || []);
            }

            if (planRes.ok) {
                const data = await planRes.json();
                if (data.weeklyPlan) {
                    setWeeklyPlan(data.weeklyPlan);
                }
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePlan = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/gym/weekly-workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ weeklyPlan })
            });

            if (res.ok) {
                alert('Weekly plan saved successfully!');
            } else {
                alert('Failed to save plan');
            }
        } catch (error) {
            console.error("Error saving plan", error);
            alert('Error saving plan');
        } finally {
            setIsSaving(false);
        }
    };

    const addExerciseToDay = (day: string, exercise: any) => {
        setWeeklyPlan({
            ...weeklyPlan,
            [day]: [...(weeklyPlan[day] || []), {
                ...exercise,
                id: Date.now().toString(), // local unique ID for this instance
                sets: exercise.sets || 3,
                reps: exercise.reps || 12,
                weight: ''
            }]
        });
        setShowExercisePicker(false);
    };

    const removeExerciseFromDay = (day: string, index: number) => {
        const updatedDayPlan = [...weeklyPlan[day]];
        updatedDayPlan.splice(index, 1);
        setWeeklyPlan({
            ...weeklyPlan,
            [day]: updatedDayPlan
        });
    };

    const updateExerciseInDay = (day: string, index: number, field: string, value: any) => {
        const updatedDayPlan = [...weeklyPlan[day]];
        updatedDayPlan[index] = { ...updatedDayPlan[index], [field]: value };
        setWeeklyPlan({
            ...weeklyPlan,
            [day]: updatedDayPlan
        });
    };

    if (isLoading || loading) {
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
                        <h1 className="text-3xl font-bold">Weekly Workout Plan</h1>
                        <p className="text-muted-foreground text-sm mt-1">Design the standard workout schedule for your gym members.</p>
                    </div>
                    <button
                        onClick={handleSavePlan}
                        disabled={isSaving}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {isSaving ? 'Saving...' : 'Save Weekly Plan'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Days Sidebar */}
                    <div className="lg:w-64 space-y-2">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeDay === day
                                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                                    : 'bg-card border border-border hover:bg-accent/50'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{day}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeDay === day ? 'bg-white/20' : 'bg-accent text-muted-foreground'}`}>
                                        {weeklyPlan[day]?.length || 0}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Day Schedule */}
                    <div className="flex-1">
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center bg-accent/10">
                                <h3 className="text-xl font-bold">{activeDay}'s Routine</h3>
                                <button
                                    onClick={() => setShowExercisePicker(true)}
                                    className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Exercise
                                </button>
                            </div>

                            <div className="p-6">
                                {(!weeklyPlan[activeDay] || weeklyPlan[activeDay].length === 0) ? (
                                    <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-muted-foreground">Rest Day</h4>
                                        <p className="text-sm text-muted-foreground mt-1">No exercises scheduled for this day.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {weeklyPlan[activeDay].map((item: any, index: number) => (
                                            <div key={item.id} className="flex flex-col md:flex-row gap-4 p-5 rounded-xl border border-border bg-accent/5 hover:border-primary/30 transition-colors">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">{item.name}</h4>
                                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{item.category} • {item.difficulty}</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 mb-1">Sets</label>
                                                        <input
                                                            type="number"
                                                            value={item.sets}
                                                            onChange={(e) => updateExerciseInDay(activeDay, index, 'sets', e.target.value)}
                                                            className="w-16 px-3 py-1 bg-background border border-border rounded-md text-sm font-bold"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 mb-1">Reps</label>
                                                        <input
                                                            type="number"
                                                            value={item.reps}
                                                            onChange={(e) => updateExerciseInDay(activeDay, index, 'reps', e.target.value)}
                                                            className="w-16 px-3 py-1 bg-background border border-border rounded-md text-sm font-bold"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 mb-1">Weight</label>
                                                        <input
                                                            type="text"
                                                            value={item.weight}
                                                            placeholder="optional"
                                                            onChange={(e) => updateExerciseInDay(activeDay, index, 'weight', e.target.value)}
                                                            className="w-24 px-3 py-1 bg-background border border-border rounded-md text-sm"
                                                        />
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => removeExerciseFromDay(activeDay, index)}
                                                        className="mt-5 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exercise Picker Modal */}
                {showExercisePicker && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-card w-full max-w-2xl max-h-[80vh] rounded-2xl flex flex-col border border-border shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center bg-accent/10">
                                <h3 className="text-xl font-bold">Pick an Exercise</h3>
                                <button onClick={() => setShowExercisePicker(false)} className="text-muted-foreground hover:text-foreground p-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                {exercises.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-muted-foreground">No exercises found. Add some in the Exercises section first.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {exercises.map(ex => (
                                            <button
                                                key={ex.exerciseId}
                                                onClick={() => addExerciseToDay(activeDay, ex)}
                                                className="flex items-center gap-4 p-4 text-left border border-border rounded-xl hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                                                    {ex.imageUrl ? (
                                                        <img src={ex.imageUrl} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <svg className="w-6 h-6 text-muted-foreground group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold group-hover:text-primary transition-colors">{ex.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{ex.category}</p>
                                                </div>
                                            </button>
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
