'use client';

import { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MealsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [meals, setMeals] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    const [form, setForm] = useState({
        name: '',
        category: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        servingSize: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (!isLoading && !user) router.push('/login');
        if (user) fetchMeals();
    }, [user, isLoading]);

    const fetchMeals = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/meals', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setMeals(data.meals);
        } catch (error) {
            console.error("Error fetching meals", error);
        } finally {
            setFetching(false);
        }
    };

    const handleCreateMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/meals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setIsAdding(false);
                setForm({ name: '', category: 'breakfast', calories: '', protein: '', carbs: '', fats: '', servingSize: '', imageUrl: '' });
                fetchMeals();
            }
        } catch (error) {
            console.error("Error creating meal", error);
        }
    };

    return (
        <SidebarLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Meal Library</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage meals available for recommendation</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create New Meal
                    </button>
                </div>

                {fetching ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meals.map((meal) => (
                            <div key={meal.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                                {meal.imageUrl && (
                                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-40 object-cover" />
                                )}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{meal.name}</h3>
                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                            {meal.category}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-4">{meal.servingSize}</p>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        <div className="bg-accent/30 p-2 rounded-lg">
                                            <p className="font-bold text-sm">{meal.calories}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">kcal</p>
                                        </div>
                                        <div className="bg-accent/30 p-2 rounded-lg">
                                            <p className="font-bold text-sm">{meal.protein}g</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Prot</p>
                                        </div>
                                        <div className="bg-accent/30 p-2 rounded-lg">
                                            <p className="font-bold text-sm">{meal.carbs}g</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Carb</p>
                                        </div>
                                        <div className="bg-accent/30 p-2 rounded-lg">
                                            <p className="font-bold text-sm">{meal.fats}g</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Fat</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isAdding && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card w-full max-w-md rounded-xl p-6 border border-border shadow-2xl">
                            <h2 className="text-xl font-bold mb-4">Add New Meal</h2>
                            <form onSubmit={handleCreateMeal} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1">Meal Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 ring-primary outline-none"
                                        placeholder="e.g. Scrambled Eggs with Avocado"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Category</label>
                                        <select
                                            value={form.category}
                                            onChange={e => setForm({...form, category: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                                        >
                                            <option value="breakfast">Breakfast</option>
                                            <option value="lunch">Lunch</option>
                                            <option value="dinner">Dinner</option>
                                            <option value="snack">Snack</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1">Serving Size</label>
                                        <input
                                            type="text"
                                            value={form.servingSize}
                                            onChange={e => setForm({...form, servingSize: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                                            placeholder="e.g. 1 bowl / 250g"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <label className="text-[10px] font-medium block mb-1 uppercase">Calories</label>
                                        <input
                                            required
                                            type="number"
                                            value={form.calories}
                                            onChange={e => setForm({...form, calories: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-center"
                                            placeholder="350"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium block mb-1 uppercase">Protein</label>
                                        <input
                                            type="number"
                                            value={form.protein}
                                            onChange={e => setForm({...form, protein: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-center"
                                            placeholder="20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium block mb-1 uppercase">Carbs</label>
                                        <input
                                            type="number"
                                            value={form.carbs}
                                            onChange={e => setForm({...form, carbs: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-center"
                                            placeholder="40"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium block mb-1 uppercase">Fats</label>
                                        <input
                                            type="number"
                                            value={form.fats}
                                            onChange={e => setForm({...form, fats: e.target.value})}
                                            className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-center"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1">Image URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={form.imageUrl}
                                        onChange={e => setForm({...form, imageUrl: e.target.value})}
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Create Meal
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
