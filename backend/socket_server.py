import socketio
import webrtc_receiver

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

socket_app = socketio.ASGIApp(
    sio,
    socketio_path="socket.io"
    )

@sio.event
async def camera_connected(sid):

    print("Phone Connected")

    webrtc_receiver.phone_connected = True

    await sio.emit(
        "camera_status",
        {
            "status": "connected"
        }
    )

@sio.event
async def connect(sid, environ):
    print("Connected:", sid)


@sio.event
async def disconnect(sid):

    print("Disconnected:", sid)

    webrtc_receiver.phone_connected = False

    await sio.emit(
        "camera_status",
        {
            "status": "disconnected"
        }
    )