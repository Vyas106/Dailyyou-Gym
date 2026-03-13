import { Skeleton } from "@/components/ui/skeleton";
import SidebarLayout from "../../components/SidebarLayout";

export default function MembersSkeleton() {
    return (
        <SidebarLayout>
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                {/* Header Skeleton */}
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-48" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
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
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-60" />
                                </div>
                                <div className="space-y-2 text-right">
                                    <Skeleton className="h-3 w-20 ml-auto" />
                                    <Skeleton className="h-8 w-24 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
