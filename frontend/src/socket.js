import { io } from "socket.io-client";

const socket = io(
    "http://192.168.29.213:8000",
    {
        transports: ["websocket"]
    }
);

export default socket;