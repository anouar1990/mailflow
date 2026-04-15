"use client";

import { useState } from "react";
import { Save, Mail, Shield, Bell, Globe, Database } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    fromName: "Your Company",
    fromEmail: "hello@yourcompany.com",
    replyTo: "support@yourcompany.com",
    unsubscribeLink: true,
    openTracking: true,
    clickTracking: true,
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your email marketing platform
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-8">
        {/* General Settings */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Globe className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">General</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Africa/Casablanca">Casablanca</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    setSettings({ ...settings, dateFormat: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Email Defaults
            </h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Default From Name
                </label>
                <input
                  type="text"
                  value={settings.fromName}
                  onChange={(e) =>
                    setSettings({ ...settings, fromName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Default From Email
                </label>
                <input
                  type="email"
                  value={settings.fromEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, fromEmail: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Default Reply-To
              </label>
              <input
                type="email"
                value={settings.replyTo}
                onChange={(e) =>
                  setSettings({ ...settings, replyTo: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Tracking Settings */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Database className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Tracking</h2>
          </div>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Open Tracking</p>
                <p className="text-sm text-gray-500">
                  Track when recipients open emails
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.openTracking}
                onChange={(e) =>
                  setSettings({ ...settings, openTracking: e.target.checked })
                }
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Click Tracking</p>
                <p className="text-sm text-gray-500">
                  Track link clicks within emails
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.clickTracking}
                onChange={(e) =>
                  setSettings({ ...settings, clickTracking: e.target.checked })
                }
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Unsubscribe Link</p>
                <p className="text-sm text-gray-500">
                  Automatically include unsubscribe link
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.unsubscribeLink}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    unsubscribeLink: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* AWS SES Configuration */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              AWS SES Configuration
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                AWS Region
              </label>
              <input
                type="text"
                placeholder="e.g., us-east-1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                SES Configuration Set Name
              </label>
              <input
                type="text"
                placeholder="e.g., mailflow-tracking"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used for open/click tracking events via SNS
              </p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                AWS credentials are stored in environment variables. Contact your
                administrator to update them.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
