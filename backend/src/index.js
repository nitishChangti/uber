import dotenv from "dotenv";

// dotenv.config({
//     path: '../.env'
// });

dotenv.config(); // Automatically loads environment variables from .env file

import connectDB from "./db/index.js";
import http from "http";
import { app } from "./app.js";
import { initializeSocket } from "./socket.js";
const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("Server error:", err);
    });
    // app.listen(process.env.PORT || 3000, () => {
    //     console.log(`Server is running on port ${process.env.PORT || 3000}`);
    // });

    server.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server with socket.io is running on port ${process.env.PORT || 3000}`
      );
    });
  })

  .catch((error) => {
    console.warn("MONGODB db connection failed !!!", error.message);
    console.log("MONGODB db connection failed !!!", error);
  });

import mongoose from "mongoose";

// This loads automatically with nodemon -r dotenv/config
// so you don't need: import 'dotenv/config';
