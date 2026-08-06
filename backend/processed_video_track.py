from aiortc import VideoStreamTrack
from av import VideoFrame
import webrtc_receiver
import asyncio


class ProcessedVideoTrack(VideoStreamTrack):

    async def recv(self):

        while True:

            with webrtc_receiver.processed_frame_lock:
                frame = (
                    None
                    if webrtc_receiver.processed_frame is None
                    else webrtc_receiver.processed_frame.copy()
                )

            if frame is not None:
                break

            await asyncio.sleep(0.01)

        video_frame = VideoFrame.from_ndarray(
            frame,
            format="bgr24"
        )

        pts, time_base = await self.next_timestamp()

        video_frame.pts = pts
        video_frame.time_base = time_base

        return video_frame