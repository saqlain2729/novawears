"use client";

import { useState } from "react";

export default function ContactForm({ businessEmail }: { businessEmail: string }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-line-light p-6">
        <p className="font-display text-lg mb-2">Message sent.</p>
        <p className="text-sm text-silver-dark">
          We&apos;ll reply to you shortly. You can also reach us directly at {businessEmail}.
        </p>
      </div>
    );
  }

  const input = "w-full border border-line-light px-4 py-3 text-sm outline-none focus:border-ink transition-colors bg-paper";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        placeholder="Your name"
        className={input}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        required
        type="email"
        placeholder="Your email"
        className={input}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <textarea
        required
        rows={5}
        placeholder="How can we help?"
        className={input}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {status === "error" && <p className="text-sm text-red-600">Something went wrong — please try again or email us directly.</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-ink text-paper py-3.5 text-[12px] tracking-widest2 uppercase hover:bg-ink-soft transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
