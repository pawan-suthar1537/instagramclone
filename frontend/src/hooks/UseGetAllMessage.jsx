import { setmessagess } from "@/redux/slice/ChatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Usegetallmessages = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { selecteduser } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!selecteduser?._id) return;
    const fetchallmessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_SERVER_URL}/api/message/all/${
            selecteduser?._id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setmessagess(res.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchallmessages();
  }, [selecteduser, token, dispatch]);
};

export default Usegetallmessages;
