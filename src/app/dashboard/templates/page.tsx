"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Edit2, Trash2, Copy, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase.from("templates").select("*").order("created_at", { ascending: false });
      if (data) setTemplates(data);
      setIsLoading(false);
    }
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    const { error } = await supabase.from("templates").delete().eq("id", id);
    if (!error) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

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
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : templates.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
               <p className="text-gray-500">No templates found. Create your first one!</p>
            </div>
          ) : templates.map((template) => (
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
                    <p className="mt-1 text-sm text-gray-500 truncate w-full">
                      {template.subject}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    Template
                  </span>
                  <span className="text-xs text-gray-500">
                    Custom
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-500">
                    {new Date(template.created_at).toLocaleDateString()}
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
                    <button onClick={() => handleDelete(template.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
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
