from aiortc import (RTCPeerConnection, RTCSessionDescription)
from aiortc.sdp import candidate_from_sdp
from socket_server import sio
from processed_video_track import ProcessedVideoTrack
import webrtc_receiver

async def emit_camera_status(status):

    webrtc_receiver.phone_connected = (
        status == "connected"
    )

    await sio.emit(
        "camera_status",
        {"status": status}
    )

@sio.event
async def camera_connected(sid):
    await emit_camera_status("connected")
    
@sio.event
async def camera_disconnected(sid):
    await emit_camera_status("disconnected")
    
@sio.event
async def disconnect(sid):
    await emit_camera_status("disconnected")
    
@sio.event
async def offer(sid, data):
    peer_connection = RTCPeerConnection()
    webrtc_receiver.peer_connection = peer_connection
    processed_track = ProcessedVideoTrack()
    peer_connection.addTrack(processed_track)
    
    @peer_connection.on("track")
    async def on_track(track):
        
        if track.kind == "video":
            while True:
                frame = await track.recv()
                img = frame.to_ndarray(format="bgr24")
                
                if img.shape != getattr(
                    webrtc_receiver,
                    "last_shape",
                    None
                ):
                    webrtc_receiver.last_shape = img.shape
                
                with webrtc_receiver.frame_lock:
                    webrtc_receiver.latest_frame = img

    offer = RTCSessionDescription(
        sdp=data["sdp"],
        type=data["type"]
    )

    await peer_connection.setRemoteDescription(offer)

    answer = await peer_connection.createAnswer()

    await peer_connection.setLocalDescription(answer)

    await sio.emit(
        "answer",
        {
            "sdp": peer_connection.localDescription.sdp,
            "type": peer_connection.localDescription.type
        }
    )

@sio.event
async def answer(sid, data):

    await sio.emit("answer", data)
    
@sio.event
async def candidate(sid, candidate):

    if webrtc_receiver.peer_connection is None:
        return

    rtc_candidate = candidate_from_sdp(
        candidate["candidate"]
        .replace("candidate:", "")
    )

    rtc_candidate.sdpMid = candidate["sdpMid"]
    
    rtc_candidate.sdpMLineIndex = candidate["sdpMLineIndex"]

    await webrtc_receiver.peer_connection.addIceCandidate(rtc_candidate)
    
@sio.event
async def viewer_offer(sid, data):

    viewer_peer_connection = RTCPeerConnection()

    webrtc_receiver.viewer_peer_connection = (
        viewer_peer_connection
    )

    processed_track = ProcessedVideoTrack()

    viewer_peer_connection.addTrack(
        processed_track
    )

    offer = RTCSessionDescription(
        sdp=data["sdp"],
        type=data["type"]
    )

    await viewer_peer_connection.setRemoteDescription(
        offer
    )

    answer = await viewer_peer_connection.createAnswer()

    await viewer_peer_connection.setLocalDescription(
        answer
    )

    await sio.emit(
        "viewer_answer",
        {
            "sdp": viewer_peer_connection.localDescription.sdp,
            "type": viewer_peer_connection.localDescription.type
        },
        to=sid
    )
    
@sio.event
async def viewer_candidate(sid, candidate):

    if webrtc_receiver.viewer_peer_connection is None:
        return

    rtc_candidate = candidate_from_sdp(
        candidate["candidate"].replace(
            "candidate:",
            ""
        )
    )

    rtc_candidate.sdpMid = candidate["sdpMid"]

    rtc_candidate.sdpMLineIndex = (
        candidate["sdpMLineIndex"]
    )

    await webrtc_receiver.viewer_peer_connection.addIceCandidate(
        rtc_candidate
    )