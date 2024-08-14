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

const LeftSideBar = () => {
  const user = useSelector((state) => state.auth.user);
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

  const sidebarhandle = (name) => {
    if (name === "Logout") {
      handlelogout();
    } else if (name === "Create") {
      setopen(true);
    } else if (name === "Profile") {
      navigate(`/profile/${user?._id}`);
    }else if (name === "Home") {
      navigate(`/`);
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
          <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
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
        <h1>LOGO</h1>
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
