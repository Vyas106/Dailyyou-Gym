'use client';

import { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
    DollarSign, 
    Users, 
    CreditCard, 
    TrendingUp, 
    ArrowUpRight, 
    Search,
    Download,
    Filter
} from 'lucide-react';

export default function RevenuePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [revenueData, setRevenueData] = useState<any>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('All Plans');
    const [showFilters, setShowFilters] = useState(false);

    const fetchRevenue = async () => {
        try {
            const token = localStorage.getItem('gym_auth_token');
            const res = await fetch('/api/revenue', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRevenueData(data);
            }
        } catch (error) {
            console.error("Error fetching revenue", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else {
                fetchRevenue();
            }
        }
    }, [user, isLoading]);

    if (isLoading || isFetching) {
        return (
            <SidebarLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </SidebarLayout>
        );
    }

    const stats = revenueData?.stats || {
        totalRevenue: 0,
        totalMembers: 0,
        activeSubscriptions: 0,
        averageRevenuePerMember: 0
    };

    const members = revenueData?.members || [];
    const filteredMembers = members.filter((m: any) => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             m.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = selectedPlan === 'All Plans' || m.planName === selectedPlan;
        return matchesSearch && matchesPlan;
    });

    const uniquePlans = ['All Plans', ...Array.from(new Set(members.map((m: any) => m.planName)))];

    return (
        <SidebarLayout>
            <div className="p-8 pb-16 bg-[#030303] min-h-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white mb-2">REVENUE INSIGHTS</h1>
                        <p className="text-muted-foreground font-medium">Monitoring your gym's financial health and member subscriptions.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold">
                            <Download className="w-4 h-4" />
                            Export Data
                        </button>
                        <button 
                            onClick={fetchRevenue}
                            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-black rounded-xl hover:bg-orange-600 transition-all text-sm font-black"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Revenue" 
                        value={`₹${stats.totalRevenue.toLocaleString()}`} 
                        icon={<DollarSign className="w-6 h-6" />}
                        change="+12.5%"
                        color="orange"
                    />
                    <StatCard 
                        title="Active Subscriptions" 
                        value={stats.activeSubscriptions.toString()} 
                        icon={<CreditCard className="w-6 h-6" />}
                        change="+3"
                        color="blue"
                    />
                    <StatCard 
                        title="Total Members" 
                        value={stats.totalMembers.toString()} 
                        icon={<Users className="w-6 h-6" />}
                        change="+5"
                        color="purple"
                    />
                    <StatCard 
                        title="Avg. Per Member" 
                        value={`₹${Math.round(stats.averageRevenuePerMember).toLocaleString()}`} 
                        icon={<TrendingUp className="w-6 h-6" />}
                        change="+₹150"
                        color="green"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Search and Filter */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md relative z-30">
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input 
                                        type="text" 
                                        placeholder="Search members or plans..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    />
                                </div>
                                <div className="flex gap-2 relative">
                                    <button 
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`px-4 py-3 border rounded-xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${showFilters ? 'bg-orange-500 text-black border-orange-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60'}`}
                                    >
                                        <Filter className="w-4 h-4" />
                                        {selectedPlan === 'All Plans' ? 'Filter' : selectedPlan}
                                    </button>

                                    {showFilters && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-4 border-b border-white/5 bg-white/5">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Filter by Plan</p>
                                            </div>
                                            <div className="p-2 max-h-[300px] overflow-y-auto">
                                                {uniquePlans.map((plan: any) => (
                                                    <button
                                                        key={plan}
                                                        onClick={() => {
                                                            setSelectedPlan(plan);
                                                            setShowFilters(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-tight ${selectedPlan === plan ? 'bg-orange-500 text-black' : 'text-white/60 hover:bg-white/5'}`}
                                                    >
                                                        {plan}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Member Payments Table */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md relative z-10">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold">Recent Subscriptions</h3>
                                    {(searchTerm || selectedPlan !== 'All Plans') && (
                                        <button 
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedPlan('All Plans');
                                            }}
                                            className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors bg-orange-500/10 px-2 py-1 rounded"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{filteredMembers.length} Members Found</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02]">
                                            <th className="p-4 text-xs font-black text-white/40 uppercase tracking-widest">Member</th>
                                            <th className="p-4 text-xs font-black text-white/40 uppercase tracking-widest">Plan</th>
                                            <th className="p-4 text-xs font-black text-white/40 uppercase tracking-widest text-right">Amount</th>
                                            <th className="p-4 text-xs font-black text-white/40 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredMembers.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-20 text-center">
                                                    <div className="flex flex-col items-center gap-4 text-white/20">
                                                        <Search className="w-12 h-12" />
                                                        <p className="font-bold">No results found for "{searchTerm}"</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredMembers.map((member: any) => (
                                                <tr key={member.userId} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/members/${member.userId}`)}>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-white/10 flex items-center justify-center font-black text-orange-500 group-hover:scale-110 transition-transform">
                                                                {member.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{member.name}</p>
                                                                <p className="text-xs text-white/40">{member.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">
                                                            {member.planName}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <p className="font-black text-white leading-none">₹{member.paidAmount.toLocaleString()}</p>
                                                        {member.discount > 0 && <p className="text-[10px] text-green-500 font-bold uppercase">-{member.discount}% Applied</p>}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500">
                                                            Active
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        {/* Plan Distribution */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-orange-500" />
                                PLAN ANALYTICS
                            </h3>
                            <div className="space-y-6">
                                {revenueData?.plans?.slice(0, 4).map((plan: any) => {
                                    const count = members.filter((m: any) => m.planName === plan.name).length;
                                    const percentage = members.length > 0 ? (count / members.length) * 100 : 0;
                                    return (
                                        <div key={plan.id} className="space-y-2">
                                            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                                                <span className="text-white/60">{plan.name}</span>
                                                <span className="text-white">{count} users</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-orange-500 transition-all duration-1000" 
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={() => router.push('/dashboard/plans')}
                                className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-black uppercase tracking-[0.2em]"
                            >
                                Manage Plans
                            </button>
                        </div>

                        {/* Recent Activity Mini-Card */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-black shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-1">Weekly Target</h4>
                                <p className="text-3xl font-black mb-4">92% REACHED</p>
                                <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-black w-[92%]" />
                                </div>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-black/20 pb-0.5 hover:border-black transition-all">
                                    View Full Report
                                    <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

function StatCard({ title, value, icon, change, color }: any) {
    const colorClasses: any = {
        orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
    };

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]} border transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div className="px-2 py-1 bg-green-500/10 rounded-lg">
                    <span className="text-[10px] font-black text-green-500">{change}</span>
                </div>
            </div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-1">{title}</h3>
            <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        </div>
    );
}
