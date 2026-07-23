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

export const updateProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      country,
      city,
    } = req.body;

    const user = req.user;

    if (firstName !== undefined) {
      user.firstName = firstName;
    }

    if (lastName !== undefined) {
      user.lastName = lastName;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (!user.address) {
      user.address = {};
    }

    if (country !== undefined) {
      user.address.country = country;
    }

    if (city !== undefined) {
      user.address.city = city;
    }

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