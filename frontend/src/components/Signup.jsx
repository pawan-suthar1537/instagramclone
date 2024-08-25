import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const Signup = () => {
  useEffect(() => {
    document.title = "SIgnup";
  }, []);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const ChangeInputHandler = (e) => {
    setInput((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/user/register`,
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
          username: "",
          email: "",
          password: "",
        });
        navigate("/login");
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
        onSubmit={handleSignup}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-5">
          <div className="mb-4 flex items-center justify-center text-center font-bold text-xl">
            <img
              src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e9/d3/51/e9d35161-58c1-5ba7-66d1-f51dcae69707/Prod-0-0-1x_U007emarketing-0-7-0-85-220.png/246x0w.webp"
              className="h-10 w-10"
              alt=""
            />
          </div>
          <p className="text-sm text-center">
            create an account to see photos and videos from your friends.
          </p>
        </div>
        <div>
          <Label className="font-semibold" htmlFor="email">
            Username
          </Label>
          <Input
            type="text"
            value={input.username}
            name="username"
            onChange={ChangeInputHandler}
            placeholder="Username"
            className="focus-visible:ring-transparent"
          />
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
        <Link to="/login">
          <p className="text-sm text-blue-500 text-end">
            Already Have an Account?
          </p>
        </Link>
        <Button type="submit" className="text-white">
          {loading ? <Spinner /> : "Signup"}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
