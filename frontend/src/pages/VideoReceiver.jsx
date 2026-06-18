import { useEffect, useRef, useState } from "react";
import socket from "../socket";

function VideoReceiver() {
    const [status, setStatus] = useState("Waiting");
    const peerRef = useRef(null);

    useEffect(() => {
        socket.on("connect", () => { });

        socket.on("camera_status", (data) => {
            setStatus(data.status);
        });

        socket.on("offer", async (offer) => {
            if (peerRef.current) {
                return;
            }

            peerRef.current = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            });

            socket.on("candidate", async (candidate) => {
                if (peerRef.current) {
                    await peerRef.current.addIceCandidate(
                        candidate
                    );
                }
            }
            );

            peerRef.current.ontrack = (event) => {
                const remoteVideo = document.getElementById("remoteVideo");

                remoteVideo.srcObject = event.streams[0];
            };

            peerRef.current.addTransceiver("video", {
                direction: "recvonly"
            });

            await peerRef.current.setRemoteDescription(offer);

            const answer = await peerRef.current.createAnswer();

            await peerRef.current.setLocalDescription(answer);

            socket.emit("answer", answer);
        });

        return () => {
            socket.off("connect");
            socket.off("camera_status");
            socket.off("offer");
            socket.off("candidate");
        };
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-6">

            <div className="max-w-4xl w-full bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-3xl p-8">

                <h1 className="text-4xl font-bold text-white text-center">
                    📹 SmartFit Live Camera
                </h1>

                <p className="text-slate-400 text-center mt-3">
                    Scan the QR code from SmartFit to connect your phone camera.
                </p>

                <div className="mt-8 h-125 rounded-3xl border border-slate-700 bg-slate-950 flex items-center justify-center">
                    <video
                        id="remoteVideo"
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full rounded-3xl object-cover"
                    />
                </div>

                <div className="mt-6 text-center">
                    <span
                        className={`inline-block px-4 py-2 rounded-full ${status === "connected"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                            }`}
                    >
                        {status === "connected"
                            ? "🟢 Mobile Camera Connected"
                            : "🟡 Waiting For Camera"}
                    </span>
                </div>

            </div>
        </div>
    );
}

export default VideoReceiver;