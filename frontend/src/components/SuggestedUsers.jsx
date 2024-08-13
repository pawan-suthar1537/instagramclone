import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedusers } = useSelector((state) => state.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedusers?.map((user) => {
        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div>
              <div className="flex items-center gap-1">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilepic} alt="userpic" />
                    <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="">
                  <h1 className="font-semibold text-sm">
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h1>
                  <span>{user?.bio || "Bio here.."}</span>
                </div>
              </div>
            </div>
            <span className=" text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#2b74a5] ">
              follow
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
