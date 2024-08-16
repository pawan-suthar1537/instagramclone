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
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/slice/AuthSlice";
import { useState } from "react";
import CreatePostDialog from "./CreatePostDialog";
import { setPosts, setSelectedPost } from "@/redux/slice/PostSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setclearnotification } from "@/redux/slice/NotificationSlice";

const LeftSideBar = () => {
  const user = useSelector((state) => state.auth.user);
  const { likenotification } = useSelector((state) => state.notification);
  const [open, setopen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlelogout = async (e) => {
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
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const clearnotification = () => {
    dispatch(setclearnotification([]));
  };

  const sidebarhandle = (name) => {
    if (name === "Logout") {
      handlelogout();
    } else if (name === "Create") {
      setopen(true);
    } else if (name === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (name === "Home") {
      navigate(`/`);
    } else if (name === "Message") {
      navigate(`/chat`);
    }
  };

  const sidebaritems = [
    {
      icon: <Home />,
      name: "Home",
    },
    {
      icon: <Search />,
      name: "Search",
    },
    {
      icon: <TrendingUp />,
      name: "Explore",
    },
    {
      icon: <MessageCircle />,
      name: "Message",
    },
    {
      icon: <Heart />,
      name: "Notifications",
    },
    {
      icon: <PlusSquare />,
      name: "Create",
    },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilepic} alt="@shadcn" />
          <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      name: "Profile",
    },
    {
      icon: <LogOut />,
      name: "Logout",
    },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <div className="my-4 flex items-center font-bold text-xl text-center ">
          <img src="./instagra.png" className="h-10 w-10" alt="" />
          <span className="ml-2">Instagram Clone</span>
        </div>
        <div>
          {sidebaritems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarhandle(item.name)}
                key={index}
                className="flex items-center gap-5 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3"
              >
                {item.icon}
                <span className="select-none">{item.name}</span>
                {item.name === "Notifications" &&
                  likenotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger aschild>
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
                            likenotification.map((notification, index) => {
                              return (
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
                                      {notification?.userdetails?.username}{" "}
                                    </span>
                                    liked your post
                                  </p>
                                  <button onClick={clearnotification}>X</button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePostDialog open={open} setopen={setopen} />
    </div>
  );
};

export default LeftSideBar;
