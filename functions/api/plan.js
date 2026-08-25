const INBOXES = [
  "https://formsubmit.co/ajax/ryan.mostert2006@gmail.com",
  "https://formsubmit.co/ajax/ryan@webworkco.com",
];

function headersFor(request) {
  const origin = request.headers.get("Origin") || "https://webworkco.com";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: headersFor(request) });
}

export async function onRequestPost({ request }) {
  const headers = headersFor(request);
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400, headers });
  }

  if (data.company) {
    return Response.json({ ok: true }, { headers });
  }

  const payload = {
    name: data.name || "",
    email: data.email || "",
    _replyto: data.email || "",
    _subject: `Web Work Co plan: ${data.package || "Plan"} — ${data.name || "Someone"}`,
    _template: "table",
    _captcha: "false",
    city: data.city || "",
    package: data.package || "",
    currency: data.currency || "",
    price: data.price || "",
    domain: data.domain || "",
    currentSite: data.currentSite || "",
    message: data.goal || data.message || "",
  };

  const results = await Promise.allSettled(
    INBOXES.map((url) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://webworkco.com",
          Referer: "https://webworkco.com/",
        },
        body: JSON.stringify(payload),
      }).then(async (res) => ({
        status: res.status,
        body: await res.json().catch(() => ({})),
      }))
    )
  );

  const delivered = results.some((r) => {
    if (r.status !== "fulfilled") return false;
    const success = r.value.body.success;
    return success === true || success === "true";
  });

  if (delivered) {
    return Response.json({ ok: true }, { headers });
  }

  return Response.json({ ok: false }, { status: 502, headers });
}
