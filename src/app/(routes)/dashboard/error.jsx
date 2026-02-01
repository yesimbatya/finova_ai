"use client";

import { ErrorDisplay } from "@/components/error-boundary";

export default function DashboardError({ error, reset }) {
  return <ErrorDisplay error={error} reset={reset} />;
}
