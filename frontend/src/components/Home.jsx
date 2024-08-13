import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSideBar from "./RightSideBar";
import Usegetallposts from "@/hooks/Usegetallposts";
import useGetSuggestedUsers from "@/hooks/usegetsuggestedusers";

const Home = () => {
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
