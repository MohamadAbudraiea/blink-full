const dotenv = require("dotenv");
const path = require("path");
const nodemailer = require("nodemailer");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
async function sendEmail(receiver, subject, htmlContent) {
  try {
    // Validate required parameters
    if (!receiver) {
      throw new Error("Receiver email is required");
    }

    if (!subject) {
      throw new Error("Subject is required");
    }

    if (!htmlContent) {
      throw new Error("HTML content is required");
    }

    const emailData = {
      sender: {
        name: "Blink Cars Technical",
        email: `${process.env.EMAIL_USER}`,
      },
      to: [
        {
          name: "Customer",
          email: receiver, // Just use the email string directly
        },
      ],
      subject: subject,
      htmlContent: htmlContent,
    };

    console.log("📧 Sending email...");
    console.log("To:", receiver);
    console.log("Subject:", subject);

    await transporter.sendMail({
      from: emailData.sender.email,
      to: emailData.to[0].email,
      subject: emailData.subject,
      html: emailData.htmlContent,
    });

    console.log(`✅ Email sent successfully! to ${receiver}`);
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = sendEmail;
