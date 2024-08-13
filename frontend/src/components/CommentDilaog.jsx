import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/slice/PostSlice";

const CommentDilaog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const { selectedpost, posts } = useSelector((store) => store.post);

  const [comment, setComment] = useState([]);

  const [text, setText] = useState("");

  useEffect(() => {
    if (selectedpost) {
      setComment(selectedpost.comments);
    }
  }, [selectedpost]);

  const changeEventHandler = (e) => {
    const textInput = e.target.value;
    setText(textInput.trim() ? textInput : "");
  };

  const commenthandler = async (e) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/post/comment/${
          selectedpost?._id
        }`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedcommentdata = [...comment, res.data.data];
        console.log(updatedcommentdata);
        setComment(updatedcommentdata);

        const updatedpostdata = posts.map((p) =>
          p._id === selectedpost._id
            ? { ...p, comments: updatedcommentdata }
            : p
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
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(!open)}
        className="max-w-4xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2 ">
            <img
              src={selectedpost?.image}
              alt="postimage"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col items-between ">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedpost?.author?.profilepic}
                      alt="userpic"
                    />
                    <AvatarFallback>
                      {selectedpost?.author?.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold ">
                    {selectedpost?.author?.username}
                  </Link>
                  {/* <span>bio here</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-center text-sm">
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit font-bold"
                  >
                    unfollow
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit font-bold"
                  >
                    Favorite
                  </Button>
                  <Button variant="ghost" className="cursor-pointer w-fit ">
                    Delete
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-94 p-4">
              {comment?.map((cmnt) => (
                <Comment key={cmnt._id} cmnt={cmnt} />
              ))}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={changeEventHandler}
                  type="text"
                  placeholder="Add a comment..."
                  className="outline-none w-full border border-gray-300 p-2 rounded-lg"
                />
                <Button disabled={!text.trim()} onClick={commenthandler}>
                  add comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDilaog;
