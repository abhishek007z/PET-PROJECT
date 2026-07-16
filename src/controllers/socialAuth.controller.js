import User from "../models/user.model.js";
import googleClient from "../config/google.js";
import generateToken from "../utils/generateToken.js";

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID Token is required.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
    });

    const payload = ticket.getPayload();

    const {
      sub,
      email,
      given_name,
      family_name,
      picture,
      email_verified,
    } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName: given_name || "",
        lastName: family_name || "",
        email,
        profileImage: picture || "",
        googleId: sub,
        emailVerified: email_verified,
      });
    } else {
      user.googleId = sub;
      user.emailVerified = true;

      if (!user.profileImage && picture) {
        user.profileImage = picture;
      }

      await user.save();
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
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


export const facebookLogin = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: "Facebook Login will be integrated during frontend authentication testing.",
  });
};


export const appleLogin = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: "Apple Login will be integrated during frontend authentication testing.",
  });
};