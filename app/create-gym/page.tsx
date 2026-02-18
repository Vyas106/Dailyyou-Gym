'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import { useEffect } from 'react';

const WORKING_DAYS_OPTIONS = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function CreateGymPage() {
    const { user, createGym } = useAuth(); // We need to add createGym to context
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactNumber: '',
        logo: '', // URL or file path (simplified for now as text input)
    });
    const [workingDays, setWorkingDays] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Protect route
    useEffect(() => {
        if (!user) {
            // If user is not logged in, redirect to login
            router.push('/login');
        } else if (user.gymId) {
            // If user already has a gymId, redirect to dashboard
            console.log('User already has a gym, redirecting to dashboard');
            router.push('/dashboard');
        }
    }, [user, router]);

    const toggleDay = (day: string) => {
        setWorkingDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted', { formData, workingDays });

        if (!formData.name || !formData.address || !formData.contactNumber || workingDays.length === 0) {
            const errorMsg = 'Please fill in all required fields and select working days';
            console.log('Validation failed:', errorMsg);
            setError(errorMsg);
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('gym_auth_token');
            console.log('Token:', token ? 'exists' : 'missing');

            const payload = { ...formData, workingDays };
            console.log('Sending payload:', payload);

            const res = await fetch('/api/gyms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log('Response status:', res.status);
            const data = await res.json();
            console.log('Response data:', data);

            if (res.ok) {
                console.log('Gym created successfully');

                // Update user in localStorage with gymId
                const storedUser = localStorage.getItem('gym_user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    userData.gymId = data.gym.id;
                    localStorage.setItem('gym_user', JSON.stringify(userData));
                }

                // Force full page reload to reinitialize context
                window.location.href = '/dashboard';
            } else {
                // If user already has a gym, fetch their gym data first
                if (data.message?.includes('already owns or belongs to a gym')) {
                    console.log('User already has gym, fetching gym data...');

                    try {
                        // Fetch user's gym to get the gymId
                        const token = localStorage.getItem('gym_auth_token');
                        const gymRes = await fetch('/api/gyms', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (gymRes.ok) {
                            const gymData = await gymRes.json();
                            console.log('Fetched gym data:', gymData);

                            // Update localStorage with gymId
                            const storedUser = localStorage.getItem('gym_user');
                            if (storedUser && gymData.gym?.id) {
                                const userData = JSON.parse(storedUser);
                                userData.gymId = gymData.gym.id;
                                localStorage.setItem('gym_user', JSON.stringify(userData));
                                console.log('Updated localStorage with gymId:', gymData.gym.id);
                            }
                        }
                    } catch (err) {
                        console.error('Error fetching gym data:', err);
                    }

                    // Now redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    const errorMsg = data.message || 'Failed to create gym. Please try again.';
                    console.error('Server error:', errorMsg);
                    setError(errorMsg);
                }
            }
        } catch (err) {
            console.error('Caught error:', err);
            setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
            <div className="glass p-8 rounded-2xl w-full max-w-2xl fadeIn">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-white">Setup Your Gym</h1>
                    <p className="text-[var(--foreground-muted)]">Tell us about your fitness center</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Gym Name"
                            placeholder="e.g. Iron Paradise"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Contact Number"
                            placeholder="+1 234 567 890"
                            value={formData.contactNumber}
                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Address"
                        placeholder="123 Fitness St, Gym City"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        required
                    />

                    <Input
                        label="Logo URL (Optional)"
                        placeholder="https://example.com/logo.png"
                        value={formData.logo}
                        onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-3">Working Days</label>
                        <div className="flex flex-wrap gap-2">
                            {WORKING_DAYS_OPTIONS.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${workingDays.includes(day)
                                        ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-glow)]'
                                        : 'bg-[var(--background-lighter)] text-[var(--foreground-muted)] hover:bg-white/10'
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                            {isLoading ? 'Creating Dashboard...' : 'Create Gym Dashboard'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
