import CustomError from "../middlewares/customerror.js";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      userid: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
};

export const isAuthenticated = (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("Token not found", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new CustomError("Invalid Token", 401));
    }
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new CustomError("Invalid or expired token, please log in again", 401)
    );
  }
};
