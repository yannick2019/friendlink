import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { hashString } from "./index.js";
import EmailVerification from "../models/emailVerification.js";
import PasswordReset from "../models/passwordReset.js";

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendVerificationEmail = async (user, res) => {
  const { _id, email, lastName } = user;

  const token = _id + uuidv4();

  const link = APP_URL + "users/verify/" + _id + "/" + token;

  // mail options
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email verification",
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:orange"><img src="./backend/asset/image/hand-holding-hand-solid.png" alt="" style="width:30px"><span>Action requise : Activate your FriendLink account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${lastName}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You've recently created an account on FriendLink. To finalize your registration, verify your email adress.</span></div><a href="${link}" style="width:200px;padding:10px 15px;background:orange;color:#fff;text-decoration:none;font-weight:600">Confirm your email (expires in 1 hour)</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">FriendLink helps you stay connected with all your friends. Once you register on FriendLink, you can easily share photos, organize events, and enjoy many other features.</span></div></div>`
  }

  try {
    const hashedToken = await hashString(token);

    const newVerifiedEmail = await EmailVerification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    if (newVerifiedEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message: "Verification email has been sent to your account. Check your email for further instructions"
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: "Verification email failed" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong with email verification process" })
  }
};

export const resetPasswordLink = async (user, res) => {
  const { _id, email } = user;
  const token = _id + uuidv4();
  const link = APP_URL + "users/reset-password/" + _id + "/" + token;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Password reset",
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:orange"><img src="./backend/asset/image/hand-holding-hand-solid.png" alt="" style="width:30px"><span>Action requise : Reset password</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>From FriendLink</span><div style="padding:20px 0"><span style="padding:1.5rem 0">Password reset link. Please click the link below to reset your password.</span></div><a href="${link}" style="width:200px;padding:10px 15px;background:orange;color:#fff;text-decoration:none;font-weight:600">Reset your password (expires in 10 minutes)</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">FriendLink helps you stay connected with all your friends.</span></div></div>`
  }

  try {
    const hashedToken = await hashString(token);

    const resetEmail = await PasswordReset.create({
      userId: _id,
      email: email,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    if (resetEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message: "Reset Password link has been sent to your account. Check your email."
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: "Reset Password failed" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong with Reset Password process" });
  }
};