"use client";

import Link from "next/link";
import {
  Users,
  Mail,
  Send,
  TrendingUp,
  MousePointerClick,
  Plus,
  Eye,
  FileText,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const stats = [
  {
    name: "Total Contacts",
    value: "12,345",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    name: "Active Campaigns",
    value: "8",
    change: "+2",
    icon: Mail,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    name: "Emails Sent",
    value: "45,678",
    change: "+18%",
    icon: Send,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    name: "Avg. Open Rate",
    value: "42.3%",
    change: "+5.2%",
    icon: Eye,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const weeklyData = [
  { name: "Mon", sent: 1200, opened: 580, clicked: 180 },
  { name: "Tue", sent: 1800, opened: 920, clicked: 320 },
  { name: "Wed", sent: 2100, opened: 1050, clicked: 410 },
  { name: "Thu", sent: 1600, opened: 780, clicked: 260 },
  { name: "Fri", sent: 1400, opened: 690, clicked: 220 },
  { name: "Sat", sent: 800, opened: 420, clicked: 140 },
  { name: "Sun", sent: 600, opened: 310, clicked: 95 },
];

const recentCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2026",
    status: "sent",
    sent: 5420,
    opened: 2380,
    clicked: 890,
    date: "Apr 14, 2026",
  },
  {
    id: 2,
    name: "Welcome Series - Q2",
    status: "sending",
    sent: 1230,
    opened: 420,
    clicked: 156,
    date: "Apr 14, 2026",
  },
  {
    id: 3,
    name: "Product Launch Newsletter",
    status: "scheduled",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "Apr 16, 2026",
  },
  {
    id: 4,
    name: "Monthly Digest - March",
    status: "draft",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "Apr 13, 2026",
  },
];

const statusColors: Record<string, string> = {
  sent: "bg-green-100 text-green-800",
  sending: "bg-blue-100 text-blue-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  draft: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here&apos;s your email marketing overview.
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
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Email Activity Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Email Activity (7 days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
                <Bar dataKey="opened" fill="#10b981" name="Opened" />
                <Bar dataKey="clicked" fill="#8b5cf6" name="Clicked" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Performance Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="opened"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot
                />
                <Line
                  type="monotone"
                  dataKey="clicked"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Campaigns
            </h3>
            <Link
              href="/dashboard/campaigns"
              className="text-sm font-medium text-primary hover:text-blue-700"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Opened
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Clicked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {campaign.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[campaign.status]}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {campaign.sent.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-green-500" />
                        {campaign.opened.toLocaleString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="h-4 w-4 text-purple-500" />
                        {campaign.clicked.toLocaleString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {campaign.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/contacts/new"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Contacts</p>
              <p className="text-sm text-gray-500">Import or add subscribers</p>
            </div>
          </Link>
          <Link
            href="/dashboard/templates/new"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Create Template</p>
              <p className="text-sm text-gray-500">Design email templates</p>
            </div>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Track performance metrics</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
