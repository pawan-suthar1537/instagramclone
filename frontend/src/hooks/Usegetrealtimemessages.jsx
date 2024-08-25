import { setmessagess } from "@/redux/slice/ChatSlice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Usegetallrealtimemessages = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);

  const handleNewMessage = useCallback(
    (newmessage) => {
      dispatch(setmessagess((prevMessages) => [...prevMessages, newmessage]));
    },
    [dispatch]
  );

  useEffect(() => {
    socket?.on("newmsg", handleNewMessage);
    return () => {
      socket?.off("newmsg", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  return null;
};

export default Usegetallrealtimemessages;
