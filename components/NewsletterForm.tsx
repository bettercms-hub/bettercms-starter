"use client";

/** Footer newsletter (Ft7). Renders the seeded `Newsletter` form, which nothing rendered before.
 *
 *  Deliberately NOT <BcmsForm>: that component owns its own submit wiring keyed off every
 *  `form[data-bcms-form]` on the page, so a second instance alongside the contact form would
 *  double-bind and POST each submission twice. This owns its own state and posts to the same
 *  public endpoint. */
import { useState } from "react";
import type { DeliveryForm } from "@bettercms-ai/sdk";

const API = process.env.NEXT_PUBLIC_BCMS_API_URL ?? "https://api.bettercms.ai";

export function NewsletterForm({ form }: { form: DeliveryForm }) {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const email = form.fields?.find((f) => f.type === "email");
  const emailKey = email?.key ?? "email";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const data: Record<string, string> = {};
    new FormData(el).forEach((v, k) => { data[k] = String(v); });
    setBusy(true);
    try {
      const res = await fetch(`${API}/api/v1/forms/public/${encodeURIComponent(form.id)}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error(String(res.status));
      el.reset();
      setMsg({ text: form.successMessage ?? "Thanks — you're subscribed.", ok: true });
    } catch {
      setMsg({ text: "Something went wrong. Please try again.", ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter" onSubmit={onSubmit}>
      <label className="newsletter-label" htmlFor="newsletter-email">{email?.label ?? "Subscribe"}</label>
      <div className="newsletter-row">
        <input
          id="newsletter-email"
          type="email"
          name={emailKey}
          required
          placeholder={email?.placeholder ?? "you@company.com"}
          autoComplete="email"
        />
        <button type="submit" disabled={busy}>{form.submitLabel || "Subscribe"}</button>
      </div>
      {form.honeypotField && (
        <input type="text" name={form.honeypotField} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" />
      )}
      {/* role=status so the outcome reaches a screen reader — it's the only feedback there is. */}
      <p className={`newsletter-msg newsletter-msg--${msg?.ok ? "ok" : "err"}`} role="status" aria-live="polite" hidden={!msg}>
        {msg?.text}
      </p>
    </form>
  );
}
