// import { Server } from 'socket.io';

// export const initializeSocket = (server) => {
//     const io = new Server(server, {
//         cors: {
//             origin: '*',
//             methods: ['GET', 'POST'],
//             credentials: true
//         },
//         transports: ['websocket', 'polling']
//     });

//     io.on('connection', (socket) => {
//         console.log('✅ New client connected:', socket.id);

//         // Immediately send welcome message
//         socket.emit('welcome', {
//             message: 'Connected to server!',
//             socketId: socket.id
//         });

//         // Echo back any message received
//         socket.onAny((eventName, ...args) => {
//             console.log(`📨 Received event: ${eventName}`, args);
//             socket.emit('echo', {
//                 event: eventName,
//                 data: args
//             });
//         });

//         socket.on('disconnect', () => {
//             console.log('❌ Client disconnected:', socket.id);
//         });
//     });

//     console.log('🔌 Socket.IO initialized');
//     return io;
// };

// socket.js
import { Server } from "socket.io";
import User from "./models/user.models.js";
import Captain from "./models/Captain.models.js";
let io; // global variable to store the io instance

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://uber-seven-beta.vercel.app"], // your frontend (Vite, React, etc.)
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // // Example: listening for client message
    // socket.on("message", (data) => {
    //   console.log("📩 Received message from client:", data);

    //   // Send a reply to that same client
    //   socket.emit("reply", `Server got your message: ${data}`);
    // });

    // // Broadcast to all connected clients
    // socket.on("broadcast", (msg) => {
    //   io.emit("broadcastMessage", msg);
    // });

    socket.on("join", async (data) => {
      const { userId, userType } = data;
      console.log("user", userId, userType);
      if (userType === "user") {
        const user = await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
        });
        console.log("updated user in socket");
      } else if (userType === "captain") {
        const captain = await Captain.findByIdAndUpdate(userId, {
          socketId: socket.id,
        });
        console.log("updated client in socket");
      }
    });

    socket.on("update-location-captain", async (data) => {
      console.log("data is", data);

      const { userId, location } = data;

      // Validate GeoJSON structure
      if (!location || !Array.isArray(location.coordinates)) {
        return console.log("❌ Invalid location data received:", location);
      }

      const [lng, lat] = location.coordinates; // GeoJSON correct order

      console.log("📍 Updating captain location:", userId, { lat, lng });

      try {
        const captain = await Captain.findByIdAndUpdate(
          userId,
          {
            location: {
              type: "Point",
              coordinates: [lng, lat], // GeoJSON format: [longitude, latitude]
            },
          },
          { new: true }
        );

        if (!captain) {
          return console.log(`❌ Captain not found for ID: ${userId}`);
        }

        console.log("✔ Updated Captain Location:", captain.location);
      } catch (err) {
        console.log("❌ Error updating captain location:", err);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", socket.id, "Reason:", reason);
    });
  });

  console.log("🧠 Socket.IO initialized successfully");
}

// Optional helper to use io in other modules
// export function getIO() {
//   if (!io) {
//     throw new Error("Socket.io not initialized!");
//   }
//   return io;
// }

export default function sendMessageToSocketId(socketId, messageObject) {
  console.log("sending socket message", socketId, messageObject);
  if (!socketId) return console.error("user sokcet is not available");
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
    console.log("sent a socket data to frontend");
  } else {
    console.error("Socket.io not initialized!");
  }
}
