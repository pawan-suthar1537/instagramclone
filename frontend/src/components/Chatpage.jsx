import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setselecteduser } from "@/redux/slice/AuthSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";

const Chatpage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { suggestedusers, selecteduser } = useSelector((state) => state.auth);
  const { onlineusers } = useSelector((state) => state.chat);
  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-400" />
        <div className="overflow-y-auto h-[80vh] ">
          {suggestedusers.map((Suser) => {
            const isOnline = onlineusers.includes(Suser?._id);
            return (
              <div
                onClick={() => dispatch(setselecteduser(Suser))}
                key={Suser._id}
                className="flex gap-3 p-3 items-center hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={Suser.profilepic} />
                  <AvatarFallback>{Suser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{Suser.username}</span>
                  <span
                    className={`text-xs font-bold  ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selecteduser ? (
        <>
          <section className="flex-1 border-l-2 border-l-gray-300 flex flex-col h-full">
            <div className="flex gap-3 items-center px-3  py-2 border-b border-t-gray-300 sticky top-0 bg-white z-10">
              <Avatar className="">
                <AvatarImage src={selecteduser.profilepic} />
                <AvatarFallback>
                  {selecteduser.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{selecteduser.username}</span>
              </div>
            </div>
            <Messages selecteduser={selecteduser} />
            <div className="flex items-center p-4 border-t border-t-gray-300">
              <Input
                type="text"
                placeholder="Type your message here"
                className="flex-1 mr-2 focus-visible:ring-transparent"
              />
              <Button>Send</Button>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center mx-auto">
            <MessageCircleCode className="w-32 h-32 my-4" />
            <h1 className="font-medium text-xl">your messages</h1>
            <span>Send a message to start chat </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatpage;
