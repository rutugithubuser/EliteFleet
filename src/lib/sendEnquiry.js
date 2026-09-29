// Sends a form's details to the business by email, using Web3Forms
// (https://web3forms.com). The access key lives in .env.local as
// NEXT_PUBLIC_WEB3FORMS_KEY — it's meant to be public: it can only send
// emails to the inbox it was created with, nothing else.
//
// Usage:
//   const result = await sendEnquiry({
//     subject: "New chauffeur request",
//     name: "Sara Khan",
//     email: "sara@example.com",          // optional: lets the team press "Reply"
//     fields: { "Service": "Airport Transfers", "Date": "3 October 2026" },
//   });
//   if (result.ok) { ...show thank-you... } else { ...show error... }

const ENDPOINT = "https://api.web3forms.com/submit";

export async function sendEnquiry({ subject, name, email, fields = {} }) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!accessKey) {
    console.error("Web3Forms key missing: add NEXT_PUBLIC_WEB3FORMS_KEY to .env.local");
    return { ok: false };
  }

  // Leave out empty answers so the email stays tidy
  const filled = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value != null && String(value).trim() !== "")
  );

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        from_name: "Elite Fleet website",
        name,
        ...(email ? { email } : {}),
        ...filled,
      }),
    });
    const data = await response.json().catch(() => ({}));
    return { ok: Boolean(data.success) };
  } catch {
    // No internet, or the service is down
    return { ok: false };
  }
}
