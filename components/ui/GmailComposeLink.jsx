"use client";

import { SITE } from "@/lib/site";
import { buildGmailComposeUrl, readBriefFields } from "@/lib/gmail-compose.mjs";

export default function GmailComposeLink({ serviceGroup = "", children, ...props }) {
  return (
    <a
      {...props}
      href={buildGmailComposeUrl(SITE.email, {}, serviceGroup)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        event.currentTarget.href = buildGmailComposeUrl(
          SITE.email, readBriefFields(document.getElementById("project-brief-form")), serviceGroup,
        );
      }}
    >
      {children}
    </a>
  );
}
