import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDilaog = ({ open, setOpen }) => {
  const [text, setText] = useState("");

  const changeeventhandler = (e) => {
    const textinput = e.target.value;
    if (textinput.trim()) {
      setText(textinput);
    } else {
      setText("");
    }
  };

  const sendmesssgaehandler = (e) => {
    alert("sendmesssgaehandler");
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
              src="https://images.unsplash.com/photo-1722928852010-5ebdd0ed568f?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">username</Link>
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
              comments aayenge
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={changeeventhandler}
                  type="text"
                  placeholder="Add a comment..."
                  className="outline-none w-full border border-gray-300 p-2 rounded-lg"
                />
                <Button disabled={!text.trim()} onclick={sendmesssgaehandler}>
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
