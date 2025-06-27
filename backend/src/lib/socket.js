import { Server } from "socket.io";

const userSocketMap = {};
let io;

export const getReceiverSocketId = (userId) => userSocketMap[userId];
export const getIO = () => io;

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(` ${userId} connected via socket: ${socket.id}`);
    } else {
      console.log(" No userId provided in socket handshake");
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
      for (const key in userSocketMap) {
        if (userSocketMap[key] === socket.id) {
          delete userSocketMap[key];
          break;
        }
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};
