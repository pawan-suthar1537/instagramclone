import React from "react";
import { useState, useEffect } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import CreatePostDialog from "./CreatePostDialog";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setToken, setUser, setuserprofile } from "@/redux/slice/AuthSlice";
import { setPosts, setSelectedPost } from "@/redux/slice/PostSlice";
import { setclearnotification } from "@/redux/slice/NotificationSlice";
import { Button } from "./ui/button";
import { useSwipeable } from "react-swipeable";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const { likenotification } = useSelector((state) => state.notification);
  const [open, setOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/api/user/logout`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setToken(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setuserprofile(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const clearNotification = () => {
    dispatch(setclearnotification([]));
  };

  const handleSidebar = (name) => {
    if (name === "Logout") {
      handleLogout();
    } else if (name === "Create") {
      setCreatePostOpen(true);
    } else if (name === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (name === "Home") {
      navigate(`/`);
    } else if (name === "Message") {
      navigate(`/chat`);
    }
    if (isMobile) setOpen(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setOpen(true),
    onSwipedRight: () => setOpen(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const sidebarItems = [
    { icon: <Home />, name: "Home" },
    { icon: <Search />, name: "Search" },
    { icon: <TrendingUp />, name: "Explore" },
    { icon: <MessageCircle />, name: "Message" },
    { icon: <Heart />, name: "Notifications" },
    { icon: <PlusSquare />, name: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilepic} alt="@shadcn" />
          <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      name: "Profile",
    },
    { icon: <LogOut />, name: "Logout" },
  ];

  return (
    <div {...swipeHandlers} className="">
      {isMobile ? (
        <>
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="bg-white text-black p-5 stickey top-0 z-50"
          >
            <span className="text-lg">X</span>
          </Button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            className="p-4 z-50"
          >
            <div className="mb-6 flex items-center justify-between">
              <Typography variant="h5" color="blue-gray">
                Instagram Clone
              </Typography>
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </div>
            <div>
              {sidebarItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSidebar(item.name)}
                  className="flex items-center gap-5 p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </Drawer>
          <CreatePostDialog open={createPostOpen} setopen={setCreatePostOpen} />
        </>
      ) : (
        <div className="hidden md:block fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
          <div className="flex flex-col">
            <div className="my-4 flex items-center font-bold text-xl text-center">
              <img src="./instagra.png" className="h-10 w-10" alt="" />
              <span className="ml-2">Instagram Clone</span>
            </div>
            <div>
              {sidebarItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSidebar(item.name)}
                  className="flex items-center gap-5 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3"
                >
                  {item.icon}
                  <span className="select-none">{item.name}</span>
                  {item.name === "Notifications" &&
                    likenotification.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div>
                            <Button
                              size="icon"
                              className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600"
                            >
                              {likenotification.length}
                            </Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div>
                            {likenotification.length === 0 ? (
                              <p>No new Notifications</p>
                            ) : (
                              likenotification.map((notification, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 my-2"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        notification?.userdetails?.profilepic
                                      }
                                      alt="userpic"
                                    />
                                    <AvatarFallback>
                                      {notification?.userdetails?.username?.charAt(
                                        0
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notification?.userdetails?.username}
                                    </span>{" "}
                                    liked your post
                                  </p>
                                  <button onClick={clearNotification}>X</button>
                                </div>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                </div>
              ))}
            </div>
          </div>
          <CreatePostDialog open={createPostOpen} setopen={setCreatePostOpen} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
