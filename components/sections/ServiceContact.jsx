"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { SITE } from "@/lib/site";
import GmailComposeLink from "@/components/ui/GmailComposeLink";

export default function ServiceContact({ group }) {
  const [open, setOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const panelId = `contact-${group.id}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopyStatus("Email address copied.");
    } catch {
      setCopyStatus("Select the email address above and copy it.");
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="inline-flex min-h-11 items-center gap-3 rounded-sm text-left text-base font-medium text-gold-200 underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
      >
        Talk to us about {group.title.toLowerCase()}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </button>
      <div id={panelId} hidden={!open} className="mt-5 max-w-2xl rounded-lg border border-gold-500/25 bg-ink-900 p-5 sm:p-7">
        <p className="text-base leading-relaxed text-bone-dim">
          Email us about {group.title.toLowerCase()}. Tell us what you’re building and when you need it.
        </p>
        <GmailComposeLink serviceGroup={group.title} className="mt-4 block break-all text-lg text-gold-200 underline underline-offset-4">{SITE.email}</GmailComposeLink>
        <button
          type="button"
          onClick={copyEmail}
          aria-label={`Copy email address for ${group.title}`}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold-500/30 px-5 text-sm text-gold-200 transition-colors hover:bg-gold-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
        >
          {copyStatus === "Email address copied." ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          Copy email address
        </button>
        <p role="status" className="mt-3 text-sm text-bone-dim">{copyStatus}</p>
      </div>
    </div>
  );
}
