"use client";

import { useState } from "react";
import { Plus, Users, Filter, Trash2, Edit2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export type Segment = {
  id: string;
  name: string;
  description: string;
  filter: any;
  contact_count: number;
  created_at: string;
  user_id?: string;
};

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newSegment, setNewSegment] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useState(() => {
    async function loadSegments() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase.from("segments").select("*").order("created_at", { ascending: false });
        if (data) setSegments(data);
      }
    }
    loadSegments();
  });

  const handleCreate = async () => {
    if (!newSegment.name.trim()) return;
    setIsSubmitting(true);
    const { data, error } = await supabase.from("segments").insert({
      name: newSegment.name.trim(),
      description: newSegment.description.trim(),
      filter: {},
      contact_count: 0,
      user_id: userId
    }).select().single();
    
    if (data) {
      setSegments([data, ...segments]);
      setShowModal(false);
      setNewSegment({ name: "", description: "" });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this segment?")) return;
    await supabase.from("segments").delete().eq("id", id);
    setSegments(segments.filter((s) => s.id !== id));
  };

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
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 bg-blue-600">
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
                  <button onClick={() => handleDelete(segment.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {segment.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {segment.description || "No description provided."}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {segment.filter ? Object.keys(segment.filter).length : 0} filters
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {(segment.contact_count || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">contacts</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Created {new Date(segment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">New Segment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Segment Name</label>
                  <input type="text" className="w-full border rounded-md p-2 mt-1" value={newSegment.name} onChange={e => setNewSegment({...newSegment, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Description</label>
                  <textarea className="w-full border rounded-md p-2 mt-1" value={newSegment.description} onChange={e => setNewSegment({...newSegment, description: e.target.value})}></textarea>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md">Cancel</button>
                  <button onClick={handleCreate} disabled={isSubmitting} className="px-4 py-2 text-white bg-blue-600 rounded-md">
                    {isSubmitting ? "Saving..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
