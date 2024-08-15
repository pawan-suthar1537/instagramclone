import { setmessagess } from "@/redux/slice/ChatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Usegetallrealtimemessages = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const { messages } = useSelector((state) => state.chat);
  useEffect(() => {
    socket?.on("newmsg", (newmessage) => {
      dispatch(setmessagess([...messages, newmessage]));
    });
    return () => {
      socket?.off("newmsg");
    };
  }, [messages, setmessagess]);
};

export default Usegetallrealtimemessages;
