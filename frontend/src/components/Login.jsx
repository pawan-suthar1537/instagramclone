import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const Login = () => {
  const navigate = useNavigate();
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
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem,
            aspernatur.
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
