import test from "node:test";
import assert from "node:assert/strict";
import { buildGmailComposeUrl } from "./gmail-compose.mjs";

test("Gmail draft preserves every brief field and special characters", () => {
  const url = new URL(buildGmailComposeUrl("kartikeyap@lightscameraexperiment.com", {
    name: "Test & Team", email: "test+brief@example.com", company: "LCX / Test",
    need: "AI film", budget: "$10k – $25k", message: "First line & question?\nSecond line: हिन्दी + 100%",
  }));
  assert.equal(url.origin, "https://mail.google.com");
  assert.equal(url.searchParams.get("to"), "kartikeyap@lightscameraexperiment.com");
  assert.equal(url.searchParams.get("su"), "LCX project enquiry: AI film");
  assert.equal(url.searchParams.get("body"), "Name: Test & Team\nEmail: test+brief@example.com\nCompany: LCX / Test\nService: AI film\nBudget: $10k – $25k\n\nProject brief:\nFirst line & question?\nSecond line: हिन्दी + 100%");
});

test("email links work with empty or partial briefs and service context", () => {
  const empty = new URL(buildGmailComposeUrl("contact@example.com"));
  assert.equal(empty.searchParams.get("body"), "");
  const partial = new URL(buildGmailComposeUrl("contact@example.com", { name: " Jane " }, "Production"));
  assert.equal(partial.searchParams.get("body"), "Name: Jane\nService: Production");
  const chosen = new URL(buildGmailComposeUrl("contact@example.com", { need: "Film" }, "Production"));
  assert.equal(chosen.searchParams.get("su"), "LCX project enquiry: Film");
});
