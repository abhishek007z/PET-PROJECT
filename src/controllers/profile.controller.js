import User from "../models/user.model.js";

export const completeProfile = async (
  req,
  res,
  next
) => {
  try {
    const {
      firstName,
      lastName,
      phone,

      fullAddress,
      city,
      state,
      country,
      pincode,

      latitude,
      longitude,
    } = req.body;

    const user = req.user;

    user.firstName = firstName;
    user.lastName = lastName;

    if (phone) {
      user.phone = phone;
    }

    user.address = {
      fullAddress: fullAddress || "",
      city: city || "",
      state: state || "",
      country: country || "",
      pincode: pincode || "",

   location: {
  latitude: latitude ?? null,
  longitude: longitude ?? null,
},
    };

    user.profileCompleted = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};