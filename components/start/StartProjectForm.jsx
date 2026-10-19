"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import { SITE } from "@/lib/site";
import { SERVICE_GROUPS } from "@/lib/services";

// Single-select per the brief. "Not sure" is a valid, first-class choice.
const BUDGETS = ["< $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Not sure yet"];

const field =
  "w-full rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3.5 text-bone placeholder:text-bone-faint outline-none transition-colors duration-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400";

export default function StartProjectForm() {
  const [sent, setSent] = useState(false);
  const successRef = useRef(null);

  // Move focus to the confirmation so screen-reader users are told it worked.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const onSubmit = (e) => {
    e.preventDefault();
    // Front-end only for now — no real send. Wire to a backend / email service later.
    setSent(true);
  };

  if (sent) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-5 rounded-2xl border border-gold-soft bg-ink-800/50 p-10 outline-none"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-ink-900">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="text-2xl font-medium tracking-tight text-bone">Thanks for the brief.</h2>
        <p className="max-w-md leading-relaxed text-bone-dim">
          We reply within 24 hours with a point of view, not a sales pitch. This form isn&apos;t
          wired to send just yet, to be sure it reaches us right now, drop the same note to{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="rounded-sm text-gold-300 underline-offset-4 transition-colors hover:text-gold-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            {SITE.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        Send the brief
      </ActionButton>
    </form>
  );
}
