import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeSingleLine = (value, maxLength) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const normalizeMessage = (value, maxLength) =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getContactEmailConfig = () => {
  const port = Number(process.env.SMTP_PORT || 587);
  const secureEnv = String(process.env.SMTP_SECURE || "")
    .trim()
    .toLowerCase();

  return {
    host: String(process.env.SMTP_HOST || "").trim(),
    port,
    secure: secureEnv ? secureEnv === "true" : port === 465,
    user: String(process.env.SMTP_USER || "").trim(),
    pass: String(process.env.SMTP_PASS || "").trim(),
    toEmail:
      String(process.env.CONTACT_TO_EMAIL || "").trim() ||
      String(process.env.SMTP_USER || "").trim(),
    fromEmail:
      String(process.env.CONTACT_FROM_EMAIL || "").trim() ||
      String(process.env.SMTP_USER || "").trim(),
  };
};

export const sendContactMessage = async (req, res) => {
  try {
    const name = normalizeSingleLine(req.body?.name, 80);
    const email = normalizeSingleLine(req.body?.email, 120);
    const subject = normalizeSingleLine(req.body?.subject, 150);
    const message = normalizeMessage(req.body?.message, 2000);

    if (name.length < 2) {
      return res.status(400).json({ message: "Please provide a valid name." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email." });
    }
    if (subject.length < 3) {
      return res.status(400).json({ message: "Please provide a valid subject." });
    }
    if (message.length < 10) {
      return res.status(400).json({ message: "Message must be at least 10 characters." });
    }

    const { host, port, secure, user, pass, toEmail, fromEmail } =
      getContactEmailConfig();

    if (!host || !port || !user || !pass || !toEmail || !fromEmail) {
      return res.status(500).json({
        message:
          "Contact email is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and CONTACT_TO_EMAIL in Backend/.env",
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user,
        pass,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.verify();
    await transporter.sendMail({
      from: `Furnito Contact <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `[Furnito Contact] ${subject}`,
      text: [
        "New contact form submission",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong><br />${safeMessage}</p>
      `,
    });

    return res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("sendContactMessage error:", error);
    const code = String(error?.code || "").toUpperCase();
    if (code === "EAUTH") {
      return res
        .status(502)
        .json({ message: "SMTP authentication failed. Check SMTP_USER/SMTP_PASS." });
    }
    if (code === "ESOCKET" || code === "ETIMEDOUT" || code === "ECONNECTION") {
      return res
        .status(502)
        .json({ message: "SMTP server connection failed. Check SMTP_HOST/SMTP_PORT/SMTP_SECURE." });
    }
    return res.status(500).json({ message: "Unable to send message right now." });
  }
};
