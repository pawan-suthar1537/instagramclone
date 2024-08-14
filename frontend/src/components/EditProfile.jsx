import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Spinner from "./Spinner";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/slice/AuthSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageref = useRef();
  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);
  const [Input, setInput] = useState({
    profilepic: user?.profilepic,
    bio: user?.bio,
    gender: user?.gender,
  });

  const filechangehandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...Input, profilepic: file });
    }
  };

  const selectchangehandler = (value) => {
    setInput({ ...Input, gender: value });
  };

  const editprofile = async (e) => {
    e.preventDefault();
    console.log("input for edit profile", Input);
    const formData = new FormData();
    formData.append("bio", Input.bio);
    formData.append("gender", Input.gender);
    if (Input.profilepic) {
      formData.append("profilepic", Input.profilepic);
    }
    try {
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      setloading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/user/profile/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },

          withCredentials: true,
        }
      );
      console.log("res", res.data.data);
      if (res.data.success) {
        const updateduserdata = {
          ...user,
          bio: res.data.data?.bio,
          gender: res.data.data.gender,
          profilepic: res.data.data.profilepic, 
        };
        dispatch(setUser(updateduserdata));
        toast.success(res.data.message);
        navigate("/profile/" + user._id);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "failed to upadte profile");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <Avatar className="">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="">
              <h1 className="font-semibold text-sm">
                <h1 className="font-bold text-sm">{user?.username}</h1>
              </h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here.."}
              </span>
            </div>
          </div>
          <input
            onChange={filechangehandler}
            ref={imageref}
            type="file"
            className="hidden"
            id="profilepic"
          />
          <Button
            onClick={() => imageref?.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            change photo
          </Button>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-2">Bio</h4>
          <Textarea
            value={Input.bio}
            onChange={(e) => setInput({ ...Input, bio: e.target.value })}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h4 className="font-bold text-sm mb-2">Gender</h4>
          <Select
            defaultValue={Input.gender}
            onValueChange={selectchangehandler}
          >
            <SelectTrigger className="focus-visible:ring- w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={editprofile}
            className="w- bg-[#0095F6] hover:bg-[#318bc7]"
          >
            {loading ? <Spinner /> : "Update Profile"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
