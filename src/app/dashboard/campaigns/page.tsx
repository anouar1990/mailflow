"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Send,
  Eye,
  MousePointerClick,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Trash2,
  Copy,
  MoreHorizontal,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Summer Sale 2026",
    subject: "🌞 Hot Summer Deals - Up to 50% Off!",
    status: "sent",
    recipients: 5420,
    sent: 5420,
    opened: 2380,
    clicked: 890,
    bounced: 45,
    unsubscribed: 12,
    scheduledAt: null,
    sentAt: "Apr 14, 2026 10:30 AM",
    createdAt: "Apr 13, 2026",
  },
  {
    id: 2,
    name: "Welcome Series - Q2",
    subject: "Welcome to our community!",
    status: "sending",
    recipients: 3500,
    sent: 1230,
    opened: 420,
    clicked: 156,
    bounced: 5,
    unsubscribed: 2,
    scheduledAt: null,
    sentAt: null,
    createdAt: "Apr 14, 2026",
  },
  {
    id: 3,
    name: "Product Launch Newsletter",
    subject: "Introducing our latest innovation...",
    status: "scheduled",
    recipients: 8900,
    sent: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    scheduledAt: "Apr 16, 2026 9:00 AM",
    sentAt: null,
    createdAt: "Apr 12, 2026",
  },
  {
    id: 4,
    name: "Monthly Digest - March",
    subject: "Your March recap is here!",
    status: "draft",
    recipients: 0,
    sent: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    scheduledAt: null,
    sentAt: null,
    createdAt: "Apr 13, 2026",
  },
  {
    id: 5,
    name: "Abandoned Cart Recovery",
    subject: "You left something behind...",
    status: "sent",
    recipients: 890,
    sent: 890,
    opened: 520,
    clicked: 310,
    bounced: 8,
    unsubscribed: 3,
    scheduledAt: null,
    sentAt: "Apr 13, 2026 2:15 PM",
    createdAt: "Apr 13, 2026",
  },
  {
    id: 6,
    name: "Black Friday Preview",
    subject: "Exclusive early access for VIPs",
    status: "failed",
    recipients: 2100,
    sent: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    scheduledAt: null,
    sentAt: null,
    createdAt: "Apr 11, 2026",
  },
];

const statusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  sent: {
    color: "bg-green-100 text-green-800",
    icon: <Send className="h-3 w-3" />,
    label: "Sent",
  },
  sending: {
    color: "bg-blue-100 text-blue-800",
    icon: <Clock className="h-3 w-3" />,
    label: "Sending",
  },
  scheduled: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="h-3 w-3" />,
    label: "Scheduled",
  },
  draft: {
    color: "bg-gray-100 text-gray-800",
    icon: <Pause className="h-3 w-3" />,
    label: "Draft",
  },
  failed: {
    color: "bg-red-100 text-red-800",
    icon: <AlertCircle className="h-3 w-3" />,
    label: "Failed",
  },
};

export default function CampaignsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredCampaigns =
    filter === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === filter);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your email campaigns
            </p>
          </div>
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        </div>
      </div>

      <div className="p-8">
        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {["all", "sent", "sending", "scheduled", "draft", "failed"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>

        {/* Campaigns Grid */}
        <div className="grid gap-6">
          {filteredCampaigns.map((campaign) => {
            const status = statusConfig[campaign.status];
            const openRate =
              campaign.sent > 0
                ? Math.round((campaign.opened / campaign.sent) * 100)
                : 0;
            const clickRate =
              campaign.sent > 0
                ? Math.round((campaign.clicked / campaign.sent) * 100)
                : 0;

            return (
              <div
                key={campaign.id}
                className="rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {campaign.subject}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {campaign.createdAt}</span>
                      {campaign.sentAt && <span>• Sent: {campaign.sentAt}</span>}
                      {campaign.scheduledAt && (
                        <span>
                          • Scheduled: {campaign.scheduledAt}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === "draft" && (
                      <button className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50">
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    {campaign.status === "scheduled" && (
                      <button className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50">
                        <Pause className="h-4 w-4" />
                      </button>
                    )}
                    <button className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg border border-gray-300 p-2 text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {campaign.status === "sent" && (
                  <div className="mt-4 grid grid-cols-5 gap-4 border-t border-gray-200 pt-4">
                    <div>
                      <p className="text-sm text-gray-500">Recipients</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {campaign.recipients.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sent</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {campaign.sent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Opened</p>
                      <div className="mt-1 flex items-center gap-1">
                        <Eye className="h-4 w-4 text-green-500" />
                        <p className="text-lg font-semibold text-gray-900">
                          {campaign.opened.toLocaleString()} ({openRate}%)
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Clicked</p>
                      <div className="mt-1 flex items-center gap-1">
                        <MousePointerClick className="h-4 w-4 text-purple-500" />
                        <p className="text-lg font-semibold text-gray-900">
                          {campaign.clicked.toLocaleString()} ({clickRate}%)
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bounced</p>
                      <p className="mt-1 text-lg font-semibold text-red-600">
                        {campaign.bounced}
                      </p>
                    </div>
                  </div>
                )}

                {campaign.status === "sending" && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Sending progress</span>
                      <span className="font-medium text-gray-900">
                        {Math.round((campaign.sent / campaign.recipients) * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${(campaign.sent / campaign.recipients) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {campaign.sent.toLocaleString()} of{" "}
                      {campaign.recipients.toLocaleString()} emails sent
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
