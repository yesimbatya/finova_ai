"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsError({ error, reset }) {
  useEffect(() => {
    console.error("Settings page error:", error);
  }, [error]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Couldn't load settings</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          There was a problem loading your settings. Please try again.
        </p>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
