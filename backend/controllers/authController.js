import mongoose from "mongoose";
import { Account } from "../models/accountModel.js";
import User from "../models/userModel.js";
import { sendVerificationEmail } from "../utils/mail.js";
import { generateVerificationOtp } from "../utils/otp.js";
import { loginSchema, SignupSchema } from "../validators/authSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const validateSignupData = SignupSchema.safeParse(req.body);
    if (!validateSignupData.success) {
      console.warn("Invalid signup attempt:", req.body);
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: validateSignupData.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const { name, phone, email, password } = validateSignupData.data;

    const userExists = await User.findOne({
      $or: [{ email }, { phone }],
    }).session(session);

    if (userExists) {
      console.warn("Duplicate signup attempt for:", email, phone);
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message:
          userExists.email === email
            ? "User already exists with this email"
            : "User already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateVerificationOtp();
    const otpExpiry = 10 * 60 * 1000; // 10 minutes

    const [newUser] = await User.create(
      [
        {
          name,
          phone,
          email,
          password: hashedPassword,
          emailVerificationOtp: otp,
          emailVerificationOtpExpireAt: Date.now() + otpExpiry,
        },
      ],
      { session }
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          balance: Math.floor(Math.random()*1000),
          transactions: [],
        },
      ],
      { session }
    );

    await session.commitTransaction();

    try {
      await sendVerificationEmail(email, otp);
    } catch (mailErr) {
      console.warn("Email send failed (non-critical):", mailErr);
    }

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: "localhost"
    });

    return res.status(201).json({
      success: true,
      message: "Signed up successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email id missing, signup again " });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email manupulated. signup again. No user found ",
        });
    }
    if (user.verified) {
      return res
        .status(400)
        .json({ success: false, message: "user is already verified" });
    }
    const otp = generateVerificationOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpireAt = otpExpiry;
    await user.save();

    await sendVerificationEmail(user.email, otp);
    return res
      .status(200)
      .json({ success: true, message: "New OTP has been sent to your email" });
  } catch (error) {
    console.error("Resend OTP error ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }

  if (!email) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Email is missing. Please signup again.",
      });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.emailVerificationOtp !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    if (user.emailVerificationOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    user.verified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpireAt = null;
    await user.save();

    // auto-login user after verification

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: "localhost"
    });

    return res
      .status(200)
      .json({ success: true, message: "You have been verified successfully" });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const loginDataValidation = loginSchema.safeParse(req.body);

    if (!loginDataValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: loginDataValidation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    const { email, phone, password } = loginDataValidation.data;
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid login details" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
  domain: "localhost"
})
    return res
      .status(200)
      .json({ success: true, message: "Loged In successfully" });
  } catch (error) {
    console.error("Error in login ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found" });
    }
    const userDetails = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      verified: user.verified,
    };
    return res.status(200).json({ success: true, user: userDetails });
  } catch (error) {
    console.error("Error in getting user details ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  const userId = req.userId;
  const filter = req.query.filter || "";

  try {
    if (filter === "") {
      const users = await User.find().select("name email phone verified _id");

      if (users.length == 0) {
        return res
          .status(200)
          .json({ success: true, message: "Currently no user is present" });
      }
      const filteredUsers = users.filter((user) => {
        return user._id.toString() !== userId;
      });
      return res.status(200).json({ success: true, users: filteredUsers });
    }

    const searchQuerryUsers = await User.find({
      $or: [
        {
          name: {
            $regex: filter, $options: "i"
          },
        },
        {
          phone: {
            $regex: filter,
          },
        },
      ],
    }).select("name email phone verified _id")

    const filteredSearchedUsers = searchQuerryUsers.filter((user) => {
      return user._id.toString() !== userId
    })
    return res.status(200).json({
      success: true,
      users: filteredSearchedUsers
    });
  } catch (error) {
    console.error("Error in Fetching users ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
