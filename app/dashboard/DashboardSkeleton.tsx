import { Skeleton } from "@/components/ui/skeleton";
import SidebarLayout from "../components/SidebarLayout";

export default function DashboardSkeleton() {
    return (
        <SidebarLayout>
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                {/* Header Skeleton */}
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-48" />
                </div>

                {/* Action Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-lg p-6 space-y-4">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    ))}
                </div>

                {/* Main Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Gym Overview Skeleton */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-xl p-8 h-full space-y-6">
                            <Skeleton className="h-8 w-40 mb-6" />
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Display Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border rounded-xl p-8 h-full flex flex-col items-center justify-center space-y-6">
                            <Skeleton className="h-8 w-32 mb-4" />
                            <Skeleton className="w-48 h-48 rounded-xl" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
