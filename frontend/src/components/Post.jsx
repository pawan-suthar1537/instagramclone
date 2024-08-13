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

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeventhandler = (e) => {
    const inputtext = e.target.value;
    if (inputtext.trim()) {
      setText(inputtext);
    } else {
      setText("");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post?.author?.profilepic} alt="userpic" />
          </Avatar>
          <h1>{post?.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-center text-sm">
            <Button variant="ghost" className="cursor-pointer w-fit font-bold">
              unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit font-bold">
              Favorite
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Delete
            </Button>
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
      <span className="font-medium block mb-2">
        {post?.likes?.length} likes
      </span>
      <p>
        <span className="font-medium mr-2">{post?.author?.username}</span>
        {post?.caption}
      </p>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        view total {post?.comments?.length} comments
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
        {text && <span className="text-[#3BADF8]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
