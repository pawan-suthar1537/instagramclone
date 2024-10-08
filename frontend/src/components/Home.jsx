import { Outlet, useNavigate } from "react-router-dom";
import Feed from "./Feed";
import RightSideBar from "./RightSideBar";
import Usegetallposts from "@/hooks/Usegetallposts";
import useGetSuggestedUsers from "@/hooks/usegetsuggestedusers";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Home";
  }, []);
  Usegetallposts();
  useGetSuggestedUsers();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSideBar />
    </div>
  );
};

export default Home;
