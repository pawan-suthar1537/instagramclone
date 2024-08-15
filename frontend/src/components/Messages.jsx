import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Messages = ({ selecteduser }) => {
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-2- w-20">
            <AvatarImage src={selecteduser?.profilepic} />
            <AvatarFallback>{selecteduser?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{selecteduser?.username}</span>
          <Link to={`/profile/${selecteduser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              view Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 89].map((msg) => {
          return (
            <div key={msg} className={`flex`}>
              <div>{msg}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
