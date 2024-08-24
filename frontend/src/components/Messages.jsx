import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import Usegetallmessages from "@/hooks/UseGetAllMessage";
import Usegetallrealtimemessages from "@/hooks/Usegetrealtimemessages";

const Messages = ({ selecteduser }) => {
  useEffect(() => {
    document.title = "Messages";
  }, []);
  Usegetallrealtimemessages();
  Usegetallmessages();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-14 h-14">
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
        {messages &&
          messages?.map((msg) => {
            return (
              <div
                key={msg}
                className={`flex ${
                  msg.senderid === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.senderid === user?._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
