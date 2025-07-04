const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup (in-memory storage, no disk write)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Nodemailer setup — replace with real Gmail App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "GMAIL_USER",
    pass: "GMAIL_PASS", // Gmail App Password
  },
});

//  Quote Form API
app.post("/api/quote", upload.single("file"), async (req, res) => {
  const data = req.body;
  const file = req.file;

  const mailOptions = {
    from: '"Quote Form" <manoj@mecrox.in>',
    to: "manoj@mecrox.in",
    subject: "New Quote Request",
    text: JSON.stringify(data, null, 2),
    attachments: file
      ? [{ filename: file.originalname, content: file.buffer }]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Quote submitted!" });
  } catch (error) {
    console.error("Quote form error:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

//  Contact Form API
app.post("/api/contact", upload.single("file"), async (req, res) => {
  const {
    firstName, lastName, email, phone,
    company, expertise, capability,
    industry, comments,
  } = req.body;

  const file = req.file;

  const mailOptions = {
    from: '"Contact Form" <manoj@mecrox.in>',
    to: "manoj@mecrox.in",
    subject: "New Contact Form Submission",
    text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${company}
Expertise: ${expertise}
Capability: ${capability}
Industry: ${industry}

Comments:
${comments}
    `.trim(),
    attachments: file
      ? [{ filename: file.originalname, content: file.buffer }]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent!" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

//  Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
