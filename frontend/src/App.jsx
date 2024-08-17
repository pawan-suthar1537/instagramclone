import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Chatpage from "./components/Chatpage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/slice/Socketslice";
import { setonlineusers } from "./redux/slice/ChatSlice";
import { setlikenotification } from "./redux/slice/NotificationSlice";
import ProtectedRoute from "./components/ProtectedRoute";

const browserrouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <Chatpage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  useEffect(() => {
    if (user) {
      const socketio = io(`${import.meta.env.VITE_API_SERVER_URL}`, {
        query: {
          userid: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));
      // listing events
      socketio.on("getonlineusers", (onlineusers) => {
        dispatch(setonlineusers(onlineusers));
      });

      //  for listen notification
      socketio.on("notification", (notification) => {
        dispatch(setlikenotification(notification));
      });

      return () => {
        socketio.disconnect();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.disconnect();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserrouter} />
    </>
  );
}

export default App;
