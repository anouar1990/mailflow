"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, Trash2, Copy, FileText } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to {{company}}!",
    category: "Onboarding",
    lastModified: "Apr 14, 2026",
    usageCount: 1234,
  },
  {
    id: 2,
    name: "Monthly Newsletter",
    subject: "{{month}} Newsletter - What's New",
    category: "Newsletter",
    lastModified: "Apr 12, 2026",
    usageCount: 890,
  },
  {
    id: 3,
    name: "Promotional - Sale",
    subject: "🔥 {{sale}}% Off - Limited Time!",
    category: "Promotional",
    lastModified: "Apr 10, 2026",
    usageCount: 567,
  },
  {
    id: 4,
    name: "Product Update",
    subject: "New Feature: {{feature}} is here!",
    category: "Product",
    lastModified: "Apr 8, 2026",
    usageCount: 345,
  },
  {
    id: 5,
    name: "Abandoned Cart",
    subject: "You left something behind...",
    category: "Transactional",
    lastModified: "Apr 5, 2026",
    usageCount: 234,
  },
  {
    id: 6,
    name: "Re-engagement",
    subject: "We miss you! Come back for {{offer}}",
    category: "Retention",
    lastModified: "Apr 3, 2026",
    usageCount: 123,
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage email templates
            </p>
          </div>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Template
          </Link>
        </div>
      </div>

      <div className="p-8">
        {/* Templates Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md"
            >
              {/* Preview Area */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <FileText className="h-16 w-16 text-gray-300" />
              </div>
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {template.subject}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {template.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Used {template.usageCount} times
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-500">
                    {template.lastModified}
                  </span>
                  <div className="flex gap-2">
                    <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
