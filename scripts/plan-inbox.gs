function doPost(e) {
  const raw = e.postData && e.postData.contents ? e.postData.contents : "{}";
  let data = {};
  try {
    data = JSON.parse(raw);
  } catch (err) {
    data = {};
  }

  const lines = [
    "New website plan request",
    "",
    "Name: " + (data.name || ""),
    "Email / WhatsApp: " + (data.email || ""),
    "City: " + (data.city || ""),
    "Package: " + (data.package || ""),
    "Currency: " + (data.currency || ""),
    "Price: " + (data.price || ""),
    "Domain: " + (data.domain || ""),
    "",
    "What they want:",
    data.goal || data.message || "(none)",
  ];

  MailApp.sendEmail({
    to: "ryan@webworkco.com, Ryan.mostert58@gmail.com",
    subject: "New website plan: " + (data.package || "Plan") + " — " + (data.name || "Someone"),
    body: lines.join("\n"),
    name: "Web Work Co",
    replyTo: data.email || "ryan@webworkco.com",
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
