import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setonlineusers } from "@/redux/slice/ChatSlice";
import { setlikenotification } from "@/redux/slice/NotificationSlice";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      socketRef.current = io(`${import.meta.env.VITE_API_SERVER_URL}`, {
        query: { userid: user?._id },
        transports: ["websocket"],
      });

      const socketio = socketRef.current;

      socketio.on("getonlineusers", (onlineusers) => {
        dispatch(setonlineusers(onlineusers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setlikenotification(notification));
      });

      return () => {
        socketio.disconnect();
        socketRef.current = null;
      };
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
