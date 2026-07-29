import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,

      select: false,
    },

    displayName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50,
    },

    bio: {
      type: String,
      maxlength: 160,
      default: "",
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },


    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;