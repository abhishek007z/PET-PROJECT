import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.mailHost,
  port: Number(env.mailPort),
  secure: false,
  auth: {
    user: env.mailUser,
    pass: env.mailPass,
  },
});

export const sendOTPEmail = async (email, otp) => {
 const info = await transporter.sendMail({
    from: `"Pet Store" <${env.mailUser}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
 
};