import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token: string) {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token },
      autoConnect: false,
    });
  }

  return socket;
}
