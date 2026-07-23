import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    label: {
      type: String,
      trim: true,
      required: true,
      default: "Other",
    },

    fullName: {
      type: String,
      trim: true,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
      required: true,
    },

    pincode: {
      type: String,
      trim: true,
      required: true,
    },

    houseNo: {
      type: String,
      trim: true,
      required: true,
    },

    area: {
      type: String,
      trim: true,
      required: true,
    },

    landmark: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      required: true,
    },

    state: {
      type: String,
      trim: true,
      required: true,
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    location: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;