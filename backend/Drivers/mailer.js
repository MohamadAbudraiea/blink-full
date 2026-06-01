const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function sendEmail(receiver, subject, htmlContent) {
  try {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      throw new Error("BREVO_API_KEY not found in environment variables");
    }

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
        email: "technical@blink-cars.com",
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

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      emailData,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": apiKey,
        },
      },
    );

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", response.data.messageId);
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}

// Usage examples:
// sendEmail("user@example.com", "Welcome!", "<h1>Hello</h1>")
// sendEmail("test@gmail.com", "Test Subject", "<p>Test content</p>")

module.exports = sendEmail;
