import Usegetallposts from "@/hooks/Usegetallposts";
import { Heart, MessageCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Explore = () => {
  useEffect(() => {
    document.title = "Explore";
  }, []);
  Usegetallposts();
  const { posts } = useSelector((state) => state.post);
  return (
    <div className="max-w-4xl mx-auto p-4 ">
      <div className="grid grid-cols-4 gap-1">
        {posts?.map((post) => {
          return (
            <div key={post._id} className="relative group cursor-pointer">
              <img
                src={post.image}
                alt="post"
                className="rounded-sm my-2 aspect-square w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
