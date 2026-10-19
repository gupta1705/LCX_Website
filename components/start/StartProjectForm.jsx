"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import { SITE } from "@/lib/site";
import { SERVICE_GROUPS } from "@/lib/services";
import { buildGmailComposeUrl, readBriefFields } from "@/lib/gmail-compose.mjs";

// Single-select per the brief. "Not sure" is a valid, first-class choice.
const BUDGETS = ["< $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Not sure yet"];

const field =
  "w-full rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3.5 text-bone placeholder:text-bone-faint outline-none transition-colors duration-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400";

export default function StartProjectForm() {
  const [draftUrl, setDraftUrl] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const url = buildGmailComposeUrl(SITE.email, readBriefFields(e.currentTarget));
    setDraftUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form id="project-brief-form" onSubmit={onSubmit} onChange={() => setDraftUrl("")} className="space-y-6">
      <h2 className="sr-only">Project brief form</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-bone-dim">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Jane Doe"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-bone-dim">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="jane@brand.com"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block text-sm text-bone-dim">
          Company <span className="text-bone-faint">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Brand Inc."
          className={field}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="need" className="mb-2 block text-sm text-bone-dim">
            What you need
          </label>
          {/* appearance-none kills the inconsistent native select chrome, so
              the explicit chevron is what tells a touch user (who has no
              cursor-pointer affordance) that this is a dropdown */}
          <div className="relative">
            <select
              id="need"
              name="need"
              required
              defaultValue=""
              className={`${field} cursor-pointer appearance-none pr-10`}
            >
              <option value="" disabled>
                Select one
              </option>
              {SERVICE_GROUPS.map((group) => (
                <optgroup key={group.id} label={group.title} className="bg-ink-800 text-bone">
                  {group.services.map((service) => (
                    <option key={service.name} value={service.name}>{service.name}</option>
                  ))}
                </optgroup>
              ))}
              <option value="Not sure" className="bg-ink-800 text-bone">Not sure</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-faint"
            />
          </div>
        </div>
        <div>
          <label htmlFor="budget" className="mb-2 block text-sm text-bone-dim">
            Budget range <span className="text-bone-faint">(optional)</span>
          </label>
          <div className="relative">
            <select
              id="budget"
              name="budget"
              defaultValue=""
              className={`${field} cursor-pointer appearance-none pr-10`}
            >
              <option value="">No preference</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b} className="bg-ink-800 text-bone">
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-faint"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-bone-dim">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="One film or a content engine? Tell us what you're building, the timeline, and what success looks like for you…"
          className={`${field} resize-none`}
        />
      </div>

      <ActionButton type="submit" tone="primary" size="lg" className="w-full sm:w-auto">
        Open in Gmail
      </ActionButton>
      <p className="text-sm leading-relaxed text-bone-dim">
        Opens a Gmail draft addressed to <span className="break-all">{SITE.email}</span> with your details. Review it and press Send in Gmail.
      </p>
      {draftUrl && (
        <p role="status" className="rounded-lg border border-gold-500/25 bg-ink-900/80 p-4 text-sm leading-relaxed text-bone">
          Your draft is ready. If Gmail didn’t open, {" "}
          <a href={draftUrl} target="_blank" rel="noopener noreferrer" className="text-gold-200 underline underline-offset-4">open your draft here</a>.
          {" "}Your details remain in this form until you leave the page.
        </p>
      )}
    </form>
  );
}
