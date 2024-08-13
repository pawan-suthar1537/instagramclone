import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import Spinner from "./Spinner";
import { toast } from "sonner";
import { Image } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const CreatePostDialog = ({ open, setopen }) => {
  const [image, setimage] = useState("");
  const [caption, setcaption] = useState("");
  const [imagepreview, setimagepreview] = useState("");
  const [loading, setloading] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const imageref = useRef();
  const filechangehandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setimage(file);
      const dataurl = await readFileAsDataURL(file);
      setimagepreview(dataurl);
    }
  };

  const CreatePostHandler = async (e) => {
    e.preventDefault();

    try {
      setloading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      if (imagepreview) {
        formData.append("image", image);
      }

      console.log(formData);
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/post/createpost`,

        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "failed to create post");
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setopen(!open)}>
          <DialogHeader className=" text-center font-semibold">
            Create New Post
          </DialogHeader>
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage alt="img" src="https://github.com/shadcn.png" />
              {/* <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback> */}
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">Username</h1>
              <span className="text-gray-600 text-xs">Bio here</span>
            </div>
          </div>
          {/* captio inpout */}
          <Textarea
            value={caption}
            onChange={(e) => setcaption(e.target.value)}
            className="focus-visible:ring-transparent border-none"
            placeholder="Write a Caption"
          />
          {imagepreview && (
            <div className="w-full flex items-center h-64 justify-center">
              <img
                src={imagepreview}
                alt="previewimage"
                className="object-cover rounded-lg h-full w-full"
              />
            </div>
          )}
          <input
            ref={imageref}
            type="file"
            name="image"
            id="image"
            onChange={filechangehandler}
            className="hidden"
          />
          <Button
            onClick={() => imageref.current.click()}
            className="w-fit flex gap-2 mx-auto justify-center items-center bg-[#0095F6] hover:bg-[#007bcd]"
          >
            Select image
            <span>
              <Image size={15} />
            </span>
          </Button>
          {imagepreview &&
            (loading ? (
              <Button>
                Please Wait.. <Spinner />
              </Button>
            ) : (
              <Button
                onClick={CreatePostHandler}
                className="w-full"
                type="submit"
              >
                Post
              </Button>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePostDialog;
