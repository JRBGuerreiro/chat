import mongoose from "mongoose";
import config from "./index.js";

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`;

//Form a MONGO connection
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Connection successful
mongoose.connection.on("connected", () => {
  console.log("Mongo has connected successfully");
});

//Reconnected
mongoose.connection.on("reconnected", () => {
  console.log(" has reconnected");
});

//Error :(
mongoose.connection.on("error", (error) => {
  console.log("Mongo connection error", error);
  mongoose.disconnect;
});

//Disconnected
mongoose.connection.on("disconnected", () => {
  console.log("Mongo connection terminated");
});
