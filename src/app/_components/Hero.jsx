"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

/**
 * Hero - Dieter Rams Inspired Landing Section
 * "Good design is innovative"
 *
 * Clean, purposeful introduction with clear value proposition
 */

const features = [
  {
    icon: TrendingUp,
    title: "Smart Tracking",
    description: "Automatic categorization of your spending patterns",
  },
  {
    icon: Shield,
    title: "Secure Data",
    description: "Bank-level encryption for your financial data",
  },
  {
    icon: Zap,
    title: "AI Insights",
    description: "Personalized recommendations powered by AI",
  },
];

function Hero() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="container py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Powered by AI
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Your finances,{" "}
            <span className="text-muted-foreground">simplified</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Finova helps you understand your spending, plan your budgets, and
            achieve your financial goals with AI-powered insights.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn more
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20">
          <div className="relative mx-auto max-w-5xl">
            {/* Shadow/Glow effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

            {/* Image container */}
            <div className="overflow-hidden rounded-xl border border-border shadow-elevated">
              <Image
                src="/dashboard.png"
                alt="Finova Dashboard"
                width={1400}
                height={720}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/30">
        <div className="container py-24">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need to manage your money
            </h2>
            <p className="mt-4 text-muted-foreground">
              Simple, powerful tools designed with clarity and purpose
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Built by{" "}
              <Link
                href="https://github.com/yesimbatya"
                className="font-medium text-foreground hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yessimkhan
              </Link>
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Hero;
