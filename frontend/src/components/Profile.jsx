import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UseGetUserProfile from "@/hooks/UseGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { setUser } from "@/redux/slice/AuthSlice";
import { toast } from "sonner";

const Profile = () => {
  const params = useParams();

  const [tab, settab] = useState("post");

  const userid = params.id;

  useEffect(() => {
    document.title = "Profile";
  }, []);

  UseGetUserProfile(userid);

  const { userprofile, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isloggedin = user?._id === userprofile?._id;
  const [isFollowing, setIsFollowing] = useState(
    user?.followings?.includes(userprofile?._id) || false
  );

  const followUnfollowHandler = async () => {
    try {
      if (!user) {
        toast.error("User is not logged in.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/user/followunfollow/${
          userprofile?._id
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const { followers, followings } = res.data;

        dispatch(
          setUser({
            ...user,
            followings: followings,
          })
        );

        setIsFollowing(!isFollowing);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to follow/unfollow user");
    }
  };

  const displayposts =
    tab === "post" ? userprofile?.posts : userprofile?.bookmark;

  const handletab = (tab) => {
    settab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center justify-center w-1/2">
          <Avatar className="w-40 h-40">
            <AvatarImage src={userprofile?.profilepic} />
            <AvatarFallback>{userprofile?.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex my-6 flex-col items-start justify-center w-1/2">
          <div className="flex gap-6  items-start justify-center">
            <h2 className="text-xl font-bold mt-4">{userprofile?.username}</h2>
            {isloggedin ? (
              <>
                <Link to={"/profile/edit"}>
                  <Button variant="secondary" className="h-8 mt-4 bg-slate-400">
                    Edit Profile
                  </Button>
                </Link>
                <Button variant="secondary" className="h-8 mt-4 bg-slate-400">
                  View Archive{" "}
                </Button>
                <Button variant="secondary" className="h-8 mt-4 bg-slate-400">
                  Ad tools
                </Button>
              </>
            ) : (
              <>
                {isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-8 mt-4 "
                      onClick={followUnfollowHandler}
                    >
                      Unfollow
                    </Button>
                    <Link to={"/chat"}>
                      <Button variant="secondary" className="h-8 mt-4 ">
                        Message
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    className="text-white h-8 mt-4 bg-[#557dff] hover:bg-[#557dff]"
                    onClick={followUnfollowHandler}
                  >
                    Follow
                  </Button>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-10 my-6 mb-2">
            <p>{userprofile?.posts.length} posts</p>
            <p>{userprofile?.followers.length} followers</p>

            <p>{userprofile?.followings.length} following</p>
          </div>
          <span className="font-semibold">
            {userprofile?.bio || "Bio Here"}
          </span>
        </div>
      </div>
      {/* feed */}
      <div className="border-t border-t-gray-200">
        <div className="flex items-center justify-center gap-10 text-sm">
          <span
            className={`py-3 cursor-pointer ${
              tab === "post" ? "font-bold" : ""
            }`}
            onClick={() => handletab("post")}
          >
            POST
          </span>
          {user?._id === userprofile?._id && (
            <span
              className={`py-3 cursor-pointer ${
                tab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handletab("saved")}
            >
              SAVED
            </span>
          )}
          <span className="py-3 cursor-pointer">REELS</span>
          <span className="py-3 cursor-pointer">TAGS</span>
        </div>
        {/* displaying */}
        <div className="grid grid-cols-3 gap-1">
          {displayposts?.map((post) => {
            return (
              <div key={post._id} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  alt="post"
                  className="rounded-sm my-2 aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
