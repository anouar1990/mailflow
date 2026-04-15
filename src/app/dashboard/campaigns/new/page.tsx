"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Eye, Users, Clock } from "lucide-react";

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState({
    name: "",
    subject: "",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    segmentId: "",
    templateId: "",
    htmlContent: "",
    textContent: "",
    scheduledAt: "",
  });

  const segments = [
    { id: "all", name: "All Contacts", count: 12345 },
    { id: "vip", name: "VIP Customers", count: 892 },
    { id: "active", name: "Active Subscribers", count: 8450 },
    { id: "new", name: "New Signups (30 days)", count: 1230 },
  ];

  const templates = [
    { id: "welcome", name: "Welcome Email" },
    { id: "newsletter", name: "Monthly Newsletter" },
    { id: "promo", name: "Promotional" },
    { id: "blank", name: "Blank Template" },
  ];

  const handleSend = async (immediate = false) => {
    // In production: call API to send via SES
    console.log("Sending campaign:", campaign, immediate ? "immediately" : "scheduled");
    router.push("/dashboard/campaigns");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Campaign
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Step {step} of 3 - {step === 1 ? "Details" : step === 2 ? "Content" : "Review & Send"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-8">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                  s <= step
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 w-16 rounded ${
                    s < step ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Campaign Details */}
        {step === 1 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Campaign Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaign.name}
                  onChange={(e) =>
                    setCampaign({ ...campaign, name: e.target.value })
                  }
                  placeholder="e.g., Summer Sale 2026"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={campaign.subject}
                  onChange={(e) =>
                    setCampaign({ ...campaign, subject: e.target.value })
                  }
                  placeholder="e.g., 🌞 Hot Summer Deals - Up to 50% Off!"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tip: Use emojis and personalization to increase open rates
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={campaign.fromName}
                    onChange={(e) =>
                      setCampaign({ ...campaign, fromName: e.target.value })
                    }
                    placeholder="e.g., Your Company"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={campaign.fromEmail}
                    onChange={(e) =>
                      setCampaign({ ...campaign, fromEmail: e.target.value })
                    }
                    placeholder="e.g., hello@yourcompany.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Reply-To Email (optional)
                </label>
                <input
                  type="email"
                  value={campaign.replyTo}
                  onChange={(e) =>
                    setCampaign({ ...campaign, replyTo: e.target.value })
                  }
                  placeholder="e.g., support@yourcompany.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-blue-700"
              >
                Next: Content
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Email Content */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Choose Template
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() =>
                      setCampaign({ ...campaign, templateId: template.id })
                    }
                    className={`rounded-lg border-2 p-4 text-center transition ${
                      campaign.templateId === template.id
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="mb-2 flex h-16 items-center justify-center rounded bg-gray-100">
                      <Eye className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {template.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Select Recipients
              </h2>
              <div className="space-y-3">
                {segments.map((segment) => (
                  <label
                    key={segment.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition ${
                      campaign.segmentId === segment.id
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {segment.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {segment.count.toLocaleString()} contacts
                    </span>
                    <input
                      type="radio"
                      name="segment"
                      checked={campaign.segmentId === segment.id}
                      onChange={() =>
                        setCampaign({ ...campaign, segmentId: segment.id })
                      }
                      className="h-4 w-4 text-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* HTML Content */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Email Content
              </h2>
              <div className="mb-2 flex gap-2">
                <button className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  HTML
                </button>
                <button className="rounded-md px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100">
                  Plain Text
                </button>
              </div>
              <textarea
                value={campaign.htmlContent}
                onChange={(e) =>
                  setCampaign({ ...campaign, htmlContent: e.target.value })
                }
                placeholder="<html><body><h1>Hello!</h1><p>Your email content here...</p></body></html>"
                rows={12}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-blue-700"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Send */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Review Campaign
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-500">Campaign Name</span>
                  <span className="font-medium text-gray-900">
                    {campaign.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-500">Subject</span>
                  <span className="font-medium text-gray-900">
                    {campaign.subject || "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-500">From</span>
                  <span className="font-medium text-gray-900">
                    {campaign.fromName}{" "}
                    {campaign.fromEmail ? `<${campaign.fromEmail}>` : ""}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-500">Recipients</span>
                  <span className="font-medium text-gray-900">
                    {segments.find((s) => s.id === campaign.segmentId)?.name ||
                      "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-500">Estimated Reach</span>
                  <span className="font-medium text-gray-900">
                    {segments.find((s) => s.id === campaign.segmentId)?.count.toLocaleString() || 0}{" "}
                    contacts
                  </span>
                </div>
              </div>
            </div>

            {/* Send Options */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                When to Send
              </h2>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:border-gray-300">
                  <input
                    type="radio"
                    name="schedule"
                    className="h-4 w-4 text-primary"
                  />
                  <Send className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Send Immediately</p>
                    <p className="text-sm text-gray-500">
                      Start sending right away
                    </p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:border-gray-300">
                  <input
                    type="radio"
                    name="schedule"
                    className="h-4 w-4 text-primary"
                  />
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Schedule for Later</p>
                    <p className="text-sm text-gray-500">
                      Choose a specific date and time
                    </p>
                    <input
                      type="datetime-local"
                      value={campaign.scheduledAt}
                      onChange={(e) =>
                        setCampaign({ ...campaign, scheduledAt: e.target.value })
                      }
                      className="mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSend(false)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Clock className="h-4 w-4" />
                  Schedule
                </button>
                <button
                  onClick={() => handleSend(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  Send Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
