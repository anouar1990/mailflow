"use client";

import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Mail,
  Users,
  UserMinus,
  AlertCircle,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Keep static device and client data as these aren't captured entirely without third-party fingerprinters
const deviceData = [
  { name: "Desktop", value: 52, color: "#3b82f6" },
  { name: "Mobile", value: 38, color: "#10b981" },
  { name: "Tablet", value: 10, color: "#8b5cf6" },
];

const clientData = [
  { name: "Gmail", value: 42 },
  { name: "Apple Mail", value: 28 },
  { name: "Outlook", value: 15 },
  { name: "Yahoo", value: 8 },
  { name: "Other", value: 7 },
];

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0
  });
  
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (!campaigns || campaigns.length === 0) return;

      // Global Metrics
      let sent = 0;
      let opens = 0;
      let clicks = 0;
      let unsubscribes = 0;

      campaigns.forEach(c => {
        sent += c.total_sent || 0;
        opens += c.total_opened || 0;
        clicks += c.total_clicked || 0;
        unsubscribes += c.total_unsubscribed || 0;
      });

      setMetrics({
        totalSent: sent,
        openRate: sent > 0 ? Number(((opens / sent) * 100).toFixed(1)) : 0,
        clickRate: sent > 0 ? Number(((clicks / sent) * 100).toFixed(1)) : 0,
        unsubscribeRate: sent > 0 ? Number(((unsubscribes / sent) * 100).toFixed(1)) : 0
      });

      // Top Campaigns
      const ranked = [...campaigns]
        .filter(c => c.total_sent > 0)
        .map(c => ({
          name: c.name,
          sent: c.total_sent,
          openRate: Number(((c.total_opened / c.total_sent) * 100).toFixed(1)),
          clickRate: Number(((c.total_clicked / c.total_sent) * 100).toFixed(1)),
          unsubscribeRate: Number(((c.total_unsubscribed / c.total_sent) * 100).toFixed(1))
        }))
        .sort((a, b) => b.openRate - a.openRate)
        .slice(0, 5);

      setTopCampaigns(ranked);

      // Monthly Activity Mocked using actual limits (Group by month logic)
      const months: Record<string, any> = {};
      campaigns.forEach(c => {
        const d = new Date(c.created_at);
        const monthYear = d.toLocaleString('default', { month: 'short' });
        if (!months[monthYear]) {
          months[monthYear] = { month: monthYear, sent: 0, opened: 0, clicked: 0 };
        }
        months[monthYear].sent += c.total_sent || 0;
        months[monthYear].opened += c.total_opened || 0;
        months[monthYear].clicked += c.total_clicked || 0;
      });
      
      const chartData = Object.values(months).map(m => ({
        ...m,
        openRate: m.sent > 0 ? Number(((m.opened / m.sent) * 100).toFixed(1)) : 0,
        clickRate: m.sent > 0 ? Number(((m.clicked / m.sent) * 100).toFixed(1)) : 0
      })).reverse(); // Reverse if descending order initially

      setMonthlyData(chartData);
    }
    
    loadAnalytics();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your email marketing performance
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                +18%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{metrics.totalSent.toLocaleString()}</p>
              <p className="mt-1 text-sm text-gray-500">Total Sent (All Time)</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                +5.2%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{metrics.openRate}%</p>
              <p className="mt-1 text-sm text-gray-500">Aggregate Open Rate</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <MousePointerClick className="h-6 w-6 text-purple-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                +2.1%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{metrics.clickRate}%</p>
              <p className="mt-1 text-sm text-gray-500">Aggregate Click Rate</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <UserMinus className="h-6 w-6 text-red-600" />
              </div>
              <span className="flex items-center text-sm font-medium text-red-600">
                <TrendingDown className="mr-1 h-4 w-4" />
                -0.3%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{metrics.unsubscribeRate}%</p>
              <p className="mt-1 text-sm text-gray-500">Unsubscribe Rate</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Monthly Activity */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Monthly Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="opened"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="clicked"
                  stackId="3"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Open Rate Trend */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Engagement Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="openRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot
                  name="Open Rate"
                />
                <Line
                  type="monotone"
                  dataKey="clickRate"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot
                  name="Click Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device & Client Breakdown */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Device Breakdown */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Opens by Device
            </h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {deviceData.map((device) => (
                  <div key={device.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-sm text-gray-600">{device.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {device.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email Client Breakdown */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Opens by Email Client
            </h3>
            <div className="space-y-4">
              {clientData.map((client) => (
                <div key={client.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600">{client.name}</span>
                    <span className="font-medium text-gray-900">
                      {client.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${client.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Campaigns */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Campaigns
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Click Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Unsubscribe Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topCampaigns.map((campaign, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {campaign.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {campaign.sent.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${campaign.openRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {campaign.openRate}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-purple-500"
                            style={{ width: `${campaign.clickRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {campaign.clickRate}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`text-sm ${campaign.unsubscribeRate > 0.3
                          ? "text-red-600"
                          : "text-gray-500"
                          }`}
                      >
                        {campaign.unsubscribeRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
