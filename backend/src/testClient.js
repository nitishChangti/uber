
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  socket.emit("message", "Hello from Postman alternative client!");
});

socket.on("reply", (data) => {
  console.log("Server replied:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
