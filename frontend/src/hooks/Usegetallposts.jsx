import { setPosts } from "@/redux/slice/PostSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Usegetallposts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchallposts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_SERVER_URL}/api/post/allposts`,
          {
            withCredentials: true,
          }
        );
        
        if (res.data.success) {
          dispatch(setPosts(res.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchallposts();
  }, []);
};

export default Usegetallposts;
