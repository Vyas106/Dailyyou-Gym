import { Skeleton } from "@/components/ui/skeleton";
import SidebarLayout from "../../components/SidebarLayout";

export default function ExercisesSkeleton() {
    return (
        <SidebarLayout>
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-40 rounded-md" />
                        <Skeleton className="h-12 w-40 rounded-md" />
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-lg p-6 flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main List Skeleton */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <Skeleton className="h-7 w-32" />
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-accent/30 border border-border rounded-lg overflow-hidden space-y-4 pb-4">
                                    <Skeleton className="w-full h-40" />
                                    <div className="px-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-5 w-3/4" />
                                                <Skeleton className="h-4 w-1/4 rounded-full" />
                                            </div>
                                            <Skeleton className="w-8 h-8 rounded" />
                                        </div>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-16" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
