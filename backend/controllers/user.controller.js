import CustomError from "../middlewares/customerror.js";
import { trycatchasyncerror } from "../middlewares/trycatchasync.js";
import { User } from "../models/user-model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/Token.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";
import { Post } from "../models/post-model.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // End of stream
  return stream;
};

export const registerUser = trycatchasyncerror(async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!(username && email && password)) {
      return next(new CustomError("All fields are required", 400));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(
        new CustomError(`User already exists with this ${email}`, 400)
      );
    }

    const hashedpaassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedpaassword,
    });

    res.status(201).json({
      success: true,
      message: `${username} registered successfully`,
      data: user,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const loginUser = trycatchasyncerror(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return next(new CustomError("Email is required", 400));
    }
    if (!password) {
      return next(new CustomError("Password is required", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError("Invalid email or password", 401));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(new CustomError("Invalid  password", 401));
    }
    const token = await generateToken(user);

    const populatedposts = await Promise.all(
      user.posts.map(async (postid) => {
        const postData = await Post.findById(postid);
        if (postData.author.equals(user._id)) {
          return postData;
        }
        return null;
      })
    );

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilepic: user.profilepic,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      followings: user.followings,
      posts: populatedposts,
      bookmark: user.bookmark,
    };

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: `Welcome back ${user.username}`,
        data: userData,
        token,
      });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const logoutUser = trycatchasyncerror(async (req, res, next) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const getprofile = trycatchasyncerror(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmark");
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const editprofile = trycatchasyncerror(async (req, res, next) => {
  const { userid } = req.user;
  const { bio, gender } = req.body;
  const profilepic = req.file;

  try {
    const user = await User.findById(userid);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    let profilePicUrl = user.profilepic;
    if (profilepic) {
      try {
        const fileStream = bufferToStream(profilepic.buffer);

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `profilepic/user/${req.user.username}`,
              public_id: `${req.user.username}-profilepic`,
              use_filename: true,
            },
            (error, result) => {
              if (error) {
                return reject(
                  new CustomError(
                    `Failed to upload profilepic: ${error.message}`,
                    400
                  )
                );
              }
              resolve(result);
            }
          );

          fileStream.pipe(uploadStream);
        });

        profilePicUrl = uploadResult.secure_url;
      } catch (error) {
        return next(
          new CustomError(`Failed to upload profilepic: ${error.message}`, 400)
        );
      }
    }

    user.bio = bio || user.bio;
    user.gender = gender || user.gender;
    user.profilepic = profilePicUrl;

    await user.save();
    res.status(200).json({
      success: true,
      message: `Dear ${user.username}, Profile updated successfully`,
      data: user,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const suggestedusers = trycatchasyncerror(async (req, res, next) => {
  const { userid } = req.user;
  try {
    const suggesteduserss = await User.find({ _id: { $ne: userid } });

    if (!suggesteduserss && suggestedusers.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No suggested users found",
      });
    }
    res.status(200).json({
      success: true,
      data: suggesteduserss,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const followOrUnfollow = trycatchasyncerror(async (req, res, next) => {
  const followkrnewala = req.user.userid; // User who is trying to follow/unfollow
  const jiskofollowkrunga = req.params.id; // User who is being followed/unfollowed

  if (followkrnewala === jiskofollowkrunga) {
    return next(new CustomError("You cannot follow yourself", 400));
  }

  const user = await User.findById(followkrnewala);
  const targetUser = await User.findById(jiskofollowkrunga);

  if (!user || !targetUser) {
    return next(new CustomError("User not found", 404));
  }

  const isFollowing = user.followings.includes(jiskofollowkrunga);

  if (isFollowing) {
    await Promise.all([
      User.updateOne(
        { _id: followkrnewala },
        { $pull: { followings: jiskofollowkrunga } }
      ),
      User.updateOne(
        { _id: jiskofollowkrunga },
        { $pull: { followers: followkrnewala } }
      ),
    ]);
    return res.status(200).json({
      success: true,
      message: `Unfollowed ${targetUser.username} successfully`,
    });
  } else {
    await Promise.all([
      User.updateOne(
        { _id: followkrnewala },
        { $push: { followings: jiskofollowkrunga } }
      ),
      User.updateOne(
        { _id: jiskofollowkrunga },
        { $push: { followers: followkrnewala } }
      ),
    ]);
    return res.status(200).json({
      success: true,
      message: `Followed ${targetUser.username} successfully`,
    });
  }
});
