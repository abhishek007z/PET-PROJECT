import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateOTP from "../utils/generateOTP.js";
import { sendOTPEmail } from "../services/mail.service.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = req.body;

    // =========================
    // Validation
    // =========================

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required.",
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // =========================
    // Duplicate Check
    // =========================

//     if (email) {
//    existingUser = await User.findOne({ email });
// }

// if (phone) {
//    existingUser = await User.findOne({ phone });
// }

   const existingUser = await User.findOne({
  $or: [
    ...(email ? [{ email }] : []),
    ...(phone ? [{ phone }] : []),
  ],
});

if (existingUser) {

  // User already verified
  if (existingUser.emailVerified) {
    return res.status(409).json({
      success: false,
      message: "User already exists. Please login.",
    });
  }

  // User exists but NOT verified

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = generateOTP();

  existingUser.firstName = firstName;
  existingUser.lastName = lastName;
  existingUser.password = hashedPassword;
  existingUser.otp = otp;
  existingUser.otpExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await existingUser.save();

  if (email) {
    await sendOTPEmail(email, otp);
  }



  return res.status(200).json({
    success: true,
    message:
      "Account already exists but is not verified. A new OTP has been sent.",
  });
}

    // =========================
    // Password Hash
    // =========================

    const hashedPassword = await bcrypt.hash(password, 10);

    // =========================
    // OTP
    // =========================

    const otp = generateOTP();

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );





    // =========================
    // Save User
    // =========================

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    if (email) {
  await sendOTPEmail(email, otp);
}

    return res.status(201).json({
      success: true,
      message:
        "Signup successful. Please verify your account using OTP.",
      data: {
        id: user._id,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find User

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Email Verification

    if (!user.emailVerified) {
      const otp = generateOTP();

      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      await sendOTPEmail(user.email, otp);

      return res.status(403).json({
        success: false,
        message: "Email not verified. New OTP has been sent.",
      });
    }

    // Compare Password

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate Token

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};


export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    await sendOTPEmail(user.email, otp);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully.",
    });

  } catch (error) {
    next(error);
  }
};



export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {
    next(error);
  }
};

