import { setuserprofile } from "@/redux/slice/AuthSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const UseGetUserProfile = (userid) => {
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();
  useEffect(() => {
    const GetUserProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_SERVER_URL}/api/user/${userid}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("UseGetUserProfile", res.data.data);
        if (res.data.success) {
          dispatch(setuserprofile(res.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetUserProfile();
  }, [userid]);
};

export default UseGetUserProfile;
