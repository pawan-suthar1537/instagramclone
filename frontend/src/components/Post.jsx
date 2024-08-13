import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import CommentDilaog from "./CommentDilaog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/slice/PostSlice";

const Post = ({ post }) => {
  const user = useSelector((state) => state.auth.user);
  const { token } = useSelector((state) => state.auth);

  const { posts } = useSelector((state) => state.post);

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setliked] = useState(post.likes.includes(user?._id) || false);
  const [postlike, setpostlike] = useState(post.likes.length);
  const [comment, setcomment] = useState(post.comments);

  const dispatch = useDispatch();

  const changeventhandler = (e) => {
    const inputtext = e.target.value;
    if (inputtext.trim()) {
      setText(inputtext);
    } else {
      setText("");
    }
  };

  const deleteposthandler = async (e) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_SERVER_URL}/api/post/deletepost/${
          post._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(post._id);

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedpostsafterdelete = posts.filter(
          (item) => item?._id !== post?._id
        );
        dispatch(setPosts(updatedpostsafterdelete));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "failed to delete post");
    }
  };

  const followunfollow = async (e) => {
    try {
      console.log("token", token);
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/user/followunfollow/${
          post?.author?._id
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "failed to follow user");
    }
  };
  const likedislike = async (e) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/post/likedislikepost/${
          post?._id
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedlikes = liked ? postlike - 1 : postlike + 1;
        setpostlike(updatedlikes);
        setliked(!liked);
        const updatedposts = posts.map((p) =>
          p._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        );
        dispatch(setPosts(updatedposts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "failed to like post");
    }
  };

  const commenthandler = async (e) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/post/comment/${post?._id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedcommentdata = [...comment, res.data.data];
        setcomment(updatedcommentdata);

        const updatedpostdata = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedcommentdata } : p
        );

        dispatch(setPosts(updatedpostdata));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "failed to comment on post");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post?.author?.profilepic} alt="userpic" />
            <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1>{post?.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-center text-sm">
            <Button variant="ghost" className="cursor-pointer w-fit font-bold">
              follow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit font-bold">
              Favorite
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deleteposthandler}
                variant="ghost"
                className="cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post?.image}
        alt="postimage"
        className="object-cover rounded-lg my-2 w-full h-[90%] "
      />
      <div className="">
        <div className="flex items-center justify-between my-2">
          <div className="flex  items-center gap-3">
            <Heart
              style={liked ? { fill: "red" } : { fill: "" }}
              onClick={likedislike}
              size={"25px"}
              className="cursor-pointer hover:text-gray-600"
            />
            <MessageCircle
              onClick={() => setOpen(true)}
              className="cursor-pointer hover:text-gray-600"
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark className="cursor-pointer hover:text-gray-600" />
        </div>
      </div>
      <span className="font-medium block mb-2">{postlike} likes</span>
      <p>
        <span className="font-medium mr-2">{post?.author?.username}</span>
        {post?.caption}
      </p>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        view total {comment?.length} comments
      </span>
      <CommentDilaog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between my-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          name="text"
          value={text}
          onChange={changeventhandler}
        />
        {text && (
          <span
            onClick={commenthandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
