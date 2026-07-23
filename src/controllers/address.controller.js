import Address from "../models/address.model.js";

/*
====================================================
GET ALL SHIPPING ADDRESSES
Home -> User Profile
Others -> Address Collection
====================================================
*/
export const getAddresses = async (req, res, next) => {
  try {
    const user = req.user;

    const savedAddresses = await Address.find({
      user: user._id,
    }).sort({
      createdAt: -1,
    });

    // Home address comes directly from User profile
    const homeAddress = {
      _id: "home",
      type: "profile",
      label: "Home",

      fullName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),

      phone: user.phone || "",

      fullAddress:
        user.address?.fullAddress || "",

      city:
        user.address?.city || "",

      state:
        user.address?.state || "",

      country:
        user.address?.country || "",

      pincode:
        user.address?.pincode || "",

      location: {
        latitude:
          user.address?.location?.latitude ?? null,

        longitude:
          user.address?.location?.longitude ?? null,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully.",
      data: [
        homeAddress,
        ...savedAddresses,
      ],
    });
  } catch (error) {
    next(error);
  }
};


/*
====================================================
ADD NEW SHIPPING ADDRESS
Office / Friend House / Other
====================================================
*/
export const addAddress = async (req, res, next) => {
  try {
    const {
      label,
      fullName,
      phone,
      pincode,
      houseNo,
      area,
      landmark,
      city,
      state,
      country,
      latitude,
      longitude,
    } = req.body;

    // Basic validation
    if (
      !label ||
      !fullName ||
      !phone ||
      !pincode ||
      !houseNo ||
      !area ||
      !city ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required address fields.",
      });
    }

    const address = await Address.create({
      user: req.user._id,

      label,
      fullName,
      phone,
      pincode,

      houseNo,
      area,
      landmark: landmark || "",

      city,
      state,
      country: country || "India",

      location: {
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};


/*
====================================================
UPDATE SAVED SHIPPING ADDRESS
Home is NOT updated from this API.
Home continues to use /auth/profile
====================================================
*/
export const updateAddress = async (
  req,
  res,
  next
) => {
  try {
    const { addressId } = req.params;

    if (addressId === "home") {
      return res.status(400).json({
        success: false,
        message:
          "Home address must be updated from profile.",
      });
    }

    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const {
      label,
      fullName,
      phone,
      pincode,
      houseNo,
      area,
      landmark,
      city,
      state,
      country,
      latitude,
      longitude,
    } = req.body;

    if (label !== undefined) {
      address.label = label;
    }

    if (fullName !== undefined) {
      address.fullName = fullName;
    }

    if (phone !== undefined) {
      address.phone = phone;
    }

    if (pincode !== undefined) {
      address.pincode = pincode;
    }

    if (houseNo !== undefined) {
      address.houseNo = houseNo;
    }

    if (area !== undefined) {
      address.area = area;
    }

    if (landmark !== undefined) {
      address.landmark = landmark;
    }

    if (city !== undefined) {
      address.city = city;
    }

    if (state !== undefined) {
      address.state = state;
    }

    if (country !== undefined) {
      address.country = country;
    }

    if (latitude !== undefined) {
      address.location.latitude = latitude;
    }

    if (longitude !== undefined) {
      address.location.longitude = longitude;
    }

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};


/*
====================================================
DELETE SAVED SHIPPING ADDRESS
Home cannot be deleted
====================================================
*/
export const deleteAddress = async (
  req,
  res,
  next
) => {
  try {
    const { addressId } = req.params;

    if (addressId === "home") {
      return res.status(400).json({
        success: false,
        message:
          "Home address cannot be deleted.",
      });
    }

    const address = await Address.findOneAndDelete({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      data: {
        addressId,
      },
    });
  } catch (error) {
    next(error);
  }
};