"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const email_config_1 = __importDefault(require("../configs/email.config"));
const sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: name, email, subject, message",
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }
        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to your own email address
            replyTo: email, // User's email as reply-to
            subject: `Contact Form: ${subject}`,
            html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">

  <!-- Header -->
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="margin: 0; font-size: 24px; color: #111827;">📩 New Contact Form Submission</h2>
    <p style="margin: 5px 0 0; font-size: 14px; color: #6b7280;">You've received a new message from your website</p>
  </div>

  <!-- Content Box -->
  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
    <p style="margin: 10px 0; font-size: 15px;"><strong style="color: #111827;">Name:</strong> ${name}</p>
    <p style="margin: 10px 0; font-size: 15px;"><strong style="color: #111827;">Email:</strong> ${email}</p>
    <p style="margin: 10px 0; font-size: 15px;"><strong style="color: #111827;">Subject:</strong> ${subject}</p>

    <p style="margin: 16px 0 6px; font-size: 15px; font-weight: 600; color: #111827;">Message:</p>
    <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 14px; color: #374151; line-height: 1.6;">
      ${message}
    </div>
  </div>

  <!-- Footer -->
  <p style="margin-top: 30px; font-size: 12px; text-align: center; color: #9ca3af;">
    This email was automatically sent from your portfolio contact form.
  </p>

</div>
      `,
        };
        // Send the email
        await email_config_1.default.sendMail(mailOptions);
        // Send success response
        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!",
        });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while sending your message. Please try again.",
        });
    }
};
exports.sendContactEmail = sendContactEmail;
