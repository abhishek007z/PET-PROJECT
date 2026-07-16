import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";


export const completeProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      profileImage,
      address,
      city,
      state,
      country,
      pincode,
    } = req.body;

    const user = req.user;
    

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.profileImage = profileImage || user.profileImage;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.pincode = pincode || user.pincode;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });

  } catch (error) {
    next(error);
  }
};