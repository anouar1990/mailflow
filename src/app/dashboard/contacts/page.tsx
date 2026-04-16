"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Edit2,
  Filter,
  Mail,
  X,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  MoreVertical,
  UserPlus,
  FileSpreadsheet,
} from "lucide-react";
import Papa from "papaparse";

export type Contact = {
  id: string; // Updated to match UUID from DB
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  tags: string[];
  status: "active" | "unsubscribed" | "bounced" | "complained";
  created_at: string;
  user_id?: string;
};

import { createClient } from "@/lib/supabase/client";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newContact, setNewContact] = useState({ email: "", first_name: "", last_name: "", company: "", tags: "" });
  const [importFile, setImportFile] = useState<string | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useState(() => {
    async function loadContacts() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
        if (data) setContacts(data as Contact[]);
      }
      setIsLoading(false);
    }
    loadContacts();
  });

  const filteredContacts = contacts.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = contacts.filter((c) => c.status === "active").length;
  const unsubscribedCount = contacts.filter((c) => c.status === "unsubscribed").length;
  const bouncedCount = contacts.filter((c) => c.status === "bounced").length;

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const handleAddContact = async () => {
    if (!newContact.email.trim()) {
      showToast("error", "Email address is required");
      return;
    }

    setIsSubmitting(true);

    const contactData = {
      email: newContact.email.trim().toLowerCase(),
      first_name: newContact.first_name.trim(),
      last_name: newContact.last_name.trim(),
      company: newContact.company.trim(),
      tags: newContact.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: "active",
      user_id: userId,
    };

    const { data: insertedContact, error } = await supabase.from("contacts").insert(contactData).select().single();

    setIsSubmitting(false);

    if (error) {
      showToast("error", "Failed to add contact. Note: Email may already exist.");
      return;
    }

    setContacts([insertedContact as Contact, ...contacts]);
    setNewContact({ email: "", first_name: "", last_name: "", company: "", tags: "" });
    setShowAddModal(false);
    showToast("success", `${insertedContact.first_name || insertedContact.email} added successfully`);
  };

  const handleDeleteSelected = async () => {
    setIsSubmitting(true);
    const idsToDelete = Array.from(selectedContacts);
    
    const { error } = await supabase.from("contacts").delete().in("id", idsToDelete);
    
    setIsSubmitting(false);

    if (error) {
       showToast("error", "Failed to delete contacts.");
       return;
    }

    setContacts(contacts.filter((c) => !selectedContacts.has(c.id)));
    const count = selectedContacts.size;
    setSelectedContacts(new Set());
    setDeleteConfirm(false);
    showToast("success", `${count} contact${count > 1 ? "s" : ""} deleted`);
  };

  const handleDeleteSingle = async (id: string) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) {
       showToast("error", "Failed to delete contact.");
       return;
    }

    const contact = contacts.find((c) => c.id === id);
    setContacts(contacts.filter((c) => c.id !== id));
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast("success", `${contact?.email} deleted`);
  };

  const handleExport = () => {
    const headers = ["Email", "First Name", "Last Name", "Company", "Tags", "Status"];
    const rows = (selectedContacts.size > 0
      ? contacts.filter((c) => selectedContacts.has(c.id))
      : contacts
    ).map((c) => [c.email, c.first_name, c.last_name, c.company, c.tags?.join("; ") || "", c.status]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("success", `${rows.length} contacts exported`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: any[] = results.data.map((row: any) => {
          return {
            email: row.email || row.Email || "",
            first_name: row.firstName || row["First Name"] || row.first_name || "",
            last_name: row.lastName || row["Last Name"] || row.last_name || "",
            company: row.company || row.Company || "",
            tags: (row.tags || row.Tags) ? String(row.tags || row.Tags).split(";").map((t: string) => t.trim()) : [],
            status: "active",
            user_id: userId,
          };
        }).filter(c => c.email !== ""); // Filter out invalid rows with no email
        
        setImportData(parsed);
        setImportFile(file.name);
      },
      error: (error) => {
        showToast("error", `Failed to parse CSV: ${error.message}`);
      }
    });
  };

  const handleImport = async () => {
    setIsSubmitting(true);
    
    // Use upsert to handle existing emails
    const { data: inserted, error } = await supabase.from("contacts").upsert(importData, { onConflict: "user_id,email" }).select();
    
    setIsSubmitting(false);

    if (error) {
      showToast("error", "Failed to import contacts");
      return;
    }

    if (inserted) {
        // Add only those that aren't already in state to prevent duplicates in UI if upserting
        const newContacts = inserted.filter(i => !contacts.find(c => c.id === i.id));
        setContacts([...newContacts, ...contacts]);
    }
    
    const count = importData.length;
    setImportData([]);
    setImportFile(null);
    setShowImportModal(false);
    showToast("success", `${count} contacts imported from CSV`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-4 top-4 z-[100] animate-in fade-in slide-in-from-top-2">
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
              }`}
          >
            {toast.type === "success" ? (
              <Check className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 rounded p-1 hover:bg-black/5">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Contacts</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete {selectedContacts.size} contact{selectedContacts.size > 1 ? "s" : ""}? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your subscribers and build your audience
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={handleExport}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Contacts", value: contacts.length, color: "text-gray-900" },
            { label: "Active", value: activeCount, color: "text-emerald-600" },
            { label: "Unsubscribed", value: unsubscribedCount, color: "text-amber-600" },
            { label: "Bounced", value: bouncedCount, color: "text-red-600" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-gray-300 transition-colors">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-3xl font-semibold tabular-nums ${stat.color}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Filter Bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Bulk Selection Bar */}
        {selectedContacts.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-blue-400 bg-blue-500 text-white transition-all"
              >
                <Check className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-blue-900">
                {selectedContacts.size} contact{selectedContacts.size > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedContacts(new Set())}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Deselect
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="w-12 px-5 py-3">
                    <button
                      onClick={toggleSelectAll}
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${selectedContacts.size === filteredContacts.length && filteredContacts.length > 0
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {selectedContacts.size === filteredContacts.length && filteredContacts.length > 0 && (
                        <Check className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">
                    Company
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Tags
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 lg:table-cell">
                    Added
                  </th>
                  <th className="w-12 px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Mail className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No contacts found</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {searchQuery ? "Try adjusting your search" : "Add your first contact to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => {
                    const isSelected = selectedContacts.has(contact.id);
                    return (
                      <tr
                        key={contact.id}
                        className={`group transition-colors ${isSelected ? "bg-blue-50/50" : "hover:bg-gray-50/80"
                          }`}
                      >
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => toggleSelect(contact.id)}
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 group-hover:border-gray-400"
                              }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white shadow-sm">
                              {(contact.first_name?.[0] || contact.email[0]).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {contact.first_name} {contact.last_name}
                              </p>
                              <p className="truncate text-sm text-gray-500">{contact.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-5 py-3.5 text-sm text-gray-500 md:table-cell">
                          {contact.company || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1.5">
                            {(contact.tags || []).slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                            {(contact.tags || []).length > 2 && (
                              <span className="inline-flex rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                                +{(contact.tags || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${contact.status === "active"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                : contact.status === "unsubscribed"
                                  ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                                  : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                              }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${contact.status === "active" ? "bg-emerald-500" : contact.status === "unsubscribed" ? "bg-amber-500" : "bg-red-500"
                              }`} />
                            {contact.status}
                          </span>
                        </td>
                        <td className="hidden px-5 py-3.5 text-sm text-gray-500 lg:table-cell">
                          {new Date(contact.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="relative">
                            <button
                              onClick={() => setSelectedDropdown(selectedDropdown === contact.id ? null : contact.id)}
                              className="rounded-lg p-1.5 text-gray-400 opacity-0 hover:bg-gray-100 hover:text-gray-600 transition-all group-hover:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {selectedDropdown === contact.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setSelectedDropdown(null)} />
                                <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                                  <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <Mail className="h-4 w-4" />
                                    Send Email
                                  </button>
                                  <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                  </button>
                                  <div className="my-1 border-t border-gray-100" />
                                  <button
                                    onClick={() => { handleDeleteSingle(contact.id); setSelectedDropdown(null); }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredContacts.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{filteredContacts.length}</span> of{" "}
                <span className="font-medium text-gray-700">{contacts.length}</span> contacts
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Add Contact</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={newContact.firstName}
                      onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={newContact.lastName}
                      onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    placeholder="Acme Inc"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Tags <span className="text-gray-400 font-normal">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={newContact.tags}
                    onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                    placeholder="customer, vip, lead"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                disabled={isSubmitting || !newContact.email.trim()}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Add Contact"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <FileSpreadsheet className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Import Contacts</h2>
              </div>
              <button
                onClick={() => { setShowImportModal(false); setImportData([]); setImportFile(null); }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              {!importFile ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                  <Upload className="mb-3 h-10 w-10 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload a CSV file
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Columns: email, first name, last name, company, tags
                  </p>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              ) : (
                <div>
                  <div className="mb-4 rounded-xl bg-emerald-50 p-4">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-800">
                        {importData.length} contacts found in <span className="font-semibold">{importFile}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 max-h-56 overflow-y-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {importData.slice(0, 8).map((c) => (
                          <tr key={c.id}>
                            <td className="px-3 py-2 text-gray-600">{c.email}</td>
                            <td className="px-3 py-2 text-gray-500">{c.firstName} {c.lastName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importData.length > 8 && (
                      <p className="px-3 py-2 text-xs text-gray-400">
                        +{importData.length - 8} more contacts
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              {importFile ? (
                <>
                  <button
                    onClick={() => { setShowImportModal(false); setImportData([]); setImportFile(null); }}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      `Import ${importData.length} Contacts`
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowImportModal(false); setImportFile(null); }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
