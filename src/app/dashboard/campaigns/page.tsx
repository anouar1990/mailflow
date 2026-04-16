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

import { createClient } from "@/lib/supabase/client";

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed" | "cancelled";
  total_recipients: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  total_unsubscribed: number;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  user_id?: string;
};

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
  cancelled: {
    color: "bg-gray-100 text-gray-800",
    icon: <AlertCircle className="h-3 w-3" />,
    label: "Cancelled",
  },
};

export default function CampaignsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const supabase = createClient();

  useState(() => {
    async function loadCampaigns() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
        if (data) setCampaigns(data);
      }
    }
    loadCampaigns();
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    await supabase.from("campaigns").delete().eq("id", id);
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

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
              campaign.total_sent > 0
                ? Math.round((campaign.total_opened / campaign.total_sent) * 100)
                : 0;
            const clickRate =
              campaign.total_sent > 0
                ? Math.round((campaign.total_clicked / campaign.total_sent) * 100)
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
                      <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
                      {campaign.sent_at && <span>• Sent: {new Date(campaign.sent_at).toLocaleDateString()}</span>}
                      {campaign.scheduled_at && (
                        <span>
                          • Scheduled: {new Date(campaign.scheduled_at).toLocaleDateString()}
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
                    <button onClick={() => handleDelete(campaign.id)} className="rounded-lg border border-gray-300 p-2 text-red-500 hover:bg-red-50">
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
                        {campaign.total_recipients.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sent</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {campaign.total_sent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Opened</p>
                      <div className="mt-1 flex items-center gap-1">
                        <Eye className="h-4 w-4 text-green-500" />
                        <p className="text-lg font-semibold text-gray-900">
                          {campaign.total_opened.toLocaleString()} ({openRate}%)
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Clicked</p>
                      <div className="mt-1 flex items-center gap-1">
                        <MousePointerClick className="h-4 w-4 text-purple-500" />
                        <p className="text-lg font-semibold text-gray-900">
                          {campaign.total_clicked.toLocaleString()} ({clickRate}%)
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bounced</p>
                      <p className="mt-1 text-lg font-semibold text-red-600">
                        {campaign.total_bounced}
                      </p>
                    </div>
                  </div>
                )}

                {campaign.status === "sending" && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Sending progress</span>
                      <span className="font-medium text-gray-900">
                        {campaign.total_recipients > 0 ? Math.round((campaign.total_sent / campaign.total_recipients) * 100) : 0}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${campaign.total_recipients > 0 ? (campaign.total_sent / campaign.total_recipients) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {campaign.total_sent.toLocaleString()} of{" "}
                      {campaign.total_recipients.toLocaleString()} emails sent
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
