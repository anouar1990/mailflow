"use client";

import { useState } from "react";
import { Plus, Users, Filter, Trash2, Edit2 } from "lucide-react";

const segments = [
  {
    id: 1,
    name: "VIP Customers",
    description: "High-value customers with >$1000 lifetime value",
    filter: { tags: ["vip", "customer"], status: "active" },
    contacts: 892,
    createdAt: "Apr 10, 2026",
  },
  {
    id: 2,
    name: "New Signups",
    description: "Users who joined in the last 30 days",
    filter: { status: "active", created_after: "30d" },
    contacts: 1230,
    createdAt: "Apr 5, 2026",
  },
  {
    id: 3,
    name: "Engaged Subscribers",
    description: "Opened at least one email in the last 90 days",
    filter: { status: "active", last_opened: "90d" },
    contacts: 8450,
    createdAt: "Mar 20, 2026",
  },
  {
    id: 4,
    name: "Inactive Users",
    description: "No engagement in the last 180 days",
    filter: { status: "active", last_opened: "180d" },
    contacts: 2340,
    createdAt: "Mar 15, 2026",
  },
];

export default function SegmentsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Segments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Group contacts for targeted campaigns
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Segment
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex gap-2">
                  <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {segment.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {segment.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {Object.keys(segment.filter).length} filters
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {segment.contacts.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">contacts</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Created {segment.createdAt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
