function doPost(e) {
  const data = JSON.parse(e.postData.contents);
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
    data.goal || "(none)",
  ];

  GmailApp.sendEmail(
    "ryan.mostert2006@gmail.com",
    "New website plan: " + (data.package || "Plan") + " — " + (data.name || "Someone"),
    lines.join("\n"),
    {
      name: "Ryan Studio",
      replyTo: data.email || "ryan.mostert2006@gmail.com",
    }
  );

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
