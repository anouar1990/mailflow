"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Edit2,
  MoreHorizontal,
  Filter,
  Mail,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export type Contact = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  tags: string[];
  status: string;
  createdAt: string;
};

const initialContacts: Contact[] = [
  {
    id: 1,
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    company: "Acme Inc",
    tags: ["customer", "vip"],
    status: "active",
    createdAt: "2026-04-10",
  },
  {
    id: 2,
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    company: "Tech Corp",
    tags: ["subscriber"],
    status: "active",
    createdAt: "2026-04-11",
  },
  {
    id: 3,
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    company: "StartupXYZ",
    tags: ["lead"],
    status: "unsubscribed",
    createdAt: "2026-04-12",
  },
  {
    id: 4,
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Williams",
    company: "Design Co",
    tags: ["customer"],
    status: "active",
    createdAt: "2026-04-13",
  },
  {
    id: 5,
    email: "charlie@example.com",
    firstName: "Charlie",
    lastName: "Brown",
    company: "Marketing Pro",
    tags: ["subscriber", "lead"],
    status: "bounced",
    createdAt: "2026-04-14",
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newContact, setNewContact] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    tags: "",
  });
  const [importFile, setImportFile] = useState<string | null>(null);
  const [importData, setImportData] = useState<Contact[]>([]);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const filteredContacts = contacts.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = contacts.filter((c) => c.status === "active").length;
  const unsubscribedCount = contacts.filter(
    (c) => c.status === "unsubscribed"
  ).length;
  const bouncedCount = contacts.filter((c) => c.status === "bounced").length;

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddContact = async () => {
    if (!newContact.email) {
      showNotification("error", "Email is required");
      return;
    }

    const contact: Contact = {
      id: Date.now(),
      email: newContact.email,
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      company: newContact.company,
      tags: newContact.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setContacts([...contacts, contact]);
    setNewContact({ email: "", firstName: "", lastName: "", company: "", tags: "" });
    setShowAddModal(false);
    showNotification("success", "Contact added successfully!");

    // Try to save to Supabase (will fail gracefully if not configured)
    try {
      await supabase.from("contacts").insert({
        email: contact.email,
        first_name: contact.firstName,
        last_name: contact.lastName,
        company: contact.company,
        tags: contact.tags,
        status: contact.status,
      });
    } catch (e) {
      console.log("Supabase not configured, contact saved locally");
    }
  };

  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter((c) => c.id !== id));
    setSelectedContacts(selectedContacts.filter((i) => i !== id));
    showNotification("success", "Contact deleted");
  };

  const handleBulkDelete = () => {
    setContacts(contacts.filter((c) => !selectedContacts.includes(c.id)));
    showNotification("success", `${selectedContacts.length} contacts deleted`);
    setSelectedContacts([]);
  };

  const handleExport = () => {
    const headers = ["Email", "First Name", "Last Name", "Company", "Tags", "Status"];
    const rows = contacts.map((c) => [
      c.email,
      c.firstName,
      c.lastName,
      c.company,
      c.tags.join(", "),
      c.status,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("success", "Contacts exported successfully!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const parsed: Contact[] = lines.slice(1).map((line, i) => {
        const values = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || "";
        });

        return {
          id: Date.now() + i,
          email: row.email || row["email address"] || "",
          firstName: row["first name"] || row.firstname || "",
          lastName: row["last name"] || row.lastname || "",
          company: row.company || "",
          tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()) : [],
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
        };
      });

      setImportData(parsed);
      setImportFile(file.name);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setContacts([...contacts, ...importData]);
    setImportData([]);
    setImportFile(null);
    setShowImportModal(false);
    showNotification("success", `${importData.length} contacts imported!`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg ${notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
            }`}
        >
          {notification.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your subscribers and contacts
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Total Contacts</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {contacts.length.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {activeCount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Unsubscribed</p>
            <p className="mt-1 text-2xl font-bold text-yellow-600">
              {unsubscribedCount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Bounced</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {bouncedCount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2">
            <span className="text-sm text-blue-700">
              {selectedContacts.length} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Contacts Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts(contacts.map((c) => c.id));
                      } else {
                        setSelectedContacts([]);
                      }
                    }}
                    checked={
                      selectedContacts.length === contacts.length &&
                      contacts.length > 0
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Added
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts([
                            ...selectedContacts,
                            contact.id,
                          ]);
                        } else {
                          setSelectedContacts(
                            selectedContacts.filter((id) => id !== contact.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                        {contact.firstName?.[0]}
                        {contact.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.company}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${contact.status === "active"
                          ? "bg-green-100 text-green-800"
                          : contact.status === "unsubscribed"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </p>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Contact
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  placeholder="contact@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newContact.firstName}
                    onChange={(e) =>
                      setNewContact({ ...newContact, firstName: e.target.value })
                    }
                    placeholder="John"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newContact.lastName}
                    onChange={(e) =>
                      setNewContact({ ...newContact, lastName: e.target.value })
                    }
                    placeholder="Doe"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  value={newContact.company}
                  onChange={(e) =>
                    setNewContact({ ...newContact, company: e.target.value })
                  }
                  placeholder="Acme Inc"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newContact.tags}
                  onChange={(e) =>
                    setNewContact({ ...newContact, tags: e.target.value })
                  }
                  placeholder="customer, vip"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Import Contacts
              </h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportData([]);
                  setImportFile(null);
                }}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!importFile ? (
              <div>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-primary">
                  <Upload className="mb-3 h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload CSV
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Columns: email, first name, last name, company, tags
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div>
                <div className="mb-4 rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-700">
                    {importData.length} contacts found in {importFile}
                  </p>
                </div>
                <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                          Company
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {importData.slice(0, 10).map((c) => (
                        <tr key={c.id}>
                          <td className="px-3 py-2">{c.email}</td>
                          <td className="px-3 py-2">
                            {c.firstName} {c.lastName}
                          </td>
                          <td className="px-3 py-2">{c.company}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-3">
              {importFile ? (
                <>
                  <button
                    onClick={() => {
                      setShowImportModal(false);
                      setImportData([]);
                      setImportFile(null);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Import {importData.length} Contacts
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowImportModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
