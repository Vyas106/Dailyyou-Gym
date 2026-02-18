'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '../../components/SidebarLayout';

export default function ExercisesPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [exercises, setExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [newExercise, setNewExercise] = useState({
        name: '',
        description: '',
        category: 'Strength',
        duration: '',
        sets: '',
        reps: '',
        restTime: '',
        instructions: '',
        difficulty: 'Beginner',
        equipment: '',
        targetMuscles: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (!user.gymId) {
                router.push('/create-gym');
            } else {
                fetchExercises();
            }
        }
    }, [user, isLoading, router]);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/gym-exercises', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setExercises(data.exercises || []);
            }
        } catch (error) {
            console.error("Error fetching exercises", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', imageFile);

            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                return data.url || data.fileUrl;
            }
            return null;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleAddExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Upload image first if selected
            let imageUrl = newExercise.imageUrl;
            if (imageFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            const token = localStorage.getItem('gym_auth_token');

            const exerciseData = {
                ...newExercise,
                imageUrl,
                duration: newExercise.duration ? parseInt(newExercise.duration) : null,
                sets: newExercise.sets ? parseInt(newExercise.sets) : null,
                reps: newExercise.reps ? parseInt(newExercise.reps) : null,
                restTime: newExercise.restTime ? parseInt(newExercise.restTime) : null,
                equipment: newExercise.equipment ? newExercise.equipment.split(',').map(e => e.trim()) : [],
                targetMuscles: newExercise.targetMuscles ? newExercise.targetMuscles.split(',').map(m => m.trim()) : []
            };

            const res = await fetch('/api/gym-exercises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(exerciseData)
            });

            if (res.ok) {
                setShowAddModal(false);
                setImageFile(null);
                setImagePreview('');
                setNewExercise({
                    name: '',
                    description: '',
                    category: 'Strength',
                    duration: '',
                    sets: '',
                    reps: '',
                    restTime: '',
                    instructions: '',
                    difficulty: 'Beginner',
                    equipment: '',
                    targetMuscles: '',
                    imageUrl: ''
                });
                fetchExercises();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to add exercise');
            }
        } catch (error) {
            console.error("Error adding exercise", error);
            alert('Error adding exercise');
        }
    };

    const handleDeleteExercise = async (exerciseId: string) => {
        if (!confirm('Are you sure you want to delete this exercise?')) return;

        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch(`/api/gym-exercises/${exerciseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchExercises();
            }
        } catch (error) {
            console.error("Error deleting exercise", error);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading exercises...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Exercise Library</h1>
                            <p className="text-muted-foreground">
                                Manage your gym's exercise collection
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium transition-opacity flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Exercise
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Exercises</p>
                                <p className="text-2xl font-bold">{exercises.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Strength</p>
                                <p className="text-2xl font-bold">{exercises.filter(e => e.category === 'Strength').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Cardio</p>
                                <p className="text-2xl font-bold">{exercises.filter(e => e.category === 'Cardio').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Flexibility</p>
                                <p className="text-2xl font-bold">{exercises.filter(e => e.category === 'Flexibility').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exercises Grid */}
                <div className="bg-card border border-border rounded-lg">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold">All Exercises</h2>
                    </div>
                    <div className="p-6">
                        {exercises.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <p className="text-muted-foreground mb-2">No exercises yet</p>
                                <p className="text-sm text-muted-foreground">Add your first exercise to get started</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {exercises.map((exercise) => (
                                    <div key={exercise.exerciseId} className="bg-accent/30 border border-border rounded-lg overflow-hidden hover:bg-accent/50 transition-colors">
                                        {exercise.imageUrl && (
                                            <div className="w-full h-40 overflow-hidden">
                                                <img
                                                    src={exercise.imageUrl}
                                                    alt={exercise.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                                                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary mt-1">
                                                        {exercise.category}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteExercise(exercise.exerciseId)}
                                                    className="p-1 hover:bg-destructive/20 rounded text-destructive"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            {exercise.description && (
                                                <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                {exercise.sets && <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded">Sets: {exercise.sets}</span>}
                                                {exercise.reps && <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded">Reps: {exercise.reps}</span>}
                                                {exercise.duration && <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded">{exercise.duration}min</span>}
                                                <span className={`px-2 py-1 rounded ${exercise.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                                                    exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>{exercise.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Exercise Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                                <h2 className="text-2xl font-bold">Add New Exercise</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-accent rounded">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleAddExercise} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Exercise Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newExercise.name}
                                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        placeholder="e.g., Barbell Bench Press"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <select
                                            value={newExercise.category}
                                            onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        >
                                            <option value="Strength">Strength</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="Flexibility">Flexibility</option>
                                            <option value="Balance">Balance</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                                        <select
                                            value={newExercise.difficulty}
                                            onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        value={newExercise.description}
                                        onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        rows={3}
                                        placeholder="Brief description of the exercise"
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Sets</label>
                                        <input
                                            type="number"
                                            value={newExercise.sets}
                                            onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Reps</label>
                                        <input
                                            type="number"
                                            value={newExercise.reps}
                                            onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Duration (min)</label>
                                        <input
                                            type="number"
                                            value={newExercise.duration}
                                            onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rest (sec)</label>
                                        <input
                                            type="number"
                                            value={newExercise.restTime}
                                            onChange={(e) => setNewExercise({ ...newExercise, restTime: e.target.value })}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Equipment (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newExercise.equipment}
                                        onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        placeholder="e.g., Barbell, Bench, Weights"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Target Muscles (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newExercise.targetMuscles}
                                        onChange={(e) => setNewExercise({ ...newExercise, targetMuscles: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        placeholder="e.g., Chest, Triceps, Shoulders"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Instructions</label>
                                    <textarea
                                        value={newExercise.instructions}
                                        onChange={(e) => setNewExercise({ ...newExercise, instructions: e.target.value })}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-md"
                                        rows={4}
                                        placeholder="Step-by-step instructions for the exercise"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Exercise Image</label>
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90"
                                        />
                                        {imagePreview && (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImageFile(null);
                                                        setImagePreview('');
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-80"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium transition-opacity disabled:opacity-50"
                                    >
                                        {uploading ? 'Uploading Image...' : 'Add Exercise'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-3 bg-accent text-foreground rounded-md hover:bg-accent/80 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
