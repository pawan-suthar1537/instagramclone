import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setselecteduser } from "@/redux/slice/AuthSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { toast } from "sonner";
import { setmessagess } from "@/redux/slice/ChatSlice";

const Chatpage = () => {
  const dispatch = useDispatch();
  const [message, setmessage] = useState("");
  const { user, token } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const { suggestedusers, selecteduser } = useSelector((state) => state.auth);
  const { onlineusers } = useSelector((state) => state.chat);

  const SendMessageHandler = async (receiverid) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_SERVER_URL
        }/api/message/sendmessage/${receiverid}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setmessagess([...messages, res.data.data]));
        toast.success(res.data.message);
        setmessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setselecteduser(null));
    };
  }, []);

  return (
    <div className="flex md:ml-[16%] h-screen">
      {/* User List Section */}
      <section className="w-16 md:w-1/4 h-full border-r border-gray-300 my-8">
        <div className="overflow-y-auto h-[80vh] flex flex-col items-center">
          {suggestedusers.map((Suser) => {
            const isOnline = onlineusers.includes(Suser?._id);
            return (
              <div
                onClick={() => dispatch(setselecteduser(Suser))}
                key={Suser._id}
                className="flex flex-col md:flex-row items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer w-full"
              >
                <Avatar className="w-10 h-10 md:w-14 md:h-14">
                  <AvatarImage src={Suser?.profilepic} />
                  <AvatarFallback>{Suser?.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col">
                  <span className="font-medium">{Suser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
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

      {/* Chat Section */}
      {selecteduser ? (
        <section className="flex-1 border-l-2 border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar className="w-14 h-14">
              <AvatarImage src={selecteduser?.profilepic} />
              <AvatarFallback>{selecteduser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selecteduser.username}</span>
            </div>
          </div>
          <Messages selecteduser={selecteduser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              type="text"
              placeholder="Type your message here"
              className="flex-1 mr-2 focus-visible:ring-transparent"
            />
            <Button onClick={() => SendMessageHandler(selecteduser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto text-center p-4">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium text-xl">Your Messages</h1>
          <span>Send a message to start chat</span>
        </div>
      )}
    </div>
  );
};

export default Chatpage;
