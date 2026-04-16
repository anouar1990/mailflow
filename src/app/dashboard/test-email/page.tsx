"use client";

import { useState } from "react";
import { Send, Loader2, Check, AlertCircle, Mail } from "lucide-react";

export default function TestEmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Test Email from MailFlow");
  const [body, setBody] = useState(`
    <h1>Hello from MailFlow! 🚀</h1>
    <p>This is a test email sent via Amazon SES.</p>
    <p>If you received this, your setup is working!</p>
    <hr>
    <p><small>Sent with ❤️ from Vercel</small></p>
  `);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState("");

  const handleSend = async () => {
    if (!to) {
      setStatus("error");
      setMessage("Please enter a recipient email");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: [to],
          subject,
          htmlContent: body,
          textContent: "Test email from MailFlow",
          fromName: "MailFlow",
          fromEmail: process.env.NEXT_PUBLIC_FROM_EMAIL || to,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setMessage("Email sent successfully!");
      setMessageId(data.messageId || "");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to send email");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-5 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Test Email Sender</h1>
          <p className="mt-1 text-sm text-gray-500">
            Send a test email via Amazon SES to verify your setup
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Status Messages */}
          {status === "success" && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <Check className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">{message}</p>
                {messageId && (
                  <p className="mt-1 text-xs text-emerald-600">Message ID: {messageId}</p>
                )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">{message}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Recipient Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="test@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Must be a verified email in SES (sandbox mode) or any email (production mode)
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                HTML Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={status === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Test Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* SES Info */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Amazon SES Info</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-amber-700">
                <li>• Sandbox mode: can only send to verified emails</li>
                <li>• Production mode: can send to any email</li>
                <li>• Your limit: 50,000 emails/day</li>
                <li>• Cost: $0.10 per 1,000 emails</li>
                <li>• Region: {process.env.AWS_REGION || "eu-central-1"}</li>
              </ul>
              <p className="mt-3 text-xs text-amber-800">
                <strong>To move to production:</strong> AWS SES Console → Sending Limits → Request Production Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
