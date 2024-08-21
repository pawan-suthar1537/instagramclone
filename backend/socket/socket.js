import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://linkedincloneback.vercel.app",
      "https://instagramclonefrontend.vercel.app",
      "https://instagramclone-backend-4vd3.onrender.com",
    ],
    methods: ["GET", "POST"],
  },
});

const usersocketmap = {};

export const getreceiversocketid = (receiverid) => {
  const receiver = usersocketmap[receiverid];
  return receiver;
};

io.on("connection", (socket) => {
  const userid = socket.handshake.query.userid;
  if (userid) {
    usersocketmap[userid] = socket.id;
    // console.log(`user with ${userid} and ${socket.id} connected`);
  }

  io.emit("getonlineusers", Object.keys(usersocketmap));

  socket.on("disconnect", () => {
    if (userid) {
      // console.log(`user with ${userid} and ${socket.id} disconnected`);
      delete usersocketmap[userid];
    }
    io.emit("getonlineusers", Object.keys(usersocketmap));
  });
});

export { app, server, io };
