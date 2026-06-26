import { io } from "socket.io-client";
import { SOCKET_URL } from "./config";

const socket = io(
    SOCKET_URL,
    {
        transports: ["websocket"]
    }
);

export default socket;