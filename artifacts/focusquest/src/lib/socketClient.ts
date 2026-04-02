import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (url: string = "http://localhost:3001"): Socket => {
  if (!socket) {
    socket = io(url, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
