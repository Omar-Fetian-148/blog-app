import nodemailer from "nodemailer";
import { config } from "dotenv";
config()

export default async function sendEmail(to, OTP) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_USERNAME,
      to,
      subject: "Verify Your Email",
      html: `<p>Your OTP: ${OTP}</p>`,
      headers: {
        priority: 'high',
      },
      dsn: {
        id: 'messageId',
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: process.env.NODEMAILER_USERNAME
      },
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};