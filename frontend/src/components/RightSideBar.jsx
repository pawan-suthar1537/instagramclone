import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSideBar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilepic} alt="userpic" />
            <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="">
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          {/* <span>{user?.bio.slice(0, 20) || "Bio here.."}</span> */}
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSideBar;
