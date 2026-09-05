export async function forwardViaFormSubmit(payload: {
  name: string;
  company: string;
  phone: string;
  email: string;
  type: string;
  message: string;
}) {
  const res = await fetch("https://formsubmit.co/ajax/service@glacierair.com.au", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      _replyto: payload.email,
      _subject: `Glacier Air website enquiry: ${payload.type}`,
      _template: "table",
      company: payload.company || "(not provided)",
      phone: payload.phone,
      type: payload.type,
      message: payload.message,
    }),
  });
  const data = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
  return Boolean(res.ok && data && data.success !== "false" && data.success !== false);
}
