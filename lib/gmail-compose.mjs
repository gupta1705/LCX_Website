export function buildGmailComposeUrl(to, fields = {}, serviceGroup = "") {
  const value = (key) => String(fields[key] ?? "").trim();
  const topic = value("need") || serviceGroup;
  const lines = [
    ["Name", value("name")],
    ["Email", value("email")],
    ["Company", value("company")],
    ["Service", topic],
    ["Budget", value("budget")],
  ].filter(([, entry]) => entry).map(([label, entry]) => `${label}: ${entry}`);
  if (value("message")) lines.push("", "Project brief:", value("message"));
  const query = new URLSearchParams({
    view: "cm", fs: "1", to,
    su: topic ? `LCX project enquiry: ${topic}` : "LCX project enquiry",
    body: lines.join("\n"),
  });
  return `https://mail.google.com/mail/?${query}`;
}

export function readBriefFields(form) {
  return form ? Object.fromEntries(new FormData(form)) : {};
}
