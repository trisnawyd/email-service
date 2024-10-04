import { config } from "dotenv";
import nodemailer from "nodemailer";
import { Liquid } from "liquidjs";
import fs from "fs";
import path from "path";

config();
// Create a transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services or SMTP settings
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // Ideally, use environment variables for sensitive data
  },
});

// Initialize LiquidJS engine
const engine = new Liquid();

// Function to send email
const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: object
) => {
  // Load the Liquid template
  const templatePath = path.join(
    __dirname,
    "templates",
    `${templateName}.html`
  );
  const template = fs.readFileSync(templatePath, "utf-8");

  // Render the template with dynamic data
  const html = await engine.parseAndRender(template, data);

  // Set up email options
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Example usage
const main = async () => {
  const emailData = {
    THEME_COLOR_DICTIONARY: {
      primary: { main: "#01B2C9" },
    },
    brandName: "TheBaliBibble",
    LOGO: "./powered-by-travlr@2x.png",
    customerName: "Trisna Wahyudi",
    subscriptionInformation: [
      "Yearly VIP Subscription Plan",
      "Price: $50/year",
      "Auto-renew very 12 months",
      "Effective date: 24 Jun 2023",
      "Renewal date: 24 Jun 2024",
      "Non-refundable",
    ],
    LINKS: {
      restartSubscription: "www.google.com",
      helpCenter: "www.google.com",
      contactUs: "www.google.com",
      copyrightMessage: "© 2024 TheBaliBibble. All Rights Reserved.",
      auPhoneNumber: {
        text: "081237754778",
      },
      businessHour: "9AM to 5PM Middle Indonesian Time",
    },
    paymentType: "Visa",
    totalPrice: "$1000",
    EMAIL_VERIFICATION_CODE: "7777",
  };

  await sendEmail(
    "wipramg@travlr.com",
    "TEST SUBJECT",
    "email-verification",
    emailData
  );
};

main().catch(console.error);
