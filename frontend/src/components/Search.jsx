import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  useGetSuggestedUsers();
  const { suggestedusers } = useSelector((state) => state.auth);

  const filteredUsers = suggestedusers?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="my-10">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-start my-5 gap-5"
            >
              <div className="flex items-center gap-2">
                <Link to={`/profile/${user._id}`}>
                  <Avatar>
                    <AvatarImage src={user.profilepic} alt="userpic" />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className="font-semibold text-sm">
                    <Link to={`/profile/${user._id}`}>{user.username}</Link>
                  </h1>
                </div>
              </div>
              <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#2b74a5]">
                follow
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No matched results</p>
        )}
      </div>
    </div>
  );
};

export default Search;
