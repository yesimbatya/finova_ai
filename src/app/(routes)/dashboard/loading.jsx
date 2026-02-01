import { Card } from "@/components/ui/card";

/**
 * Dashboard Loading State - Dieter Rams Inspired
 * Clean skeleton loading that matches the dashboard layout
 */

function SkeletonCard() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          <div className="h-8 w-28 rounded bg-muted animate-pulse" />
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
      </div>
    </Card>
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <header className="mb-8">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-64 rounded bg-muted animate-pulse mt-2" />
      </header>

      {/* Cards skeleton */}
      <div className="space-y-6">
        {/* AI Chat skeleton */}
        <Card className="p-6">
          <div className="h-64 rounded bg-muted animate-pulse" />
        </Card>

        {/* Metrics grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="h-6 w-32 rounded bg-muted animate-pulse mb-4" />
              <div className="h-[240px] rounded bg-muted animate-pulse" />
            </Card>
            <Card className="p-6">
              <div className="h-6 w-32 rounded bg-muted animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 rounded bg-muted animate-pulse" />
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-5">
                  <div className="h-16 rounded bg-muted animate-pulse" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
