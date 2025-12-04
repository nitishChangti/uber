import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

let socket = null;

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isConnected: false,
  },
  reducers: {
    setConnected: (state) => {
      state.isConnected = true;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
    },
  },
});

export const { setConnected, setDisconnected } = socketSlice.actions;

// ✅ Connect to Socket.IO server
export const connectSocket = (url = "http://localhost:5000", token
) => (dispatch) => {
  if (!socket) {
    console.log("🧠 Initializing socket...");
    socket = io(url, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token },
    });

    socket.on("connect", () => {
      alert('Socket connected');
      console.log("✅ Connected to Socket.IO:", socket.id);
      dispatch(setConnected());
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      dispatch(setDisconnected());
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });
  }
};

// ✅ Disconnect Socket.IO
export const disconnectSocket = () => (dispatch) => {
  if (socket) {
    socket.disconnect();
    socket = null;
    dispatch(setDisconnected());
  }
};

// ✅ Send message to server
export const sendMessage = (eventName, message) => () => {
  if (socket && socket.connected) {
    console.log("📤 Sending socket event:", eventName, message);
    socket.emit(eventName, message);
  } else {
    console.warn("⚠️ Socket not connected — cannot send:", eventName);
  }
};

// ✅ Listen for messages from server
export const receiveMessage = (eventName, callback) => () => {
  if (socket) {
    console.log('socket of receive ',socket,eventName,callback);
    // socket.off(eventName); // prevent duplicate listeners
      // remove same callback (prevents duplicates)
  socket.off(eventName, callback);

    socket.on(eventName, callback);
  } else {
    console.warn("⚠️ Socket not initialized — cannot receive:", eventName);
  }
};

export default socketSlice.reducer;
