export default function SettingsLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-muted rounded-lg" />
          <div className="h-8 w-32 bg-muted rounded" />
        </div>
        <div className="h-4 w-72 bg-muted rounded mt-2" />
      </div>

      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-9 h-9 bg-muted rounded-lg" />
              <div>
                <div className="h-5 w-24 bg-muted rounded mb-2" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <div className="h-4 w-32 bg-muted rounded mb-2" />
                    <div className="h-3 w-48 bg-muted rounded" />
                  </div>
                  <div className="w-12 h-6 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
