import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "instaclone",
    });
    console.log("DB Connected: ", conn.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
