import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import socket from "../socket";

function MobileCamera() {
    const [connected, setConnected] = useState(false);
    const videoRef = useRef(null);
    const peerRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            if (!navigator.mediaDevices) {
                alert("Camera access requires HTTPS. Please use HTTPS or ngrok.");
                return;
            }

            try {
                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                    });

                streamRef.current = stream;

                videoRef.current.srcObject = stream;

            } catch (err) {
                console.log(err);
                alert(err.message);
            }
        };

        startCamera();

        socket.on("answer", async (answer) => {
            await peerRef.current.setRemoteDescription(answer);
        });

        return () => {
            socket.off("answer");
        };

    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center px-6">

            <div className="max-w-xl w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">

                <h1 className="text-3xl font-bold text-white text-center">
                    📱 SmartFit Mobile Camera
                </h1>

                <p className="text-slate-400 text-center mt-3">
                    Use your phone as a high-quality AI fitness camera.
                </p>

                <div className="mt-6 space-y-2 text-slate-300">
                    <p>✅ Better pose detection</p>
                    <p>✅ Wider camera angle</p>
                    <p>✅ No external webcam required</p>
                </div>

                <Button
                    onClick={() => {
                        setConnected(true);

                        peerRef.current = new RTCPeerConnection({
                            iceServers: [
                                {
                                    urls: "stun:stun.l.google.com:19302"
                                }
                            ]
                        });

                        socket.on("candidate", async (candidate) => {
                            if (peerRef.current) {
                                await peerRef.current.addIceCandidate(candidate);
                            }
                        }
                        );

                        streamRef.current?.getTracks().forEach(track => {
                            peerRef.current.addTrack(
                                track,
                                streamRef.current
                            );
                        });

                        peerRef.current.onicecandidate = (event) => {
                            if (event.candidate) {
                                socket.emit("candidate", event.candidate);
                            }
                        };

                        const createOffer = async () => {

                            const offer = await peerRef.current.createOffer();

                            await peerRef.current.setLocalDescription(offer);

                            socket.emit("offer", offer);
                        };

                        createOffer();

                        socket.emit("camera_connected");
                    }}
                    disabled={connected}
                    className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600"
                >
                    {connected ? "Camera Connected" : "Connect Camera"}
                </Button>

                <div className="mt-8">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-2xl border border-slate-700"
                    />
                </div>

                <div className="mt-6 text-center">
                    <span
                        className={`inline-block px-4 py-2 rounded-full ${connected
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                            }`}
                    >
                        Status: {connected ? "🟢 Camera Connected" : "🟡 Ready To Connect"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MobileCamera;