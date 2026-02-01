"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Download,
  Trash2,
  Check,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Settings Page - Finova AI
 * Dieter Rams: "Good design is as little design as possible"
 */

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "KZT", symbol: "₸", name: "Kazakhstani Tenge" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "kk", name: "Қазақша" },
];

function SettingSection({ title, description, icon: Icon, children }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ToggleSetting({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function SelectSetting({ label, description, value, onChange, options }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.code || option.value} value={option.code || option.value}>
            {option.name || option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ThemeSelector({ value, onChange }) {
  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="py-3 border-b border-border last:border-0">
      <p className="font-medium mb-1">Theme</p>
      <p className="text-sm text-muted-foreground mb-3">
        Choose your preferred color scheme
      </p>
      <div className="flex gap-2">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onChange(theme.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              value === theme.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <theme.icon className="h-4 w-4" />
            <span className="text-sm">{theme.label}</span>
            {value === theme.value && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  // Settings state with localStorage persistence
  const [settings, setSettings] = useState({
    currency: "USD",
    language: "en",
    theme: "system",
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      weeklyReport: true,
      monthlyReport: false,
    },
    privacy: {
      shareAnalytics: false,
      showInLeaderboard: false,
    },
    budgetWarningThreshold: "80",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("finova_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("finova_settings", JSON.stringify(settings));
      toast.success("Settings saved successfully");
    } catch (e) {
      toast.error("Failed to save settings");
    }
    setTimeout(() => setIsSaving(false), 500);
  };

  const updateSetting = (path, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let current = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleExportData = () => {
    toast.info("Preparing your data export...");
    // In a real app, this would trigger a data export
    setTimeout(() => {
      toast.success("Data export is ready! Check your email.");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      toast.error("Account deletion is disabled in this demo.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <SettingSection
          title="Profile"
          description="Your personal information"
          icon={User}
        >
          <div className="flex items-center gap-4 py-3">
            <img
              src={user?.imageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-border"
            />
            <div>
              <p className="font-semibold">{user?.fullName || "User"}</p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress || "No email"}
              </p>
            </div>
            <a
              href="https://accounts.clerk.com/user"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Edit Profile
            </a>
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection
          title="Appearance"
          description="Customize how Finova looks"
          icon={Palette}
        >
          <ThemeSelector
            value={settings.theme}
            onChange={(v) => updateSetting("theme", v)}
          />
          <SelectSetting
            label="Currency"
            description="Default currency for budgets and expenses"
            value={settings.currency}
            onChange={(v) => updateSetting("currency", v)}
            options={currencies}
          />
          <SelectSetting
            label="Language"
            description="Application display language"
            value={settings.language}
            onChange={(v) => updateSetting("language", v)}
            options={languages}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection
          title="Notifications"
          description="Control how you receive updates"
          icon={Bell}
        >
          <ToggleSetting
            label="Email Notifications"
            description="Receive updates via email"
            checked={settings.notifications.email}
            onChange={(v) => updateSetting("notifications.email", v)}
          />
          <ToggleSetting
            label="Push Notifications"
            description="Receive push notifications in browser"
            checked={settings.notifications.push}
            onChange={(v) => updateSetting("notifications.push", v)}
          />
          <ToggleSetting
            label="Budget Alerts"
            description="Get notified when approaching budget limits"
            checked={settings.notifications.budgetAlerts}
            onChange={(v) => updateSetting("notifications.budgetAlerts", v)}
          />
          <SelectSetting
            label="Warning Threshold"
            description="Alert when budget usage exceeds this percentage"
            value={settings.budgetWarningThreshold}
            onChange={(v) => updateSetting("budgetWarningThreshold", v)}
            options={[
              { value: "50", label: "50%" },
              { value: "70", label: "70%" },
              { value: "80", label: "80%" },
              { value: "90", label: "90%" },
            ]}
          />
          <ToggleSetting
            label="Weekly Report"
            description="Receive a weekly spending summary"
            checked={settings.notifications.weeklyReport}
            onChange={(v) => updateSetting("notifications.weeklyReport", v)}
          />
          <ToggleSetting
            label="Monthly Report"
            description="Receive a detailed monthly financial report"
            checked={settings.notifications.monthlyReport}
            onChange={(v) => updateSetting("notifications.monthlyReport", v)}
          />
        </SettingSection>

        {/* Privacy */}
        <SettingSection
          title="Privacy & Security"
          description="Control your data and privacy"
          icon={Shield}
        >
          <ToggleSetting
            label="Share Analytics"
            description="Help improve Finova by sharing anonymous usage data"
            checked={settings.privacy.shareAnalytics}
            onChange={(v) => updateSetting("privacy.shareAnalytics", v)}
          />
          <ToggleSetting
            label="Community Leaderboard"
            description="Show your savings achievements on the community leaderboard"
            checked={settings.privacy.showInLeaderboard}
            onChange={(v) => updateSetting("privacy.showInLeaderboard", v)}
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection
          title="Data Management"
          description="Export or delete your data"
          icon={CreditCard}
        >
          <div className="flex flex-col sm:flex-row gap-4 py-3">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export All Data</span>
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </SettingSection>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
