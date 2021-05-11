import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
//routes
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";

//middlewares
import { decode } from "./middlewares/jwt.js";

//mongo connection
import "./config/mongo.js";

//socket config
import socketio from "socket.io";
import WebSocket from "./utils/WebSocket.js";

const app = express();

//Get port and assign it to express

const port = process.env.PORT || "3000";
app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set up our routes
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

//any 404 to be caught and forwarded to error handler
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint does not exist",
  });
});

//Create our HTTP server
const server = http.createServer(app);

//Create socket connection
global.io = socketio.listen(server); //assign global.io(window object in browser if we talked about frontend) to socketio, ports should start listening on the server listening for events
global.io.on("connection", WebSocket.connection);

//listen in port
server.listen(port);

//Event listener for HTTP server "listening" event
server.on("listening", () => {
  console.log(`Listening on port http://localhost:${port}`);
});
