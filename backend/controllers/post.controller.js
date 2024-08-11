import { trycatchasyncerror } from "../middlewares/trycatchasync.js";
import sharp from "sharp";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { Post } from "../models/post-model.js";
import { User } from "../models/user-model.js";
import { Comment } from "../models/comment-model.js";
import CustomError from "../middlewares/customerror.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const addpost = trycatchasyncerror(async (req, res, next) => {
  try {
    const { caption } = req.body;

    const image = req.file;
    const author = req.user.userid;
    console.log(author);
    const user = await User.findById(author);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image",
      });
    }

    const optimizedimage = await sharp(image.buffer)
      .resize({
        width: 1000,
        height: 1000,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileuri = `data:image/jpeg;base64,${optimizedimage.toString(
      "base64"
    )}`;

    const cloudinaryres = await cloudinary.uploader.upload(fileuri, {
      folder: `profilepic/posts/${req.user.username}`,
      public_id: `${req.user.username}-post`,
      use_filename: true,
    });

    //creating post
    const post = await Post({
      caption,
      image: cloudinaryres.secure_url,
      author,
      caption,
    });

    await post.save();

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({
      path: "author",
      select: "-password",
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const deletepost = trycatchasyncerror(async (req, res, next) => {
  try {
    const postid = req.params.id;
    const author = req.user.userid;

    const post = await Post.findById(postid);
    if (!post) {
      return next(new CustomError("Post not found", 404));
    }

    if (post.author.toString() !== author) {
      return next(
        new CustomError("You are not authorized to delete this post", 403)
      );
    }

    await Post.findByIdAndDelete(postid);

    // remove post id from user posts array
    let user = await User.findById(author);
    if (user) {
      user.posts.pull(postid);
      await user.save();
    }

    //  delete commets

    await Comment.deleteMany({ post: postid });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const getallposts = trycatchasyncerror(async (req, res, next) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilepic ",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilepic",
        },
      });

    if (post.length === 0) {
      return next(new CustomError("No posts found", 404));
    }

    res.status(200).json({
      success: true,
      message: "All posts",
      data: post,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const getmyallposts = trycatchasyncerror(async (req, res, next) => {
  const { userid } = req.user;
  try {
    const myposts = await Post.find({ author: userid })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "author",
        select: "username profilepic ",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilepic",
        },
      });

    if (!myposts && myposts.length === 0) {
      return next(new CustomError("No posts found", 404));
    }
    res.status(200).json({
      success: true,
      message: "my All posts",
      data: myposts,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const likedislikepost = trycatchasyncerror(async (req, res, next) => {
  const { postid } = req.params;
  const { userid } = req.user;

  try {
    const post = await Post.findById(postid);
    if (!post) {
      return next(new CustomError("Post not found", 404));
    }

    const isLiked = post.likes.includes(userid);

    let message;

    if (isLiked) {
      await post.updateOne({ $pull: { likes: userid } });
      message = `${userid} disliked ${post.caption} successfully`;
    } else {
      await post.updateOne({ $addToSet: { likes: userid } });
      message = `${userid} liked ${post.caption} successfully`;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: `${message}`,
      data: post,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const addcomment = trycatchasyncerror(async (req, res, next) => {
  const postid = req.params.id;
  const commentkrnewalauser = req.user.userid;
  const { text } = req.body;
  try {
    const post = await Post.findById(postid);
    if (!post) {
      return next(new CustomError("Post not found", 404));
    }
    if (!text) {
      return next(new CustomError("Please provide a comment", 400));
    }

    let comment = await Comment.create({
      author: commentkrnewalauser,
      post: postid,
      text,
    });

    comment = await comment.populate("author", "username profilepic");

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: `Comment added successfully on post ${postid}`,
      data: comment,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const getallcommentsofpost = trycatchasyncerror(
  async (req, res, next) => {
    try {
      const postid = req.params.id;
      const comments = await Comment.find({ post: postid }).populate(
        "author",
        "username profilepic"
      );

      if (!comments || comments.length === 0) {
        return next(new CustomError("No comments found on that post", 404));
      }

      res.status(200).json({
        success: true,
        message: "All comments",
        data: comments,
      });
    } catch (error) {
      return next(new CustomError(error.message, 500));
    }
  }
);

export const bookmarkpost = trycatchasyncerror(async (req, res, next) => {
  try {
    const postid = req.params.id;
    const { userid } = req.user;

    const post = await Post.findById(postid);
    if (!post) {
      return next(new CustomError("Post not found", 404));
    }

    const user = await User.findById(userid);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    if (user.bookmark.includes(postid)) {
      await user.updateOne({ $pull: { bookmark: postid } });
      await user.save();
      return res.status(200).json({
        success: true,
        message: `Post ${post._id} removed from bookmarks`,
        data: user,
      });
    } else {
      await user.updateOne({ $push: { bookmark: postid } });
      await user.save();
      return res.status(200).json({
        success: true,
        message: `Post ${post._id} bookmarked`,
        data: user,
      });
    }
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});
