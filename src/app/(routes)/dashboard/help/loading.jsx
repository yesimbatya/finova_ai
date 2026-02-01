export default function HelpLoading() {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-muted rounded-lg" />
          <div className="h-8 w-40 bg-muted rounded" />
        </div>
        <div className="h-4 w-64 bg-muted rounded mt-2" />
      </div>

      <div className="mb-8">
        <div className="h-6 w-24 bg-muted rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-4">
              <div className="w-10 h-10 bg-muted rounded-lg mb-3" />
              <div className="h-4 w-24 bg-muted rounded mb-2" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-muted rounded-lg" />
                <div className="h-5 w-32 bg-muted rounded" />
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-12 bg-muted rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
