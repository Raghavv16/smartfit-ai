from aiortc import VideoStreamTrack
from av import VideoFrame
import webrtc_receiver
import asyncio


class ProcessedVideoTrack(VideoStreamTrack):

    async def recv(self):

        # Wait until the AI processor produces a frame
        while webrtc_receiver.processed_frame is None:

            await asyncio.sleep(0.005)

        # Always grab the newest processed frame
        with webrtc_receiver.processed_frame_lock:

            if webrtc_receiver.processed_frame is None:
                return await self.recv()

            frame = webrtc_receiver.processed_frame.copy()

        # Convert OpenCV frame to WebRTC frame
        video_frame = VideoFrame.from_ndarray(
            frame,
            format="bgr24"
        )

        # Give WebRTC proper realtime timestamps
        pts, time_base = await self.next_timestamp()

        video_frame.pts = pts
        video_frame.time_base = time_base

        return video_frame