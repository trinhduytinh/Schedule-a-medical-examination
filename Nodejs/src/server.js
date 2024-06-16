import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import db from "./models";
const http = require("http");
require("dotenv").config();

let app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.URL_REACT,
    methods: ["GET", "POST"],
  },
});

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

const tokenToSocketIdMap = {};

io.on("connection", (socket) => {
  // Emit socket id for doctor
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");

    // Xóa ánh xạ khi socket ngắt kết nối
    for (let token in tokenToSocketIdMap) {
      if (tokenToSocketIdMap[token] === socket.id) {
        delete tokenToSocketIdMap[token];
      }
    }
  });

  // Xác thực token khi bệnh nhân truy cập
  socket.on("verifyToken", async (token) => {
    try {
      let booking = await db.Booking.findOne({ where: { token } });
      if (booking) {
        tokenToSocketIdMap[token] = socket.id; // Ánh xạ token với socket.id
        socket.emit("tokenVerified", {
          success: true,
          booking: booking,
          patientId: token,
        });
      } else {
        socket.emit("tokenVerified", { success: false });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      socket.emit("tokenVerified", { success: false });
    }
  });

  // Gọi bệnh nhân
  socket.on("callUser", (data) => {
    const userToCallSocketId = tokenToSocketIdMap[data.userToCall] || data.userToCall;
    if (userToCallSocketId) {
      io.to(userToCallSocketId).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    } else {
      console.error("User to call not found");
    }
  });

  // Trả lời cuộc gọi
  socket.on("answerCall", (data) => {
    const callerSocketId = tokenToSocketIdMap[data.to] || data.to;
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", data.signal);
    } else {
      console.error("Caller not found");
    }
  });
});

let port = process.env.PORT || 6969;
//Port == undefined => port = 6969

server.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port);
});
