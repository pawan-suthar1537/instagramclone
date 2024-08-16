import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/slice/AuthSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const ChangeInputHandler = (e) => {
    setInput((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/user/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setToken(res.data.token));
        dispatch(setUser(res.data.data));
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center h-screen w-screen justify-center">
      <form
        action=""
        onSubmit={handleLogin}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-5">
          <div className="mb-4 flex items-center justify-center text-center font-bold text-xl">
            <img src="./instagra.png" className="h-10 w-10" alt="" />
          </div>
          <p className="text-sm text-center">
            login to see photos and videos from your friends.
          </p>
        </div>

        <div>
          <Label className="font-semibold" htmlFor="email">
            Email
          </Label>
          <Input
            type="email"
            value={input.email}
            onChange={ChangeInputHandler}
            name="email"
            placeholder="example@gmail.com"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="font-semibold" htmlFor="email">
            Password
          </Label>
          <Input
            type="password"
            value={input.password}
            onChange={ChangeInputHandler}
            name="password"
            placeholder="********"
            className="focus-visible:ring-transparent"
          />
        </div>
        <Link to="/signup">
          <p className="text-sm text-blue-500 text-end">
            Don't Have an Account?
          </p>
        </Link>
        <Button type="submit" className=" text-white flex text-center gap-5">
          {loading ? <Spinner /> : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
