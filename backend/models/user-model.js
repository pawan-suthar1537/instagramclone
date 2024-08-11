import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must be less than 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        validate: {
          validator: (value) => {
            return validator.isEmail(value);
          },
          message: (props) => `${props.value} is not a valid email`,
        },
      },
    password: {
      type: String,
      required: true,
      select: false,
    },

    profilepic: {
      public_id: String,
      url: String,
    },
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmark: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
