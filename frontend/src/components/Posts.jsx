import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((state) => state.post);
  return (
    <div className="w-full flex flex-col items-center md:items-start">
      <div className="block lg:hidden mb-4 w-full flex items-center justify-start text-start font-bold text-xl">
        <img src="./instagra.png" className="h-10 w-10" alt="Instagram Logo" />
        <span className="ml-1 text-xl">Instagram</span>
      </div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
